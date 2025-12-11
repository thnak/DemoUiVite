import type { DefectReasonEntity } from 'src/api/types/generated';

import { useState, useCallback } from 'react';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

import { useSearchDefectReason } from 'src/api/hooks/generated/use-defect-reason';

// ----------------------------------------------------------------------

export interface DefectReasonSelectorProps {
  value?: string | null;
  onChange?: (defectReasonId: string | null) => void;
  disabled?: boolean;
  label?: string;
  error?: boolean;
  helperText?: string;
  required?: boolean;
}

export function DefectReasonSelector({
  value,
  onChange,
  disabled = false,
  label = 'DefectReason',
  error = false,
  helperText,
  required = false,
}: DefectReasonSelectorProps) {
  const [inputValue, setInputValue] = useState('');
  const [selectedDefectReason, setSelectedDefectReason] = useState<DefectReasonEntity | null>(null);

  const { data: searchResults, isFetching } = useSearchDefectReason(
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
    (_event: any, newValue: DefectReasonEntity | null) => {
      setSelectedDefectReason(newValue);
      onChange?.(newValue?.id ? String(newValue.id) : null);
    },
    [onChange]
  );

  const handleInputChange = useCallback((_event: any, newInputValue: string) => {
    setInputValue(newInputValue);
  }, []);

  return (
    <Autocomplete
      value={selectedDefectReason}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      options={items}
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
            }
          }}
        />
      )}
    />
  );
}
