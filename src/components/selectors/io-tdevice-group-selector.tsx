import type { IoTDeviceGroupEntity } from 'src/api/types/generated';

import { useState, useCallback } from 'react';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

import { useSearchIoTDeviceGroup } from 'src/api/hooks/generated/use-io-tdevice-group';

// ----------------------------------------------------------------------

export interface IoTDeviceGroupSelectorProps {
  value?: string | null;
  onChange?: (ioTDeviceGroupId: string | null) => void;
  disabled?: boolean;
  label?: string;
  error?: boolean;
  helperText?: string;
  required?: boolean;
}

export function IoTDeviceGroupSelector({
  value,
  onChange,
  disabled = false,
  label = 'IoTDeviceGroup',
  error = false,
  helperText,
  required = false,
}: IoTDeviceGroupSelectorProps) {
  const [inputValue, setInputValue] = useState('');
  const [selectedIoTDeviceGroup, setSelectedIoTDeviceGroup] = useState<IoTDeviceGroupEntity | null>(null);

  const { data: searchResults, isFetching } = useSearchIoTDeviceGroup(
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
    (_event: any, newValue: IoTDeviceGroupEntity | null) => {
      setSelectedIoTDeviceGroup(newValue);
      onChange?.(newValue?.id ? String(newValue.id) : null);
    },
    [onChange]
  );

  const handleInputChange = useCallback((_event: any, newInputValue: string) => {
    setInputValue(newInputValue);
  }, []);

  return (
    <Autocomplete
      value={selectedIoTDeviceGroup}
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
