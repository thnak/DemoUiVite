import type { TimeRangeMode } from 'src/_mock';
import type { SelectChangeEvent } from '@mui/material/Select';

import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  timeRange: TimeRangeMode;
  startDate: Date;
  endDate: Date;
  selectedMachines: string[];
  selectedAreas: string[];
  selectedShifts: string[];
  machines: Array<{ id: string; name: string }>;
  areas: Array<{ id: string; name: string }>;
  shifts: Array<{ id: string; name: string }>;
  onTimeRangeChange: (value: TimeRangeMode) => void;
  onStartDateChange: (value: Date | null) => void;
  onEndDateChange: (value: Date | null) => void;
  onMachinesChange: (values: string[]) => void;
  onAreasChange: (values: string[]) => void;
  onShiftsChange: (values: string[]) => void;
};

export function OEESummaryFilters({
  timeRange,
  startDate,
  endDate,
  selectedMachines,
  selectedAreas,
  selectedShifts,
  machines,
  areas,
  shifts,
  onTimeRangeChange,
  onStartDateChange,
  onEndDateChange,
  onMachinesChange,
  onAreasChange,
  onShiftsChange,
}: Props) {
  const handleTimeRangeChange = useCallback(
    (event: SelectChangeEvent<TimeRangeMode>) => {
      onTimeRangeChange(event.target.value as TimeRangeMode);
    },
    [onTimeRangeChange]
  );

  const handleMachinesChange = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      const value = event.target.value;
      onMachinesChange(typeof value === 'string' ? value.split(',') : value);
    },
    [onMachinesChange]
  );

  const handleAreasChange = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      const value = event.target.value;
      onAreasChange(typeof value === 'string' ? value.split(',') : value);
    },
    [onAreasChange]
  );

  const handleShiftsChange = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      const value = event.target.value;
      onShiftsChange(typeof value === 'string' ? value.split(',') : value);
    },
    [onShiftsChange]
  );

  const handleStartDateChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const date = event.target.value ? new Date(event.target.value) : null;
      onStartDateChange(date);
    },
    [onStartDateChange]
  );

  const handleEndDateChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const date = event.target.value ? new Date(event.target.value) : null;
      onEndDateChange(date);
    },
    [onEndDateChange]
  );

  // Format date to YYYY-MM-DD for input
  const formatDateForInput = (date: Date) => date.toISOString().split('T')[0];

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      {/* Time Range Mode */}
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Time Range</InputLabel>
        <Select
          value={timeRange}
          label="Time Range"
          onChange={handleTimeRangeChange}
          startAdornment={<Iconify icon="solar:calendar-mark-bold" sx={{ mr: 1, ml: 0.5 }} />}
        >
          <MenuItem value="days">Days</MenuItem>
          <MenuItem value="months">Months</MenuItem>
          <MenuItem value="years">Years</MenuItem>
        </Select>
      </FormControl>
      {/* Start Date */}
      <TextField
        type="date"
        label="Start Date"
        size="small"
        value={formatDateForInput(startDate)}
        onChange={handleStartDateChange}
        sx={{ minWidth: 160 }}
        slotProps={{
          inputLabel: { shrink: true },
        }}
      />
      {/* End Date */}
      <TextField
        type="date"
        label="End Date"
        size="small"
        value={formatDateForInput(endDate)}
        onChange={handleEndDateChange}
        sx={{ minWidth: 160 }}
        slotProps={{
          inputLabel: { shrink: true },
        }}
      />
      {/* Machines Multi-Select */}
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel>Machines</InputLabel>
        <Select
          multiple
          value={selectedMachines}
          onChange={handleMachinesChange}
          input={<OutlinedInput label="Machines" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.length === 0 ? (
                <span>All Machines</span>
              ) : (
                selected.map((value) => {
                  const machine = machines.find((m) => m.id === value);
                  return <Chip key={value} label={machine?.name || value} size="small" />;
                })
              )}
            </Box>
          )}
          startAdornment={<Iconify icon="solar:widget-2-bold" sx={{ mr: 1, ml: 0.5 }} />}
        >
          {machines.map((machine) => (
            <MenuItem key={machine.id} value={machine.id}>
              <Checkbox checked={selectedMachines.includes(machine.id)} />
              {machine.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* Areas Multi-Select */}
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel>Areas</InputLabel>
        <Select
          multiple
          value={selectedAreas}
          onChange={handleAreasChange}
          input={<OutlinedInput label="Areas" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.length === 0 ? (
                <span>All Areas</span>
              ) : (
                selected.map((value) => {
                  const area = areas.find((a) => a.id === value);
                  return <Chip key={value} label={area?.name || value} size="small" />;
                })
              )}
            </Box>
          )}
          startAdornment={<Iconify icon="solar:map-bold" sx={{ mr: 1, ml: 0.5 }} />}
        >
          {areas.map((area) => (
            <MenuItem key={area.id} value={area.id}>
              <Checkbox checked={selectedAreas.includes(area.id)} />
              {area.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* Shifts Multi-Select */}
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel>Shifts</InputLabel>
        <Select
          multiple
          value={selectedShifts}
          onChange={handleShiftsChange}
          input={<OutlinedInput label="Shifts" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.length === 0 ? (
                <span>All Shifts</span>
              ) : (
                selected.map((value) => {
                  const shift = shifts.find((s) => s.id === value);
                  return <Chip key={value} label={shift?.name || value} size="small" />;
                })
              )}
            </Box>
          )}
          startAdornment={<Iconify icon="solar:clock-circle-bold" sx={{ mr: 1, ml: 0.5 }} />}
        >
          {shifts.map((shift) => (
            <MenuItem key={shift.id} value={shift.id}>
              <Checkbox checked={selectedShifts.includes(shift.id)} />
              {shift.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
