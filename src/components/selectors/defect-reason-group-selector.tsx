import type { DefectReasonGroupEntity } from 'src/api/types/generated';

import { useState, useCallback } from 'react';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

import { useSearchDefectReasonGroup } from 'src/api/hooks/generated/use-defect-reason-group';

// ----------------------------------------------------------------------

export interface DefectReasonGroupSelectorProps {
  value?: string | null;
  onChange?: (defectReasonGroupId: string | null) => void;
  disabled?: boolean;
  label?: string;
  error?: boolean;
  helperText?: string;
  required?: boolean;
}

export function DefectReasonGroupSelector({
  value,
  onChange,
  disabled = false,
  label = 'DefectReasonGroup',
  error = false,
  helperText,
  required = false,
}: DefectReasonGroupSelectorProps) {
  const [inputValue, setInputValue] = useState('');
  const [selectedDefectReasonGroup, setSelectedDefectReasonGroup] = useState<DefectReasonGroupEntity | null>(null);

  const { data: searchResults, isFetching } = useSearchDefectReasonGroup(
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
    (_event: any, newValue: DefectReasonGroupEntity | null) => {
      setSelectedDefectReasonGroup(newValue);
      onChange?.(newValue?.id ? String(newValue.id) : null);
    },
    [onChange]
  );

  const handleInputChange = useCallback((_event: any, newInputValue: string) => {
    setInputValue(newInputValue);
  }, []);

  return (
    <Autocomplete
      value={selectedDefectReasonGroup}
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
