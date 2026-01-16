import type { TimeBlockNameEntity } from 'src/api/types/generated';

import { debounce } from 'es-toolkit';
import { useMemo, useState, useEffect, useCallback } from 'react';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

import {
  useSearchTimeBlockName,
  useGetTimeBlockNameById,
} from 'src/api/hooks/generated/use-time-block-name';

// ----------------------------------------------------------------------

export interface TimeBlockNameSelectorProps {
  value?: string | null;
  onChange?: (timeBlockNameId: string | null) => void;
  disabled?: boolean;
  label?: string;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
}

export function TimeBlockNameSelector({
  value,
  onChange,
  disabled = false,
  label = 'Time Block Name',
  error = false,
  helperText,
  required = false,
  size = 'medium',
  fullWidth = false,
}: TimeBlockNameSelectorProps) {
  const [inputValue, setInputValue] = useState('');
  const [debouncedInputValue, setDebouncedInputValue] = useState('');
  const [selectedTimeBlockName, setSelectedTimeBlockName] = useState<TimeBlockNameEntity | null>(
    null
  );

  // Fetch entity by ID when value prop is provided
  const { data: entityById, isFetching: isFetchingById } = useGetTimeBlockNameById(value || '', {
    enabled: !!value && !selectedTimeBlockName,
  });

  // Set initial value when entity is fetched
  useEffect(() => {
    if (
      entityById &&
      value &&
      entityById.id?.toString() !== selectedTimeBlockName?.id?.toString()
    ) {
      setSelectedTimeBlockName(entityById);
    } else if (!value && selectedTimeBlockName !== null) {
      setSelectedTimeBlockName(null);
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

  const { data: searchResults, isFetching: isFetchingSearch } = useSearchTimeBlockName({
    searchText: debouncedInputValue || undefined,
    maxResults: 10,
  });

  const items = searchResults?.data || [];
  const isFetching = isFetchingById || isFetchingSearch;

  const handleChange = useCallback(
    (_event: any, newValue: TimeBlockNameEntity | null) => {
      setSelectedTimeBlockName(newValue);
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
      value={selectedTimeBlockName}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      options={items}
      getOptionLabel={(option) => {
        if (typeof option === 'string') return option;
        // Try common property names across different entity types
        const entity = option as any;
        return entity.name || entity.code || entity.title || String(entity.id) || '';
      }}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      loading={isFetching}
      disabled={disabled}
      size={size}
      fullWidth={fullWidth}
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
