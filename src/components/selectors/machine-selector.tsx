import type { MachineEntity } from 'src/api/types/generated';

import { debounce } from 'es-toolkit';
import { useMemo, useState, useCallback, useEffect } from 'react';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

import { useGetMachineById, useSearchMachine } from 'src/api/hooks/generated/use-machine';

// ----------------------------------------------------------------------

export interface MachineSelectorProps {
  value?: string | null;
  onChange?: (machineId: string | null) => void;
  disabled?: boolean;
  label?: string;
  error?: boolean;
  helperText?: string;
  required?: boolean;
}

export function MachineSelector({
  value,
  onChange,
  disabled = false,
  label = 'Machine',
  error = false,
  helperText,
  required = false,
}: MachineSelectorProps) {
  const [inputValue, setInputValue] = useState('');
  const [debouncedInputValue, setDebouncedInputValue] = useState('');
  const [selectedMachine, setSelectedMachine] = useState<MachineEntity | null>(null);

  // Debounce search input with 500ms delay
  const debouncedSetSearch = useMemo(
    () => debounce((searchValue: string) => {
      setDebouncedInputValue(searchValue);
    }, 500),
    []
  );

  const { data: searchResults, isFetching } = useSearchMachine(
    {
      searchText: debouncedInputValue || undefined,
      maxResults: 10,
    }
  );
  const { data: productById } = useGetMachineById(
    value ?? '',
    { enabled: Boolean(value) } as any // tùy lib của bạn (react-query) để bật/tắt
  );
  const items = searchResults?.data || [];
  const resolvedSelected = useMemo(() => {
    if (!value) return null;
    return items.find((x) => String(x.id) === String(value)) ?? (productById ?? null);
  }, [value, items, productById]);
  useEffect(() => {
    if (!value) {
      setSelectedMachine(null);
      setInputValue('');
      return;
    }
    if (!resolvedSelected) return;

    setSelectedMachine(resolvedSelected);

    // set text hiển thị trên input
    const anyEnt: any = resolvedSelected as any;
    const labelText =
      anyEnt.name || anyEnt.code || anyEnt.title || String(anyEnt.id) || '';
    setInputValue(labelText);
  }, [value, resolvedSelected]);

  const handleChange = useCallback(
    (_event: any, newValue: MachineEntity | null) => {
      setSelectedMachine(newValue);
      onChange?.(newValue?.id ? String(newValue.id) : null);
    },
    [onChange]
  );

  const handleInputChange = useCallback(
    (_event: any, newInputValue: string) => {
      setInputValue(newInputValue);
      debouncedSetSearch(newInputValue);
    },
    [debouncedSetSearch]
  );

  return (
    <Autocomplete
      value={selectedMachine}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      options={items}
      getOptionLabel={(option) => {
        if (typeof option === 'string') return option;
        // Try common property names across different entity types
        const entity = option as any;
        return entity.name || entity.code || entity.sensorName || entity.sensorCode || entity.title || String(entity.id) || '';
      }}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      loading={isFetching}
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required={required}
          error={error}
          helperText={helperText}
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {isFetching ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }
          }}
        />
      )}
    />
  );
}
