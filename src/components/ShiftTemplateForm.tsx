import type { SelectChangeEvent } from '@mui/material/Select';
import type {
  DayOfWeek,
  ShiftBreakFormData,
  ShiftTemplateFormData,
  ShiftDefinitionFormData,
} from 'src/types/shift';

import { Fragment, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';

import { Iconify } from 'src/components/iconify';
import { WeekSummaryChart } from 'src/components/WeekSummaryChart';

import {
  generateId,
  DAY_LABELS,
  DAYS_OF_WEEK,
  createDefaultBreak,
  calculateWeekSummary,
  createDefaultShiftDefinition,
} from 'src/types/shift';

// ----------------------------------------------------------------------

interface ShiftTemplateFormProps {
  initialData?: ShiftTemplateFormData;
  onSubmit: (data: ShiftTemplateFormData) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

type EditorMode = 'normal' | 'advanced';

export function ShiftTemplateForm({
  initialData,
  onSubmit,
  onCancel,
  isEdit = false,
}: ShiftTemplateFormProps) {
  const [mode, setMode] = useState<EditorMode>('normal');

  const [formData, setFormData] = useState<ShiftTemplateFormData>(
    initialData || {
      code: '',
      name: '',
      description: '',
      weekType: '5-day',
      shiftPattern: '2-shifts',
      definitions: [createDefaultShiftDefinition()],
    }
  );

  // Normal mode shared state: days and breaks that apply to all shifts
  const [sharedDays, setSharedDays] = useState<DayOfWeek[]>(
    initialData?.definitions[0]?.days || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
  );
  const [sharedBreaks, setSharedBreaks] = useState<ShiftBreakFormData[]>(
    initialData?.definitions[0]?.breaks || []
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  // ----------------------------------------------------------------------

  const handleModeChange = useCallback(
    (_: React.SyntheticEvent, newMode: EditorMode) => {
      // When switching from normal to advanced, sync the shared days/breaks to all definitions
      if (mode === 'normal' && newMode === 'advanced') {
        setFormData((prev) => ({
          ...prev,
          definitions: prev.definitions.map((def) => ({
            ...def,
            days: sharedDays,
            breaks: sharedBreaks.map((b) => ({ ...b, id: generateId() })),
          })),
        }));
      }
      setMode(newMode);
    },
    [mode, sharedDays, sharedBreaks]
  );

  const handleInputChange = useCallback(
    (field: keyof ShiftTemplateFormData) =>
      (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({ ...prev, [field]: event.target.value }));
        setErrors((prev) => ({ ...prev, [field]: '' }));
      },
    []
  );

  // ----------------------------------------------------------------------
  // Shared Days Handler (Normal Mode)
  // ----------------------------------------------------------------------

  const handleSharedDaysChange = useCallback((event: SelectChangeEvent<DayOfWeek[]>) => {
    const value = event.target.value as DayOfWeek[];
    setSharedDays(value);
    setErrors((prev) => ({ ...prev, sharedDays: '' }));
  }, []);

  // ----------------------------------------------------------------------
  // Shared Break Handlers (Normal Mode)
  // ----------------------------------------------------------------------

  const handleAddSharedBreak = useCallback(() => {
    const newBreak = createDefaultBreak();
    setSharedBreaks((prev) => [...prev, newBreak]);
  }, []);

  const handleRemoveSharedBreak = useCallback((breakId: string) => {
    setSharedBreaks((prev) => prev.filter((b) => b.id !== breakId));
  }, []);

  const handleSharedBreakChange = useCallback(
    (breakId: string, field: keyof ShiftBreakFormData, value: string) => {
      setSharedBreaks((prev) =>
        prev.map((b) => (b.id === breakId ? { ...b, [field]: value } : b))
      );
    },
    []
  );

  // ----------------------------------------------------------------------
  // Shift Definition Handlers
  // ----------------------------------------------------------------------

  const handleAddDefinition = useCallback(() => {
    const newDef = createDefaultShiftDefinition(`Shift ${formData.definitions.length + 1}`);
    // In advanced mode, new definitions get their own days/breaks
    // In normal mode, they will inherit shared days/breaks when switching to advanced or on submit
    setFormData((prev) => ({
      ...prev,
      definitions: [...prev.definitions, newDef],
    }));
  }, [formData.definitions.length]);

  const handleRemoveDefinition = useCallback((defId: string) => {
    setFormData((prev) => ({
      ...prev,
      definitions: prev.definitions.filter((d) => d.id !== defId),
    }));
  }, []);

  const handleDefinitionChange = useCallback(
    (defId: string, field: keyof ShiftDefinitionFormData, value: string | DayOfWeek[]) => {
      setFormData((prev) => ({
        ...prev,
        definitions: prev.definitions.map((def) =>
          def.id === defId ? { ...def, [field]: value } : def
        ),
      }));
    },
    []
  );

  // ----------------------------------------------------------------------
  // Break Handlers (Advanced Mode - per shift)
  // ----------------------------------------------------------------------

  const handleAddBreak = useCallback((defId: string) => {
    const newBreak = createDefaultBreak();
    setFormData((prev) => ({
      ...prev,
      definitions: prev.definitions.map((def) =>
        def.id === defId ? { ...def, breaks: [...def.breaks, newBreak] } : def
      ),
    }));
  }, []);

  const handleRemoveBreak = useCallback((defId: string, breakId: string) => {
    setFormData((prev) => ({
      ...prev,
      definitions: prev.definitions.map((def) =>
        def.id === defId ? { ...def, breaks: def.breaks.filter((b) => b.id !== breakId) } : def
      ),
    }));
  }, []);

  const handleBreakChange = useCallback(
    (defId: string, breakId: string, field: keyof ShiftBreakFormData, value: string) => {
      setFormData((prev) => ({
        ...prev,
        definitions: prev.definitions.map((def) =>
          def.id === defId
            ? {
                ...def,
                breaks: def.breaks.map((b) => (b.id === breakId ? { ...b, [field]: value } : b)),
              }
            : def
        ),
      }));
    },
    []
  );

  // ----------------------------------------------------------------------
  // Validation & Submit
  // ----------------------------------------------------------------------

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Code is required';
    }
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (formData.definitions.length === 0) {
      newErrors.definitions = 'At least one shift definition is required';
    }

    // In normal mode, validate shared days
    if (mode === 'normal') {
      if (sharedDays.length === 0) {
        newErrors.sharedDays = 'Select at least one day';
      }
    }

    formData.definitions.forEach((def, index) => {
      if (!def.name.trim()) {
        newErrors[`def-${index}-name`] = 'Shift name is required';
      }
      // In advanced mode, validate per-definition days
      if (mode === 'advanced' && def.days.length === 0) {
        newErrors[`def-${index}-days`] = 'Select at least one day';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, mode, sharedDays]);

  const handleSubmit = useCallback(() => {
    if (validate()) {
      // In normal mode, apply shared days and breaks to all definitions before submitting
      if (mode === 'normal') {
        const updatedData = {
          ...formData,
          definitions: formData.definitions.map((def) => ({
            ...def,
            days: sharedDays,
            breaks: sharedBreaks.map((b) => ({ ...b, id: generateId() })),
          })),
        };
        onSubmit(updatedData);
      } else {
        onSubmit(formData);
      }
    }
  }, [formData, onSubmit, validate, mode, sharedDays, sharedBreaks]);

  // ----------------------------------------------------------------------
  // Calculate Summary
  // ----------------------------------------------------------------------

  // For summary calculation, use the appropriate data based on mode
  const effectiveDefinitions =
    mode === 'normal'
      ? formData.definitions.map((def) => ({
          ...def,
          days: sharedDays,
          breaks: sharedBreaks,
        }))
      : formData.definitions;

  const weekSummary = calculateWeekSummary(effectiveDefinitions);

  // ----------------------------------------------------------------------

  return (
    <Stack spacing={3}>
      {/* Mode Toggle */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={mode} onChange={handleModeChange}>
            <Tab label="Normal Mode" value="normal" />
            <Tab label="Advanced Mode" value="advanced" />
          </Tabs>
        </Box>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Basic Information
          </Typography>
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="Code"
                value={formData.code}
                onChange={handleInputChange('code')}
                error={!!errors.code}
                helperText={errors.code}
              />
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={handleInputChange('name')}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Stack>

            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={handleInputChange('description')}
              multiline
              rows={2}
            />

          </Stack>
        </CardContent>
      </Card>

      {/* Normal Mode: Shared Days and Breaks */}
      {mode === 'normal' && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Days & Breaks (Applied to All Shifts)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Select the days of the week and define break times. These settings will apply to all
              shifts you create.
            </Typography>
            <Stack spacing={3}>
              {/* Shared Days Selector */}
              <FormControl fullWidth error={!!errors.sharedDays}>
                <InputLabel>Days of Week</InputLabel>
                <Select
                  multiple
                  value={sharedDays}
                  onChange={handleSharedDaysChange}
                  input={<OutlinedInput label="Days of Week" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((day) => (
                        <Chip key={day} label={DAY_LABELS[day].slice(0, 3)} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {DAYS_OF_WEEK.map((day) => (
                    <MenuItem key={day} value={day}>
                      {DAY_LABELS[day]}
                    </MenuItem>
                  ))}
                </Select>
                {errors.sharedDays && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                    {errors.sharedDays}
                  </Typography>
                )}
              </FormControl>

              {/* Shared Breaks Section */}
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Break Times (Applied to All Shifts)
                  </Typography>
                  <Button size="small" onClick={handleAddSharedBreak}>
                    Add Break
                  </Button>
                </Box>

                {sharedBreaks.length === 0 ? (
                  <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic' }}>
                    No breaks defined
                  </Typography>
                ) : (
                  <Stack spacing={1}>
                    {sharedBreaks.map((breakItem) => (
                      <Box
                        key={breakItem.id}
                        sx={{
                          display: 'flex',
                          gap: 1,
                          alignItems: 'center',
                          p: 1,
                          bgcolor: 'grey.50',
                          borderRadius: 1,
                        }}
                      >
                        <TextField
                          size="small"
                          label="Name"
                          value={breakItem.name || ''}
                          onChange={(e) =>
                            handleSharedBreakChange(breakItem.id, 'name', e.target.value)
                          }
                          sx={{ flex: 1 }}
                        />
                        <TextField
                          size="small"
                          type="time"
                          label="Start"
                          value={breakItem.startTime}
                          onChange={(e) =>
                            handleSharedBreakChange(breakItem.id, 'startTime', e.target.value)
                          }
                          slotProps={{
                            inputLabel: { shrink: true },
                          }}
                          sx={{ width: 130 }}
                        />
                        <TextField
                          size="small"
                          type="time"
                          label="End"
                          value={breakItem.endTime}
                          onChange={(e) =>
                            handleSharedBreakChange(breakItem.id, 'endTime', e.target.value)
                          }
                          slotProps={{
                            inputLabel: { shrink: true },
                          }}
                          sx={{ width: 130 }}
                        />
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveSharedBreak(breakItem.id)}
                        >
                          <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Box>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Shift Definitions */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Shift Definitions</Typography>
            <Button
              variant="outlined"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={handleAddDefinition}
            >
              Add Shift
            </Button>
          </Box>

          {errors.definitions && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {errors.definitions}
            </Typography>
          )}

          <Stack spacing={3}>
            {formData.definitions.map((def, defIndex) => (
              <Card key={def.id} variant="outlined" sx={{ p: 2 }}>
                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
                >
                  <Typography variant="subtitle1">Shift {defIndex + 1}</Typography>
                  {formData.definitions.length > 1 && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveDefinition(def.id)}
                    >
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  )}
                </Box>

                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Shift Name"
                    value={def.name}
                    onChange={(e) => handleDefinitionChange(def.id, 'name', e.target.value)}
                    error={!!errors[`def-${defIndex}-name`]}
                    helperText={errors[`def-${defIndex}-name`]}
                  />

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      fullWidth
                      size="small"
                      type="time"
                      label="Start Time"
                      value={def.startTime}
                      onChange={(e) => handleDefinitionChange(def.id, 'startTime', e.target.value)}
                      slotProps={{
                        inputLabel: { shrink: true },
                      }}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      type="time"
                      label="End Time"
                      value={def.endTime}
                      onChange={(e) => handleDefinitionChange(def.id, 'endTime', e.target.value)}
                      slotProps={{
                        inputLabel: { shrink: true },
                      }}
                    />
                  </Stack>

                  {/* Advanced Mode: Per-shift Breaks */}
                  {mode === 'advanced' && (
                    <Box>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 1,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Breaks
                        </Typography>
                        <Button size="small" onClick={() => handleAddBreak(def.id)}>
                          Add Break
                        </Button>
                      </Box>

                      {def.breaks.length === 0 ? (
                        <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic' }}>
                          No breaks defined
                        </Typography>
                      ) : (
                        <Stack spacing={1}>
                          {def.breaks.map((breakItem) => (
                            <Box
                              key={breakItem.id}
                              sx={{
                                display: 'flex',
                                gap: 1,
                                alignItems: 'center',
                                p: 1,
                                bgcolor: 'grey.50',
                                borderRadius: 1,
                              }}
                            >
                              <TextField
                                size="small"
                                label="Name"
                                value={breakItem.name || ''}
                                onChange={(e) =>
                                  handleBreakChange(def.id, breakItem.id, 'name', e.target.value)
                                }
                                sx={{ flex: 1 }}
                              />
                              <TextField
                                size="small"
                                type="time"
                                label="Start"
                                value={breakItem.startTime}
                                onChange={(e) =>
                                  handleBreakChange(def.id, breakItem.id, 'startTime', e.target.value)
                                }
                                slotProps={{
                                  inputLabel: { shrink: true },
                                }}
                                sx={{ width: 130 }}
                              />
                              <TextField
                                size="small"
                                type="time"
                                label="End"
                                value={breakItem.endTime}
                                onChange={(e) =>
                                  handleBreakChange(def.id, breakItem.id, 'endTime', e.target.value)
                                }
                                slotProps={{
                                  inputLabel: { shrink: true },
                                }}
                                sx={{ width: 130 }}
                              />
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleRemoveBreak(def.id, breakItem.id)}
                              >
                                <Iconify icon="solar:trash-bin-trash-bold" />
                              </IconButton>
                            </Box>
                          ))}
                        </Stack>
                      )}
                    </Box>
                  )}
                </Stack>
              </Card>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Advanced Mode - Per-Day Control */}
      {mode === 'advanced' && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Advanced: Per-Day Shift Control
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              In advanced mode, you can see and manage shifts for each specific day. The table below
              shows which shifts are active on each day.
            </Typography>

            <Box sx={{ overflowX: 'auto' }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 1, minWidth: 700 }}>
                {/* Header Row */}
                <Box sx={{ p: 1, fontWeight: 'bold', bgcolor: 'grey.100', borderRadius: 1 }}>
                  Shift
                </Box>
                {DAYS_OF_WEEK.map((day) => (
                  <Box
                    key={day}
                    sx={{ p: 1, fontWeight: 'bold', bgcolor: 'grey.100', borderRadius: 1, textAlign: 'center' }}
                  >
                    {DAY_LABELS[day].slice(0, 3)}
                  </Box>
                ))}

                {/* Data Rows */}
                {formData.definitions.map((def) => (
                  <Fragment key={def.id}>
                    <Box key={`${def.id}-name`} sx={{ p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="body2" noWrap>
                        {def.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {def.startTime} - {def.endTime}
                      </Typography>
                    </Box>
                    {DAYS_OF_WEEK.map((day) => {
                      const isActive = def.days.includes(day);
                      return (
                        <Box
                          key={`${def.id}-${day}`}
                          sx={{
                            p: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 1,
                            bgcolor: isActive ? 'primary.lighter' : 'grey.50',
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: isActive ? 'primary.light' : 'grey.200',
                            },
                          }}
                          onClick={() => {
                            const newDays = isActive
                              ? def.days.filter((d) => d !== day)
                              : [...def.days, day];
                            handleDefinitionChange(def.id, 'days', newDays);
                          }}
                        >
                          <Iconify
                            icon={isActive ? 'solar:check-circle-bold' : 'mingcute:close-line'}
                            sx={{
                              color: isActive ? 'primary.main' : 'grey.400',
                            }}
                          />
                        </Box>
                      );
                    })}
                  </Fragment>
                ))}
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Weekly Summary Chart */}
      <WeekSummaryChart summary={weekSummary} title="Weekly Hours Summary" />

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="outlined" color="inherit" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="inherit"
          onClick={handleSubmit}
          sx={{
            bgcolor: 'grey.900',
            color: 'common.white',
            '&:hover': { bgcolor: 'grey.800' },
          }}
        >
          {isEdit ? 'Save Changes' : 'Create Template'}
        </Button>
      </Box>
    </Stack>
  );
}
