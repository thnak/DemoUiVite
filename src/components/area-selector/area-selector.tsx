import type { AreaEntity } from 'src/api/types/generated';

import { useState, useCallback } from 'react';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

import { useSearchArea } from 'src/api/hooks/generated/use-area';

// ----------------------------------------------------------------------

export interface AreaSelectorProps {
  value?: string | null;
  onChange?: (areaId: string | null) => void;
  disabled?: boolean;
  label?: string;
  error?: boolean;
  helperText?: string;
  required?: boolean;
}

export function AreaSelector({
  value,
  onChange,
  disabled = false,
  label = 'Area',
  error = false,
  helperText,
  required = false,
}: AreaSelectorProps) {
  const [inputValue, setInputValue] = useState('');
  const [selectedArea, setSelectedArea] = useState<AreaEntity | null>(null);

  const { data: searchResults, isFetching } = useSearchArea(
    {
      searchText: inputValue || undefined,
      maxResults: 10,
    },
    {
      enabled: inputValue.length > 0,
    }
  );

  const areas = searchResults?.data || [];

  const handleChange = useCallback(
    (_event: any, newValue: AreaEntity | null) => {
      setSelectedArea(newValue);
      onChange?.(newValue?.id ? String(newValue.id) : null);
    },
    [onChange]
  );

  const handleInputChange = useCallback((_event: any, newInputValue: string) => {
    setInputValue(newInputValue);
  }, []);

  return (
    <Autocomplete
      value={selectedArea}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      options={areas}
      getOptionLabel={(option) => option.name || option.code || ''}
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
