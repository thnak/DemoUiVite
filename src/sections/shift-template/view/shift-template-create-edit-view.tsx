import type { DayOfWeek, ShiftTemplateFormData } from 'src/types/shift';
import type { ShiftDefinition, ShiftTemplateEntity } from 'src/api/types/generated';

import { useParams } from 'react-router';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  createShiftTemplate,
  updateShiftTemplate,
  getShiftTemplateById,
} from 'src/api/services/generated/shift-template';

import { ShiftTemplateForm } from 'src/components/ShiftTemplateForm';

import { generateId } from 'src/types/shift';

// ----------------------------------------------------------------------

// Parse ISO 8601 duration to HH:mm format (e.g., "PT8H30M" -> "08:30")
function parseDurationToTime(duration: string | undefined): string {
  if (!duration) return '00:00';

  let hours = 0;
  let minutes = 0;
  const hourMatch = duration.match(/(\d+)H/);
  const minuteMatch = duration.match(/(\d+)M/);

  if (hourMatch) {
    hours = parseInt(hourMatch[1], 10);
  }
  if (minuteMatch) {
    minutes = parseInt(minuteMatch[1], 10);
  }

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Convert HH:mm format to ISO 8601 duration (e.g., "08:30" -> "PT8H30M")
function timeToIsoDuration(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  let duration = 'PT';
  if (hours > 0) {
    duration += `${hours}H`;
  }
  if (minutes > 0) {
    duration += `${minutes}M`;
  }
  if (duration === 'PT') {
    duration = 'PT0M';
  }
  return duration;
}

// Convert form data to API ShiftTemplateEntity
function formDataToApiEntity(data: ShiftTemplateFormData): ShiftTemplateEntity {
  // Group definitions by shift, then create one ShiftDefinition per day
  const shifts: ShiftDefinition[] = [];

  for (const def of data.definitions) {
    for (const day of def.days) {
      shifts.push({
        applicableDay: day,
        startTime: timeToIsoDuration(def.startTime),
        endTime: timeToIsoDuration(def.endTime),
        name: def.name,
        breakDefinitions: def.breaks.map((b) => ({
          startTime: timeToIsoDuration(b.startTime),
          endTime: timeToIsoDuration(b.endTime),
          description: b.name,
        })),
        isOverTimeShift: false,
      });
    }
  }

  return {
    code: data.code,
    name: data.name,
    shifts,
  };
}

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
    const fetchTemplate = async () => {
      if (isEdit && templateId) {
        try {
          const template = await getShiftTemplateById(templateId);
          if (template) {
            // Group shifts by name to recreate definitions
            const shiftsByName = new Map<string, { shift: ShiftDefinition; days: DayOfWeek[] }>();

            for (const shift of template.shifts || []) {
              const name = shift.name || 'Unnamed Shift';
              if (!shiftsByName.has(name)) {
                shiftsByName.set(name, { shift, days: [] });
              }
              if (shift.applicableDay) {
                shiftsByName.get(name)!.days.push(shift.applicableDay as DayOfWeek);
              }
            }

            const definitions = Array.from(shiftsByName.entries()).map(
              ([name, { shift, days }]) => ({
                id: generateId(),
                name,
                startTime: parseDurationToTime(shift.startTime),
                endTime: parseDurationToTime(shift.endTime),
                breaks: (shift.breakDefinitions || []).map((b) => ({
                  id: generateId(),
                  startTime: parseDurationToTime(b.startTime),
                  endTime: parseDurationToTime(b.endTime),
                  name: b.description ?? undefined,
                })),
                days,
              })
            );

            setInitialData({
              code: template.code || '',
              name: template.name || '',
              description: template.description || '',
              weekType: '5-day',
              shiftPattern: '2-shifts',
              definitions:
                definitions.length > 0
                  ? definitions
                  : [
                      {
                        id: generateId(),
                        name: 'Shift 1',
                        startTime: '08:00',
                        endTime: '16:00',
                        breaks: [],
                        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
                      },
                    ],
            });
          } else {
            setErrorMessage('Template not found');
          }
        } catch (err) {
          setErrorMessage('Failed to load template');
          console.error('Error loading template:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTemplate();
  }, [isEdit, templateId]);

  const handleSubmit = useCallback(
    async (data: ShiftTemplateFormData) => {
      try {
        if (isEdit && templateId) {
          // For update, we need to send field updates as key-value pairs
          const updates = [
            { key: 'code', value: data.code },
            { key: 'name', value: data.name },
            { key: 'shifts', value: formDataToApiEntity(data).shifts },
            { key: 'description', value: data.description || '' },
          ];
          const updateResult = await updateShiftTemplate(templateId, updates);
          if (updateResult.isSuccess) setSuccessMessage('Template updated successfully');
          else {
            setErrorMessage(updateResult.message || 'Failed to update template');
            return;
          }
        } else {
          const entity = formDataToApiEntity(data);
          const result = await createShiftTemplate(entity);
          if (result.isSuccess) {
            setSuccessMessage('Template created successfully');
          } else {
            setErrorMessage(result.message || 'Failed to create template');
            return;
          }
        }

        setTimeout(() => {
          router.push('/shift-templates');
        }, 1000);
      } catch (err) {
        setErrorMessage('Failed to save template');
        console.error('Error saving template:', err);
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
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <CircularProgress />
        </Box>
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
