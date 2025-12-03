import type { ShiftTemplateEntity } from 'src/api/types';

import { useMemo, useState, useCallback } from 'react';

import { debounce } from '@mui/material/utils';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

import { searchShiftTemplate } from 'src/api/services';

export interface ShiftTemplateAutocompleteProps {
  /** The currently selected value */
  value: ShiftTemplateEntity | null;
  /** Callback fired when the value changes */
  onChange: (value: ShiftTemplateEntity | null) => void;
  /** Text field label */
  label?: string;
  /** Text field placeholder */
  placeholder?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Whether the field is required */
  required?: boolean;
  /** Error state */
  error?: boolean;
  /** Helper text to display below the field */
  helperText?: string;
  /** Debounce delay in milliseconds */
  debounceMs?: number;
}

/**
 * Async autocomplete component for selecting ShiftTemplateEntity instances.
 * Fetches options from the searchShiftTemplate API as the user types.
 */
export function ShiftTemplateAutocomplete({
  value,
  onChange,
  label = 'Shift Template',
  placeholder = 'Search shift templates...',
  disabled = false,
  required = false,
  error = false,
  helperText,
  debounceMs = 300,
}: ShiftTemplateAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<readonly ShiftTemplateEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Debounced search function
  const debouncedSearch = useMemo(
    () =>
      debounce(async (searchText: string) => {
        setLoading(true);
        setErrorMessage(null);

        try {
          const result = await searchShiftTemplate({ searchText });
          // Ensure result is always an array to prevent MUI Autocomplete errors
          setOptions(Array.isArray(result) ? result : []);
        } catch {
          setOptions([]);
          setErrorMessage('Failed to fetch shift templates. Please try again.');
        } finally {
          setLoading(false);
        }
      }, debounceMs),
    [debounceMs]
  );

  // Handle input change
  const handleInputChange = useCallback(
    (_event: React.SyntheticEvent, newInputValue: string) => {
      setInputValue(newInputValue);
      if (newInputValue) {
        debouncedSearch(newInputValue);
      } else {
        setOptions([]);
      }
    },
    [debouncedSearch]
  );

  // Handle open
  const handleOpen = useCallback(() => {
    setOpen(true);
    // Load initial options when opening
    if (!inputValue) {
      debouncedSearch('');
    }
  }, [debouncedSearch, inputValue]);

  // Handle close
  const handleClose = useCallback(() => {
    setOpen(false);
    setOptions([]);
    setErrorMessage(null);
  }, []);

  // Handle value change
  const handleChange = useCallback(
    (_event: React.SyntheticEvent, newValue: ShiftTemplateEntity | null) => {
      onChange(newValue);
    },
    [onChange]
  );

  // Get option label - display code and name
  const getOptionLabel = useCallback((option: ShiftTemplateEntity) => {
    if (option.code && option.name) {
      return `${option.code} - ${option.name}`;
    }
    return option.name || option.code || 'Unnamed Template';
  }, []);

  // Check if two options are equal
  const isOptionEqualToValue = useCallback(
    (option: ShiftTemplateEntity, val: ShiftTemplateEntity) => {
      // Handle cases where id might be undefined
      if (!option.id && !val.id) return true;
      if (!option.id || !val.id) return false;
      return option.id.toString() === val.id.toString();
    },
    []
  );

  return (
    <Autocomplete
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      value={value}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      options={options}
      loading={loading}
      disabled={disabled}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      filterOptions={(x) => x} // Disable built-in filtering since we filter on server
      noOptionsText={errorMessage || 'No shift templates found'}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          required={required}
          error={error || !!errorMessage}
          helperText={errorMessage || helperText}
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        const displayCode = option.code || 'N/A';
        return (
          <li key={key} {...optionProps}>
            <div>
              <strong>{displayCode}</strong>
              {option.name && <span> - {option.name}</span>}
            </div>
          </li>
        );
      }}
    />
  );
}

export default ShiftTemplateAutocomplete;
