import type { SelectChangeEvent } from '@mui/material/Select';
import type {
  DayOfWeek,
  ShiftBreakFormData,
  ShiftTemplateFormData,
  ShiftDefinitionFormData,
} from 'src/types/shift';

import { motion, AnimatePresence } from 'framer-motion';
import React, { Fragment, useState, useCallback } from 'react';

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
import { TimeBlockNameSelector } from 'src/components/selectors';
import { DurationTimePicker, partsToIsoDuration } from 'src/components/duration-time-picker';

import {
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

// Easing constants
const EASE_OUT = [0.4, 0, 0.2, 1] as const;
const EASE_IN = [0.4, 0, 1, 1] as const;

// Animation variants for tab content
const tabContentVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: EASE_OUT,
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.3,
      ease: EASE_IN,
    },
  },
};

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

  // Normal mode shared state: days that apply to all shifts
  const [sharedDays, setSharedDays] = useState<DayOfWeek[]>(() => {
    const firstDef = initialData?.definitions?.[0];
    return firstDef?.days ?? ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // ----------------------------------------------------------------------

  const handleModeChange = useCallback(
    (_: React.SyntheticEvent, newMode: EditorMode) => {
      // When switching from normal to advanced, sync the shared days to all definitions
      if (mode === 'normal' && newMode === 'advanced') {
        setFormData((prev) => ({
          ...prev,
          definitions: prev.definitions.map((def) => ({
            ...def,
            days: sharedDays,
          })),
        }));
      }
      setMode(newMode);
    },
    [mode, sharedDays]
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

  // Helper to convert time field (HH:mm or ISO 8601) to ISO 8601
  const normalizeTimeValue = useCallback((value: string): string => {
    // If already in ISO 8601 format (starts with P), return as is
    if (value.startsWith('P')) {
      return value;
    }
    // Otherwise convert HH:mm to ISO 8601
    if (value.includes(':')) {
      const [hours, minutes] = value.split(':').map(Number);
      return partsToIsoDuration({ hours, minutes });
    }
    return value;
  }, []);

  // ----------------------------------------------------------------------
  // Shift Definition Handlers
  // ----------------------------------------------------------------------

  const handleAddDefinition = useCallback(() => {
    const newDef = createDefaultShiftDefinition(`Shift ${formData.definitions.length + 1}`);
    // New definitions get their own breaks in both modes
    // In normal mode, they will inherit shared days on submit
    // In advanced mode, they get their own days
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
    (defId: string, field: keyof ShiftDefinitionFormData, value: string | null | DayOfWeek[]) => {
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
  // Break Handlers (per shift - used in both normal and advanced modes)
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
      // timeBlockNameId is optional, no validation needed
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
      // In normal mode, apply shared days to all definitions before submitting
      if (mode === 'normal') {
        const updatedData = {
          ...formData,
          definitions: formData.definitions.map((def) => ({
            ...def,
            days: sharedDays,
          })),
        };
        onSubmit(updatedData);
      } else {
        onSubmit(formData);
      }
    }
  }, [formData, onSubmit, validate, mode, sharedDays]);

  // ----------------------------------------------------------------------
  // Calculate Summary
  // ----------------------------------------------------------------------

  // For summary calculation, use the appropriate data based on mode
  const effectiveDefinitions =
    mode === 'normal'
      ? formData.definitions.map((def) => ({
          ...def,
          days: sharedDays,
        }))
      : formData.definitions;

  const weekSummary = calculateWeekSummary(effectiveDefinitions);

  // ----------------------------------------------------------------------

  return (
    <Stack spacing={3}>
      {/* Mode Toggle */}
      <Card data-tour="shift-editor-mode">
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
                data-tour="shift-code"
              />
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={handleInputChange('name')}
                error={!!errors.name}
                helperText={errors.name}
                data-tour="shift-name"
              />
            </Stack>

            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={handleInputChange('description')}
              multiline
              rows={2}
              data-tour="shift-description"
            />
          </Stack>
        </CardContent>
      </Card>
      {/* Normal Mode: Shared Days */}
      <AnimatePresence mode="wait">
        {mode === 'normal' && (
          <motion.div
            key="normal-mode"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Days (Applied to All Shifts)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Select the days of the week that apply to all shifts. Break times can be configured
              individually for each shift below.
            </Typography>
            <Stack spacing={3}>
              {/* Shared Days Selector */}
              <FormControl fullWidth error={!!errors.sharedDays} data-tour="shift-days">
                <InputLabel>Days of Week</InputLabel>
                <Select
                  multiple
                  value={sharedDays}
                  onChange={handleSharedDaysChange}
                  input={<OutlinedInput label="Days of Week" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((day) => (
                        // Guard DAY_LABELS access in case the key is missing
                        <Chip key={day} label={(DAY_LABELS[day] ?? '').slice(0, 3)} size="small" />
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
            </Stack>
          </CardContent>
        </Card>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Shift Definitions */}
      <Card data-tour="shift-definitions">
        <CardContent>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}
          >
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
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
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
                  <TimeBlockNameSelector
                    value={def.timeBlockNameId || null}
                    onChange={(value) => handleDefinitionChange(def.id, 'timeBlockNameId', value)}
                    label="Time Block Name"
                    size="small"
                    fullWidth
                    error={!!errors[`def-${defIndex}-timeBlockNameId`]}
                    helperText={errors[`def-${defIndex}-timeBlockNameId`]}
                  />

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} data-tour="shift-times">
                    <Box sx={{ flex: 1 }}>
                      <DurationTimePicker
                        label="Start Time"
                        value={normalizeTimeValue(def.startTime)}
                        onChange={(duration) => handleDefinitionChange(def.id, 'startTime', duration)}
                        size="small"
                        fullWidth
                        showHelperText={false}
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <DurationTimePicker
                        label="End Time"
                        value={normalizeTimeValue(def.endTime)}
                        onChange={(duration) => handleDefinitionChange(def.id, 'endTime', duration)}
                        size="small"
                        fullWidth
                        showHelperText={false}
                      />
                    </Box>
                  </Stack>

                  {/* Breaks section - shown in both normal and advanced mode */}
                  <Box data-tour="shift-breaks">
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
                      <Typography
                        variant="body2"
                        color="text.disabled"
                        sx={{ fontStyle: 'italic' }}
                      >
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
                            <Box sx={{ width: 200 }}>
                              <DurationTimePicker
                                label="Start"
                                value={normalizeTimeValue(breakItem.startTime)}
                                onChange={(duration) =>
                                  handleBreakChange(def.id, breakItem.id, 'startTime', duration)
                                }
                                size="small"
                                showHelperText={false}
                              />
                            </Box>
                            <Box sx={{ width: 200 }}>
                              <DurationTimePicker
                                label="End"
                                value={normalizeTimeValue(breakItem.endTime)}
                                onChange={(duration) =>
                                  handleBreakChange(def.id, breakItem.id, 'endTime', duration)
                                }
                                size="small"
                                showHelperText={false}
                              />
                            </Box>
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

                  {/* Advanced Mode: Per-shift Days */}
                  {mode === 'advanced' && (
                    <FormControl fullWidth error={!!errors[`def-${defIndex}-days`]} data-tour="shift-days">
                      <InputLabel>Days of Week</InputLabel>
                      <Select
                        multiple
                        value={def.days}
                        onChange={(e) =>
                          handleDefinitionChange(def.id, 'days', e.target.value as DayOfWeek[])
                        }
                        input={<OutlinedInput label="Days of Week" />}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((day) => (
                              <Chip key={day} label={(DAY_LABELS[day] ?? '').slice(0, 3)} size="small" />
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
                      {errors[`def-${defIndex}-days`] && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                          {errors[`def-${defIndex}-days`]}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                </Stack>
              </Card>
            ))}
          </Stack>
        </CardContent>
      </Card>
      {/* Advanced Mode - Per-Day Control */}
      <AnimatePresence mode="wait">
        {mode === 'advanced' && (
          <motion.div
            key="advanced-mode"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
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
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(8, 1fr)',
                  gap: 1,
                  minWidth: 700,
                }}
              >
                {/* Header Row */}
                <Box sx={{ p: 1, fontWeight: 'bold', borderRadius: 1 }}>Shift</Box>
                {DAYS_OF_WEEK.map((day) => (
                  <Box
                    key={day}
                    sx={{ p: 1, fontWeight: 'bold', borderRadius: 1, textAlign: 'center' }}
                  >
                    {(DAY_LABELS[day] ?? '').slice(0, 3)}
                  </Box>
                ))}

                {/* Data Rows */}
                {formData.definitions.map((def) => (
                  <Fragment key={def.id}>
                    <Box key={`${def.id}-name`} sx={{ p: 1, borderRadius: 1 }}>
                      <Typography variant="body2" noWrap>
                        {def.timeBlockNameId ? `Time Block: ${def.timeBlockNameId}` : 'Unnamed Shift'}
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
          </motion.div>
        )}
      </AnimatePresence>
      {/* Weekly Summary Chart */}
      <Box data-tour="shift-summary">
        <WeekSummaryChart summary={weekSummary} title="Weekly Hours Summary" />
      </Box>
      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }} data-tour="shift-actions">
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
