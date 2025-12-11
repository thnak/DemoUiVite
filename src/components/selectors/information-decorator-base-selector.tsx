import type { InformationDecoratorBaseEntity } from 'src/api/types/generated';

import { useState, useCallback } from 'react';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

import { useSearchInformationDecoratorBase } from 'src/api/hooks/generated/use-information-decorator-base';

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
  const [selectedInformationDecoratorBase, setSelectedInformationDecoratorBase] = useState<InformationDecoratorBaseEntity | null>(null);

  const { data: searchResults, isFetching } = useSearchInformationDecoratorBase(
    {
      searchText: inputValue || undefined,
      maxResults: 10,
    },
    {
      enabled: inputValue.length > 0,
    }
  );

  const items = searchResults?.data || [];

  const handleChange = useCallback(
    (_event: any, newValue: InformationDecoratorBaseEntity | null) => {
      setSelectedInformationDecoratorBase(newValue);
      onChange?.(newValue?.id ? String(newValue.id) : null);
    },
    [onChange]
  );

  const handleInputChange = useCallback((_event: any, newInputValue: string) => {
    setInputValue(newInputValue);
  }, []);

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
