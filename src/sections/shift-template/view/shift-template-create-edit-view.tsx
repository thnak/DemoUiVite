import type { ShiftTemplateFormData } from 'src/types/shift';

import { useParams } from 'react-router';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';
import { shiftTemplateService } from 'src/services/shiftTemplateService';

import { ShiftTemplateForm } from 'src/components/ShiftTemplateForm';

// ----------------------------------------------------------------------

interface ShiftTemplateCreateEditViewProps {
  isEdit?: boolean;
}

export function ShiftTemplateCreateEditView({ isEdit = false }: ShiftTemplateCreateEditViewProps) {
  const router = useRouter();
  const params = useParams();
  const templateId = params.id as string | undefined;

  const [initialData, setInitialData] = useState<ShiftTemplateFormData | undefined>(undefined);
  const [loading, setLoading] = useState(isEdit);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && templateId) {
      const template = shiftTemplateService.getById(templateId);
      if (template) {
        setInitialData({
          code: template.code,
          name: template.name,
          description: template.description,
          weekType: template.weekType,
          shiftPattern: template.shiftPattern,
          definitions: template.definitions.map((def) => ({
            id: def.id,
            name: def.name,
            startTime: def.startTime,
            endTime: def.endTime,
            breaks: def.breaks.map((b) => ({
              id: b.id,
              startTime: b.startTime,
              endTime: b.endTime,
              name: b.name,
            })),
            days: def.days,
          })),
        });
      } else {
        setErrorMessage('Template not found');
      }
      setLoading(false);
    }
  }, [isEdit, templateId]);

  const handleSubmit = useCallback(
    (data: ShiftTemplateFormData) => {
      try {
        if (isEdit && templateId) {
          shiftTemplateService.update(templateId, data);
          setSuccessMessage('Template updated successfully');
        } else {
          shiftTemplateService.create(data);
          setSuccessMessage('Template created successfully');
        }

        setTimeout(() => {
          router.push('/shift-templates');
        }, 1000);
      } catch {
        setErrorMessage('Failed to save template');
      }
    },
    [isEdit, templateId, router]
  );

  const handleCancel = useCallback(() => {
    router.push('/shift-templates');
  }, [router]);

  const handleCloseError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const handleCloseSuccess = useCallback(() => {
    setSuccessMessage(null);
  }, []);

  if (loading) {
    return (
      <DashboardContent>
        <Typography>Loading...</Typography>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          {isEdit ? 'Edit Shift Template' : 'Create Shift Template'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            •
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Shift Templates
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            •
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.disabled' }}>
            {isEdit ? 'Edit' : 'Create'}
          </Typography>
        </Box>
      </Box>

      <ShiftTemplateForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEdit={isEdit}
      />

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </DashboardContent>
  );
}
