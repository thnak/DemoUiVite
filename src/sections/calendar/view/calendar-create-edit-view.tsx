import type { CalendarEntity, ShiftTemplateEntity } from 'src/api/types/generated';

import { useParams } from 'react-router';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Autocomplete from '@mui/material/Autocomplete';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';
import { searchShiftTemplate } from 'src/api/services/generated/shift-template';
import {
  createCalendar,
  updateCalendar,
  getCalendarById,
} from 'src/api/services/generated/calendar';

import { useTour, TourButton } from 'src/components/tour';
import { DurationTimePicker } from 'src/components/duration-time-picker';

import { calendarTourSteps } from '../tour-steps';

// ----------------------------------------------------------------------

interface CalendarFormData {
  code: string;
  name: string;
  description: string;
  shiftTemplateId: string;
  applyFrom: string;
  applyTo: string;
  plan2Infinite: boolean;
  workDateStartTime: string;
  timeOffset: string;
}

const defaultFormData: CalendarFormData = {
  code: '',
  name: '',
  description: '',
  shiftTemplateId: '',
  applyFrom: '',
  applyTo: '',
  plan2Infinite: false,
  workDateStartTime: '',
  timeOffset: 'PT7H',
};

// ----------------------------------------------------------------------

interface CalendarCreateEditViewProps {
  isEdit?: boolean;
}

