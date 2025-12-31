import type { StopMachineReasonGroupEntity } from 'src/api/types/generated';

import { debounce } from 'es-toolkit';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

import { useSearchStopMachineReasonGroup, useGetStopMachineReasonGroupById } from 'src/api/hooks/generated/use-stop-machine-reason-group';

// ----------------------------------------------------------------------

export interface StopMachineReasonGroupSelectorProps {
  value?: string | null;
  onChange?: (stopMachineReasonGroupId: string | null) => void;
  disabled?: boolean;
  label?: string;
  error?: boolean;
  helperText?: string;
  required?: boolean;
}

export function StopMachineReasonGroupSelector({
  value,
  onChange,
  disabled = false,
  label = 'StopMachineReasonGroup',
  error = false,
  helperText,
  required = false,
}: StopMachineReasonGroupSelectorProps) {
  const [inputValue, setInputValue] = useState('');
  const [debouncedInputValue, setDebouncedInputValue] = useState('');
  const [selectedStopMachineReasonGroup, setSelectedStopMachineReasonGroup] = useState<StopMachineReasonGroupEntity | null>(null);
  const previousValueRef = useRef<string | null>(null);

  // Fetch entity by ID when value prop is provided
  const { data: entityById, isFetching: isFetchingById } = useGetStopMachineReasonGroupById(
    value || '',
    {
      enabled: !!value && !selectedStopMachineReasonGroup,
    }
  );

  // Set initial value when entity is fetched
  useEffect(() => {
    // Only process if value has actually changed
    if (previousValueRef.current === value) {
      return;
    }
    
    previousValueRef.current = value || null;
    
    if (entityById && value) {
      // Only update if the selected entity ID differs from the value
      const currentId = selectedStopMachineReasonGroup?.id ? String(selectedStopMachineReasonGroup.id) : null;
      if (currentId !== value) {
        setSelectedStopMachineReasonGroup(entityById);
      }
    } else if (!value) {
      setSelectedStopMachineReasonGroup(null);
    }
  }, [entityById, value, selectedStopMachineReasonGroup]);

  // Debounce search input with 500ms delay
  const debouncedSetSearch = useMemo(
    () => debounce((searchValue: string) => {
      setDebouncedInputValue(searchValue);
    }, 500),
    []
  );

  const { data: searchResults, isFetching: isFetchingSearch } = useSearchStopMachineReasonGroup(
    {
      searchText: debouncedInputValue || undefined,
      maxResults: 10,
    }
  );

  const items = searchResults?.data || [];
  const isFetching = isFetchingById || isFetchingSearch;

  const handleChange = useCallback(
    (_event: any, newValue: StopMachineReasonGroupEntity | null) => {
      setSelectedStopMachineReasonGroup(newValue);
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
      value={selectedStopMachineReasonGroup}
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
