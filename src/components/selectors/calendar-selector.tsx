import type { CalendarEntity } from 'src/api/types/generated';

import { useState, useCallback } from 'react';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

import { useSearchCalendar } from 'src/api/hooks/generated/use-calendar';

// ----------------------------------------------------------------------

export interface CalendarSelectorProps {
  value?: string | null;
  onChange?: (calendarId: string | null) => void;
  disabled?: boolean;
  label?: string;
  error?: boolean;
  helperText?: string;
  required?: boolean;
}

export function CalendarSelector({
  value,
  onChange,
  disabled = false,
  label = 'Calendar',
  error = false,
  helperText,
  required = false,
}: CalendarSelectorProps) {
  const [inputValue, setInputValue] = useState('');
  const [selectedCalendar, setSelectedCalendar] = useState<CalendarEntity | null>(null);

  const { data: searchResults, isFetching } = useSearchCalendar(
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
    (_event: any, newValue: CalendarEntity | null) => {
      setSelectedCalendar(newValue);
      onChange?.(newValue?.id ? String(newValue.id) : null);
    },
    [onChange]
  );

  const handleInputChange = useCallback((_event: any, newInputValue: string) => {
    setInputValue(newInputValue);
  }, []);

  return (
    <Autocomplete
      value={selectedCalendar}
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