export function CalendarCreateEditView({ isEdit = false }: CalendarCreateEditViewProps) {
  const router = useRouter();
  const params = useParams();
  const calendarId = params.id as string | undefined;

  const [formData, setFormData] = useState<CalendarFormData>(defaultFormData);
  const [shiftTemplates, setShiftTemplates] = useState<ShiftTemplateEntity[]>([]);
  const [selectedShiftTemplate, setSelectedShiftTemplate] = useState<ShiftTemplateEntity | null>(
    null
  );
  const [loading, setLoading] = useState(isEdit);
  const [loadingShiftTemplates, setLoadingShiftTemplates] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Initialize tour
  const { startTour } = useTour({
    steps: calendarTourSteps(isEdit),
    onComplete: () => {
      console.log('Calendar tour completed');
    },
    onCancel: () => {
      console.log('Calendar tour cancelled');
    },
  });

  // Fetch shift templates for autocomplete
  const fetchShiftTemplates = useCallback(async (searchText?: string) => {
    setLoadingShiftTemplates(true);
    try {
      const templates = await searchShiftTemplate({ searchText, maxResults: 50 });
      setShiftTemplates(templates.data || []);
    } catch (err) {
      console.error('Error fetching shift templates:', err);
    } finally {
      setLoadingShiftTemplates(false);
    }
  }, []);

  // Initial fetch of shift templates
  useEffect(() => {
    fetchShiftTemplates();
  }, [fetchShiftTemplates]);

  // Fetch calendar data for editing
  useEffect(() => {
    const fetchCalendar = async () => {
      if (isEdit && calendarId) {
        try {
          const calendar = await getCalendarById(calendarId);
          if (calendar) {
            setFormData({
              code: calendar.code || '',
              name: calendar.name || '',
              description: calendar.description || '',
              shiftTemplateId: calendar.shiftTemplateId?.toString() || '',
              applyFrom: calendar.applyFrom ? calendar.applyFrom.split('T')[0] : '',
              applyTo: calendar.applyTo ? calendar.applyTo.split('T')[0] : '',
              plan2Infinite: calendar.plan2Infinite || false,
              workDateStartTime: calendar.workDateStartTime || '',
              timeOffset: calendar.timeOffset || 'PT7H',
            });

            // Find and set the selected shift template
            if (calendar.shiftTemplateId) {
              const templates = await searchShiftTemplate({ maxResults: 100 });
              const foundTemplate = templates.data?.find(
                (t) => t.id?.toString() === calendar.shiftTemplateId?.toString()
              );
              if (foundTemplate) {
                setSelectedShiftTemplate(foundTemplate);
              }
            }
          } else {
            setErrorMessage('Calendar not found');
          }
        } catch (err) {
          setErrorMessage('Failed to load calendar');
          console.error('Error loading calendar:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCalendar();
  }, [isEdit, calendarId]);

  const handleInputChange = useCallback(
    (field: keyof CalendarFormData, value: string | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleShiftTemplateChange = useCallback((_: unknown, value: ShiftTemplateEntity | null) => {
    setSelectedShiftTemplate(value);
    setFormData((prev) => ({
      ...prev,
      shiftTemplateId: value?.id?.toString() || '',
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitting(true);
      setErrorMessage(null);

      try {
        if (isEdit && calendarId) {
          // For update, we need to send field updates as key-value pairs
          const updates = [
            { key: 'code', value: formData.code },
            { key: 'name', value: formData.name },
            { key: 'description', value: formData.description },
            { key: 'shiftTemplateId', value: formData.shiftTemplateId || undefined },
            {
              key: 'applyFrom',
              value: formData.applyFrom ? new Date(formData.applyFrom).toISOString() : undefined,
            },
            {
              key: 'applyTo',
              value: formData.plan2Infinite
                ? null
                : formData.applyTo
                  ? new Date(formData.applyTo).toISOString()
                  : undefined,
            },
            { key: 'plan2Infinite', value: formData.plan2Infinite },
            { key: 'workDateStartTime', value: formData.workDateStartTime || undefined },
            { key: 'timeOffset', value: formData.timeOffset || undefined },
          ];
          const updateResult = await updateCalendar(calendarId, updates);
          if (updateResult.isValid) {
            setSuccessMessage('Calendar updated successfully');
          } else {
            setErrorMessage(updateResult.message || 'Failed to update calendar');
            setSubmitting(false);
            return;
          }
        } else {
          const entity: CalendarEntity = {
            code: formData.code,
            name: formData.name,
            description: formData.description,
            shiftTemplateId: formData.shiftTemplateId || undefined,
            applyFrom: formData.applyFrom ? new Date(formData.applyFrom).toISOString() : undefined,
            applyTo: formData.plan2Infinite
              ? undefined
              : formData.applyTo
                ? new Date(formData.applyTo).toISOString()
                : undefined,
            plan2Infinite: formData.plan2Infinite,
            workDateStartTime: formData.workDateStartTime || undefined,
            timeOffset: formData.timeOffset || undefined,
          };
          const result = await createCalendar(entity);
          if (result.isValid) {
            setSuccessMessage('Calendar created successfully');
          } else {
            setErrorMessage(result.message || 'Failed to create calendar');
            setSubmitting(false);
            return;
          }
        }

        setTimeout(() => {
          router.push('/calendars');
        }, 1000);
      } catch (err) {
        setErrorMessage('Failed to save calendar');
        console.error('Error saving calendar:', err);
      } finally {
        setSubmitting(false);
      }
    },
    [isEdit, calendarId, formData, router]
  );

  const handleCancel = useCallback(() => {
    router.push('/calendars');
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
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ mb: 1 }}>
            {isEdit ? 'Edit Calendar' : 'Create Calendar'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              •
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              Calendars
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              •
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              {isEdit ? 'Edit' : 'Create'}
            </Typography>
          </Box>
        </Box>
        <TourButton onStartTour={startTour} />
      </Box>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Code"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                required
                data-tour="calendar-code"
              />

              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                data-tour="calendar-name"
              />

              <Autocomplete
                fullWidth
                options={shiftTemplates}
                value={selectedShiftTemplate}
                onChange={handleShiftTemplateChange}
                onInputChange={(_, value) => {
                  if (value) {
                    fetchShiftTemplates(value);
                  }
                }}
                getOptionLabel={(option) => option.name || option.code || ''}
                isOptionEqualToValue={(option, value) =>
                  option.id?.toString() === value.id?.toString()
                }
                loading={loadingShiftTemplates}
                data-tour="calendar-shift-template"
                renderInput={(inputParams) => (
                  <TextField
                    {...inputParams}
                    label="Shift Template"
                    slotProps={{
                      input: {
                        ...inputParams.InputProps,
                        endAdornment: (
                          <>
                            {loadingShiftTemplates ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {inputParams.InputProps.endAdornment}
                          </>
                        ),
                      },
                    }}
                  />
                )}
                renderOption={(props, option) => {
                  const { key, ...rest } = props;
                  return (
                    <li key={key} {...rest}>
                      <Box>
                        <Typography variant="body2">{option.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.code}
                        </Typography>
                      </Box>
                    </li>
                  );
                }}
              />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} data-tour="calendar-dates">
                <TextField
                  fullWidth
                  label="Apply From"
                  type="date"
                  value={formData.applyFrom}
                  onChange={(e) => handleInputChange('applyFrom', e.target.value)}
                  slotProps={{
                    inputLabel: { shrink: true },
                  }}
                />

                <TextField
                  fullWidth
                  label="Apply To"
                  type="date"
                  value={formData.applyTo}
                  onChange={(e) => handleInputChange('applyTo', e.target.value)}
                  disabled={formData.plan2Infinite}
                  slotProps={{
                    inputLabel: { shrink: true },
                  }}
                />
              </Stack>

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.plan2Infinite}
                    onChange={(e) => {
                      handleInputChange('plan2Infinite', e.target.checked);
                      if (e.target.checked) {
                        handleInputChange('applyTo', '');
                      }
                    }}
                  />
                }
                label="Plan to Infinite (when enabled, Apply To is not applicable)"
                data-tour="calendar-infinite"
              />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} data-tour="calendar-work-time">
                <DurationTimePicker
                  fullWidth
                  label="Work Date Start Time"
                  value={formData.workDateStartTime}
                  onChange={(duration) => handleInputChange('workDateStartTime', duration)}
                />

                <DurationTimePicker
                  fullWidth
                  label="Time Offset"
                  value={formData.timeOffset}
                  onChange={(duration) => handleInputChange('timeOffset', duration)}
                />
              </Stack>

              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                multiline
                rows={3}
                data-tour="calendar-description"
              />

              <Stack direction="row" spacing={2} justifyContent="flex-end" data-tour="calendar-actions">
                <Button variant="outlined" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={submitting}>
                  {submitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : isEdit ? (
                    'Save Changes'
                  ) : (
                    'Create Calendar'
                  )}
                </Button>
              </Stack>
            </Stack>
          </form>
        </CardContent>
      </Card>

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
