import { useState, useCallback, type ChangeEvent } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { useValidationResult } from 'src/hooks/use-validation-result';

import { isValidationSuccess } from 'src/utils/validation-result';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  useCreateStopMachineReason,
  useUpdateStopMachineReason,
} from 'src/api/hooks/generated/use-stop-machine-reason';

import { Iconify } from 'src/components/iconify';
import { StopMachineReasonGroupSelector } from 'src/components/selectors/stop-machine-reason-group-selector';

// ----------------------------------------------------------------------

interface StopMachineReasonFormData {
  code: string;
  name: string;
  description: string;
  colorHex: string;
  groupId: string | null;
  requiresApproval: boolean;
  requiresNote: boolean;
  requiresAttachment: boolean;
  requiresComment: boolean;
  translations: Record<string, string>;
}

interface StopMachineReasonCreateEditViewProps {
  isEdit?: boolean;
  currentStopMachineReason?: {
    id: string;
    code: string;
    name: string;
    description: string;
    colorHex: string;
    groupId: string;
    requiresApproval: boolean;
    requiresNote: boolean;
    requiresAttachment: boolean;
    requiresComment: boolean;
    translations?: Record<string, string>;
  };
}

export function StopMachineReasonCreateEditView({
  isEdit = false,
  currentStopMachineReason,
}: StopMachineReasonCreateEditViewProps) {
  const router = useRouter();

  // Use ValidationResult hook for form validation
  const {
    setValidationResult,
    clearValidationResult,
    getFieldErrorMessage,
    hasError,
    clearFieldError,
    overallMessage,
  } = useValidationResult();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<StopMachineReasonFormData>({
    code: currentStopMachineReason?.code || '',
    name: currentStopMachineReason?.name || '',
    description: currentStopMachineReason?.description || '',
    colorHex: currentStopMachineReason?.colorHex || '#000000',
    groupId: currentStopMachineReason?.groupId || null,
    requiresApproval: currentStopMachineReason?.requiresApproval || false,
    requiresNote: currentStopMachineReason?.requiresNote || false,
    requiresAttachment: currentStopMachineReason?.requiresAttachment || false,
    requiresComment: currentStopMachineReason?.requiresComment || false,
    translations: currentStopMachineReason?.translations || {},
  });

  // Translation management state
  const [newTranslationKey, setNewTranslationKey] = useState('');
  const [newTranslationValue, setNewTranslationValue] = useState('');

  const { mutate: createStopMachineReasonMutate, isPending: isCreating } =
    useCreateStopMachineReason({
      onSuccess: (result) => {
        setValidationResult(result);
        if (isValidationSuccess(result)) {
          router.push('/stop-machine-reason');
        } else if (result.message) {
          setErrorMessage(result.message);
        }
      },
      onError: (error) => {
        setErrorMessage(error.message || 'Failed to create stop machine reason');
      },
    });

  const { mutate: updateStopMachineReasonMutate, isPending: isUpdating } =
    useUpdateStopMachineReason({
      onSuccess: (result) => {
        setValidationResult(result);
        if (isValidationSuccess(result)) {
          router.push('/stop-machine-reason');
        } else if (result.message) {
          setErrorMessage(result.message);
        }
      },
      onError: (error) => {
        setErrorMessage(error.message || 'Failed to update stop machine reason');
      },
    });

  const isSubmitting = isCreating || isUpdating;

  const handleCloseError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const handleInputChange = useCallback(
    (field: keyof StopMachineReasonFormData) =>
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
          ...prev,
          [field]: event.target.value,
        }));
        clearFieldError(field);
      },
    [clearFieldError]
  );

  const handleSwitchChange = useCallback(
    (field: keyof StopMachineReasonFormData) => (event: ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.checked,
      }));
      clearFieldError(field);
    },
    [clearFieldError]
  );

  const handleGroupIdChange = useCallback(
    (groupId: string | null) => {
      setFormData((prev) => ({
        ...prev,
        groupId,
      }));
      clearFieldError('groupId');
    },
    [clearFieldError]
  );

  const handleAddTranslation = useCallback(() => {
    if (newTranslationKey && newTranslationValue) {
      setFormData((prev) => ({
        ...prev,
        translations: {
          ...prev.translations,
          [newTranslationKey]: newTranslationValue,
        },
      }));
      setNewTranslationKey('');
      setNewTranslationValue('');
    }
  }, [newTranslationKey, newTranslationValue]);

  const handleRemoveTranslation = useCallback((key: string) => {
    setFormData((prev) => {
      const { [key]: removed, ...rest } = prev.translations;
      return {
        ...prev,
        translations: rest,
      };
    });
  }, []);

  const handleSubmit = useCallback(() => {
    clearValidationResult();
    setErrorMessage(null);

    if (!formData.name) {
      setErrorMessage('Stop machine reason name is required');
      return;
    }

    if (isEdit && currentStopMachineReason?.id) {
      // Update uses key-value pairs as per API spec
      updateStopMachineReasonMutate({
        id: currentStopMachineReason.id,
        data: [
          { key: 'code', value: formData.code },
          { key: 'name', value: formData.name },
          { key: 'description', value: formData.description },
          { key: 'colorHex', value: formData.colorHex },
          { key: 'groupId', value: formData.groupId },
          { key: 'requiresApproval', value: formData.requiresApproval },
          { key: 'requiresNote', value: formData.requiresNote },
          { key: 'requiresAttachment', value: formData.requiresAttachment },
          { key: 'requiresComment', value: formData.requiresComment },
          { key: 'translations', value: formData.translations },
        ],
      });
    } else {
      // Create uses full entity object
      createStopMachineReasonMutate({
        data: {
          code: formData.code,
          name: formData.name,
          description: formData.description,
          colorHex: formData.colorHex,
          groupId: formData.groupId ? { value: formData.groupId } : undefined,
          requiresApproval: formData.requiresApproval,
          requiresNote: formData.requiresNote,
          requiresAttachment: formData.requiresAttachment,
          requiresComment: formData.requiresComment,
          translations: formData.translations,
        },
      });
    }
  }, [
    formData,
    isEdit,
    currentStopMachineReason?.id,
    createStopMachineReasonMutate,
    updateStopMachineReasonMutate,
    clearValidationResult,
  ]);

  const handleCancel = useCallback(() => {
    router.push('/stop-machine-reason');
  }, [router]);

  return (
    <DashboardContent>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          {isEdit ? 'Edit stop machine reason' : 'Create a new stop machine reason'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            •
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Stop Machine Reason
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            •
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.disabled' }}>
            {isEdit ? 'Edit' : 'Create'}
          </Typography>
        </Box>
      </Box>

      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              fullWidth
              label="Code"
              value={formData.code}
              onChange={handleInputChange('code')}
              error={hasError('code')}
              helperText={getFieldErrorMessage('code')}
            />

            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={handleInputChange('name')}
              error={hasError('name')}
              helperText={getFieldErrorMessage('name')}
              required
            />
          </Box>

          <StopMachineReasonGroupSelector
            value={formData.groupId}
            onChange={handleGroupIdChange}
            label="Stop Machine Reason Group"
            error={hasError('groupId')}
            helperText={getFieldErrorMessage('groupId')}
          />

          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={handleInputChange('description')}
            multiline
            rows={3}
            error={hasError('description')}
            helperText={getFieldErrorMessage('description')}
          />

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Color
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                component="input"
                type="color"
                value={formData.colorHex}
                onChange={handleInputChange('colorHex')}
                sx={{
                  width: 48,
                  height: 48,
                  border: 'none',
                  borderRadius: 1,
                  cursor: 'pointer',
                  '&::-webkit-color-swatch-wrapper': {
                    padding: 0,
                  },
                  '&::-webkit-color-swatch': {
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                  },
                }}
              />
              <TextField
                size="small"
                value={formData.colorHex}
                onChange={handleInputChange('colorHex')}
                placeholder="#000000"
                sx={{ width: 120 }}
                error={hasError('colorHex')}
                helperText={getFieldErrorMessage('colorHex')}
              />
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Requirements
            </Typography>
            <Stack spacing={1}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.requiresApproval}
                    onChange={handleSwitchChange('requiresApproval')}
                  />
                }
                label="Requires Approval"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.requiresNote}
                    onChange={handleSwitchChange('requiresNote')}
                  />
                }
                label="Requires Note"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.requiresAttachment}
                    onChange={handleSwitchChange('requiresAttachment')}
                  />
                }
                label="Requires Attachment"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.requiresComment}
                    onChange={handleSwitchChange('requiresComment')}
                  />
                }
                label="Requires Comment"
              />
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Translations
            </Typography>
            <Stack spacing={2}>
              {Object.entries(formData.translations).map(([key, value]) => (
                <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TextField
                    size="small"
                    label="Language Code"
                    value={key}
                    disabled
                    sx={{ width: 150 }}
                  />
                  <TextField size="small" label="Translation" value={value} disabled fullWidth />
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveTranslation(key)}
                    size="small"
                  >
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Box>
              ))}

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                  size="small"
                  label="Language Code"
                  value={newTranslationKey}
                  onChange={(e) => setNewTranslationKey(e.target.value)}
                  placeholder="e.g., en, vi, zh"
                  sx={{ width: 150 }}
                />
                <TextField
                  size="small"
                  label="Translation"
                  value={newTranslationValue}
                  onChange={(e) => setNewTranslationValue(e.target.value)}
                  placeholder="Enter translation"
                  fullWidth
                />
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleAddTranslation}
                  disabled={!newTranslationKey || !newTranslationValue}
                  startIcon={<Iconify icon="mingcute:add-line" />}
                >
                  Add
                </Button>
              </Box>
            </Stack>
          </Box>
        </Stack>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
          <Button variant="outlined" color="inherit" onClick={handleCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="inherit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            sx={{
              bgcolor: 'grey.900',
              color: 'common.white',
              '&:hover': {
                bgcolor: 'grey.800',
              },
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : isEdit ? (
              'Save changes'
            ) : (
              'Create stop machine reason'
            )}
          </Button>
        </Box>
      </Card>

      <Snackbar
        open={!!(errorMessage || overallMessage)}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {errorMessage || overallMessage}
        </Alert>
      </Snackbar>
    </DashboardContent>
  );
}
