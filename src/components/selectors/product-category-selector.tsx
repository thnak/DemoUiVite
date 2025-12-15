import type { ProductCategoryEntity } from 'src/api/types/generated';

import { useCallback, useMemo, useState } from 'react';

import { debounce } from 'es-toolkit';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

import { useSearchProductCategory } from 'src/api/hooks/generated/use-product-category';

// ----------------------------------------------------------------------

export interface ProductCategorySelectorProps {
  value?: string | null;
  onChange?: (productCategoryId: string | null) => void;
  disabled?: boolean;
  label?: string;
  error?: boolean;
  helperText?: string;
  required?: boolean;
}

export function ProductCategorySelector({
  value,
  onChange,
  disabled = false,
  label = 'ProductCategory',
  error = false,
  helperText,
  required = false,
}: ProductCategorySelectorProps) {
  const [inputValue, setInputValue] = useState('');
  const [debouncedInputValue, setDebouncedInputValue] = useState('');
  const [selectedProductCategory, setSelectedProductCategory] = useState<ProductCategoryEntity | null>(null);

  // Debounce search input with 500ms delay
  const debouncedSetSearch = useMemo(
    () => debounce((searchValue: string) => {
      setDebouncedInputValue(searchValue);
    }, 500),
    []
  );

  const { data: searchResults, isFetching } = useSearchProductCategory(
    {
      searchText: debouncedInputValue || undefined,
      maxResults: 10,
    }
  );

  const items = searchResults?.data || [];

  const handleChange = useCallback(
    (_event: any, newValue: ProductCategoryEntity | null) => {
      setSelectedProductCategory(newValue);
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
      value={selectedProductCategory}
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
