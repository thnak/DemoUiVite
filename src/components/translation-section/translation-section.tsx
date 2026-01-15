import type { ChangeEvent } from 'react';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface TranslationSectionProps {
  translations: Record<string, string>;
  onTranslationsChange: (translations: Record<string, string>) => void;
  disabled?: boolean;
}

export function TranslationSection({
  translations,
  onTranslationsChange,
  disabled = false,
}: TranslationSectionProps) {
  const [translationKey, setTranslationKey] = useState('');
  const [translationValue, setTranslationValue] = useState('');

  const handleAddTranslation = useCallback(() => {
    if (translationKey && translationValue) {
      onTranslationsChange({
        ...translations,
        [translationKey]: translationValue,
      });
      setTranslationKey('');
      setTranslationValue('');
    }
  }, [translationKey, translationValue, translations, onTranslationsChange]);

  const handleRemoveTranslation = useCallback(
    (key: string) => {
      const newTranslations = { ...translations };
      delete newTranslations[key];
      onTranslationsChange(newTranslations);
    },
    [translations, onTranslationsChange]
  );

  const handleKeyChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setTranslationKey(event.target.value);
  }, []);

  const handleValueChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setTranslationValue(event.target.value);
  }, []);

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Translations
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            label="Language Code"
            value={translationKey}
            onChange={handleKeyChange}
            placeholder="e.g., en, vi, zh"
            disabled={disabled}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Translation"
            value={translationValue}
            onChange={handleValueChange}
            placeholder="Translation text"
            disabled={disabled}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            onClick={handleAddTranslation}
            disabled={!translationKey || !translationValue || disabled}
            sx={{ height: '56px' }}
          >
            Add
          </Button>
        </Grid>
      </Grid>
      {Object.keys(translations).length > 0 && (
        <Stack spacing={1}>
          {Object.entries(translations).map(([key, value]) => (
            <Box
              key={key}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 1.5,
                bgcolor: 'background.neutral',
                borderRadius: 1,
              }}
            >
              <Typography variant="subtitle2" sx={{ minWidth: 60 }}>
                {key}:
              </Typography>
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                {value}
              </Typography>
              <IconButton
                size="small"
                onClick={() => handleRemoveTranslation(key)}
                disabled={disabled}
              >
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </Box>
          ))}
        </Stack>
      )}
      {Object.keys(translations).length === 0 && (
        <Box
          sx={{
            p: 3,
            textAlign: 'center',
            bgcolor: 'background.neutral',
            borderRadius: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            No translations added yet. Add language codes and translations above.
          </Typography>
        </Box>
      )}
    </Card>
  );
}
