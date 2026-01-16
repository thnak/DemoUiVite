import type { ShiftTemplateEntity } from 'src/api/types/generated';

import { debounce } from 'es-toolkit';
import { useMemo, useState, useEffect, useCallback } from 'react';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

import {
  useSearchShiftTemplate,
  useGetShiftTemplateById,
} from 'src/api/hooks/generated/use-shift-template';

// ----------------------------------------------------------------------

export interface ShiftTemplateSelectorProps {
  value?: string | null;
  onChange?: (shiftTemplateId: string | null) => void;
  disabled?: boolean;
  label?: string;
  error?: boolean;
  helperText?: string;
  required?: boolean;
}

export function ShiftTemplateSelector({
  value,
  onChange,
  disabled = false,
  label = 'ShiftTemplate',
  error = false,
  helperText,
  required = false,
}: ShiftTemplateSelectorProps) {
  const [inputValue, setInputValue] = useState('');
  const [debouncedInputValue, setDebouncedInputValue] = useState('');
  const [selectedShiftTemplate, setSelectedShiftTemplate] = useState<ShiftTemplateEntity | null>(
    null
  );

  // Fetch entity by ID when value prop is provided
  const { data: entityById, isFetching: isFetchingById } = useGetShiftTemplateById(value || '', {
    enabled: !!value && !selectedShiftTemplate,
  });

  // Set initial value when entity is fetched
  useEffect(() => {
    if (
      entityById &&
      value &&
      entityById.id?.toString() !== selectedShiftTemplate?.id?.toString()
    ) {
      setSelectedShiftTemplate(entityById);
    } else if (!value && selectedShiftTemplate !== null) {
      setSelectedShiftTemplate(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityById, value]);

  // Debounce search input with 500ms delay
  const debouncedSetSearch = useMemo(
    () =>
      debounce((searchValue: string) => {
        setDebouncedInputValue(searchValue);
      }, 500),
    []
  );

  const { data: searchResults, isFetching: isFetchingSearch } = useSearchShiftTemplate({
    searchText: debouncedInputValue || undefined,
    maxResults: 10,
  });

  const items = searchResults?.data || [];
  const isFetching = isFetchingById || isFetchingSearch;

  const handleChange = useCallback(
    (_event: any, newValue: ShiftTemplateEntity | null) => {
      setSelectedShiftTemplate(newValue);
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
      value={selectedShiftTemplate}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      options={items}
      getOptionLabel={(option) => {
        if (typeof option === 'string') return option;
        // Try common property names across different entity types
        const entity = option as any;
        return (
          entity.name ||
          entity.code ||
          entity.sensorName ||
          entity.sensorCode ||
          entity.title ||
          String(entity.id) ||
          ''
        );
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
            },
          }}
        />
      )}
    />
  );
}
