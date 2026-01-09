import type { InformationDecoratorBaseEntity } from 'src/api/types/generated';

import { debounce } from 'es-toolkit';
import { useMemo, useState, useEffect, useCallback } from 'react';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

import { useSearchInformationDecoratorBase, useGetInformationDecoratorBaseById } from 'src/api/hooks/generated/use-information-decorator-base';

// ----------------------------------------------------------------------

export interface InformationDecoratorBaseSelectorProps {
  value?: string | null;
  onChange?: (informationDecoratorBaseId: string | null) => void;
  disabled?: boolean;
  label?: string;
  error?: boolean;
  helperText?: string;
  required?: boolean;
}

export function InformationDecoratorBaseSelector({
  value,
  onChange,
  disabled = false,
  label = 'InformationDecoratorBase',
  error = false,
  helperText,
  required = false,
}: InformationDecoratorBaseSelectorProps) {
  const [inputValue, setInputValue] = useState('');
  const [debouncedInputValue, setDebouncedInputValue] = useState('');
  const [selectedInformationDecoratorBase, setSelectedInformationDecoratorBase] = useState<InformationDecoratorBaseEntity | null>(null);

  // Fetch entity by ID when value prop is provided
  const { data: entityById, isFetching: isFetchingById } = useGetInformationDecoratorBaseById(
    value || '',
    {
      enabled: !!value && !selectedInformationDecoratorBase,
    }
  );

  // Set initial value when entity is fetched
  useEffect(() => {
    if (entityById && value && entityById.id?.toString() !== selectedInformationDecoratorBase?.id?.toString()) {
      setSelectedInformationDecoratorBase(entityById);
    } else if (!value && selectedInformationDecoratorBase !== null) {
      setSelectedInformationDecoratorBase(null);
    }
  }, [entityById, value, selectedInformationDecoratorBase]);

  // Debounce search input with 500ms delay
  const debouncedSetSearch = useMemo(
    () => debounce((searchValue: string) => {
      setDebouncedInputValue(searchValue);
    }, 500),
    []
  );

  const { data: searchResults, isFetching: isFetchingSearch } = useSearchInformationDecoratorBase(
    {
      searchText: debouncedInputValue || undefined,
      maxResults: 10,
    }
  );

  const items = searchResults?.data || [];
  const isFetching = isFetchingById || isFetchingSearch;

  const handleChange = useCallback(
    (_event: any, newValue: InformationDecoratorBaseEntity | null) => {
      setSelectedInformationDecoratorBase(newValue);
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
      value={selectedInformationDecoratorBase}
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
