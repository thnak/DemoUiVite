import type { MachineTypeEntity } from 'src/api/types/generated';

import { debounce } from 'es-toolkit';
import { useMemo, useState, useCallback } from 'react';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

import { useGetMachineTypePage } from 'src/api/hooks/generated/use-machine-type';

// ----------------------------------------------------------------------

export interface MachineTypeSelectorProps {
  value?: string | null;
  onChange?: (machineTypeId: string | null) => void;
  disabled?: boolean;
  label?: string;
  error?: boolean;
  helperText?: string;
  required?: boolean;
}

export function MachineTypeSelector({
  value,
  onChange,
  disabled = false,
  label = 'Machine Type',
  error = false,
  helperText,
  required = false,
}: MachineTypeSelectorProps) {
  const [inputValue, setInputValue] = useState('');
  const [debouncedInputValue, setDebouncedInputValue] = useState('');
  const [selectedMachineType, setSelectedMachineType] = useState<MachineTypeEntity | null>(null);

  // Debounce search input with 500ms delay
  const debouncedSetSearch = useMemo(
    () => debounce((searchValue: string) => {
      setDebouncedInputValue(searchValue);
    }, 500),
    []
  );

  const { data: searchResults, isFetching } = useGetMachineTypePage(
    {
      data: [],
      params: {
        searchTerm: debouncedInputValue || undefined,
        pageSize: 10,
        pageNumber: 0,
      }
    }
  );

  const items = searchResults?.items || [];

  const handleChange = useCallback(
    (_event: any, newValue: MachineTypeEntity | null) => {
      setSelectedMachineType(newValue);
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
      value={selectedMachineType}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      options={items}
      getOptionLabel={(option) => {
        if (typeof option === 'string') return option;
        return option.name || option.code || String(option.id) || '';
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
