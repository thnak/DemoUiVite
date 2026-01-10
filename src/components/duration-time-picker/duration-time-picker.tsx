import type { TextFieldProps } from '@mui/material/TextField';

import { useMemo, useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

/**
 * Precision mode for duration picker
 * - 'hours-minutes': Hours and minutes (default, for time of day)
 * - 'days-hours-minutes': Days, hours, and minutes (for longer durations)
 * - 'hours-minutes-seconds': Hours, minutes, and seconds (for precise durations)
 * - 'seconds': Seconds only (for cycle times and thresholds)
 */
export type DurationPrecision = 'hours-minutes' | 'days-hours-minutes' | 'hours-minutes-seconds' | 'seconds';

// ----------------------------------------------------------------------

/**
 * Parse ISO 8601 duration to component parts
 */
export function parseDurationToParts(duration: string | undefined): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  if (!duration) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  let days = 0;
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  // Extract numeric values (remove any negative signs for display)
  const cleanDuration = duration.replace(/-/g, '');

  const dayMatch = cleanDuration.match(/(\d+)D/);
  const hourMatch = cleanDuration.match(/(\d+)H/);
  const minuteMatch = cleanDuration.match(/(\d+)M(?!S)/); // M not followed by S
  const secondMatch = cleanDuration.match(/(\d+)S/);

  if (dayMatch) {
    days = parseInt(dayMatch[1], 10);
  }
  if (hourMatch) {
    hours = parseInt(hourMatch[1], 10);
  }
  if (minuteMatch) {
    minutes = parseInt(minuteMatch[1], 10);
  }
  if (secondMatch) {
    seconds = parseInt(secondMatch[1], 10);
  }

  return { days, hours, minutes, seconds };
}

/**
 * Convert component parts to ISO 8601 duration
 */
export function partsToIsoDuration(parts: {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}): string {
  const { days = 0, hours = 0, minutes = 0, seconds = 0 } = parts;

  if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
    return 'PT0S';
  }

  let duration = 'P';
  
  if (days > 0) {
    duration += `${days}D`;
  }
  
  duration += 'T';
  
  if (hours > 0) {
    duration += `${hours}H`;
  }
  if (minutes > 0) {
    duration += `${minutes}M`;
  }
  if (seconds > 0) {
    duration += `${seconds}S`;
  }

  // Remove T if no time components
  if (duration === 'PT') {
    return 'PT0S';
  }

  return duration;
}

/**
 * Convert seconds to ISO 8601 duration
 */
export function secondsToIsoDuration(seconds: number): string {
  if (seconds === 0) return 'PT0S';
  return `PT${seconds}S`;
}

/**
 * Convert ISO 8601 duration to total seconds
 */
export function isoDurationToSeconds(duration: string | undefined): number {
  if (!duration) return 0;
  
  const parts = parseDurationToParts(duration);
  const { days, hours, minutes, seconds } = parts;
  
  return days * 86400 + hours * 3600 + minutes * 60 + seconds;
}

/**
 * Format ISO 8601 duration to human-readable format
 */
export function formatDurationToHumanReadable(
  duration: string | undefined,
  precision: DurationPrecision = 'hours-minutes'
): string {
  if (!duration) {
    if (precision === 'seconds') return '0 seconds';
    if (precision === 'hours-minutes-seconds') return '0 seconds';
    return '0 minutes';
  }

  const parts = parseDurationToParts(duration);
  const { days, hours, minutes, seconds } = parts;

  // For seconds-only mode, convert everything to seconds
  if (precision === 'seconds') {
    const totalSeconds = days * 86400 + hours * 3600 + minutes * 60 + seconds;
    return `${totalSeconds} ${totalSeconds === 1 ? 'second' : 'seconds'}`;
  }

  const result: string[] = [];

  if (precision === 'days-hours-minutes' && days > 0) {
    result.push(`${days} ${days === 1 ? 'day' : 'days'}`);
  }
  
  if (hours > 0) {
    result.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
  }
  
  if (minutes > 0) {
    result.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
  }
  
  if (precision === 'hours-minutes-seconds' && seconds > 0) {
    result.push(`${seconds} ${seconds === 1 ? 'second' : 'seconds'}`);
  }

  if (result.length === 0) {
    if (precision === 'hours-minutes-seconds') return '0 seconds';
    return '0 minutes';
  }

  return result.join(' ');
}

// ----------------------------------------------------------------------

export interface DurationTimePickerProps extends Omit<TextFieldProps, 'value' | 'onChange'> {
  /**
   * ISO 8601 duration string value (e.g., "PT8H30M")
   */
  value?: string;
  /**
   * Callback when the duration changes
   * @param duration - ISO 8601 duration string
   */
  onChange?: (duration: string) => void;
  /**
   * Show helper text with human-readable duration
   * @default true
   */
  showHelperText?: boolean;
  /**
   * Precision mode for duration input
   * @default 'hours-minutes'
   */
  precision?: DurationPrecision;
}

/**
 * DurationTimePicker Component
 *
 * A duration picker with separate inputs for better UX.
 * Supports multiple precision modes.
 *
 * @example
 * ```tsx
 * // Hours and minutes (default)
 * <DurationTimePicker
 *   label="Start Time"
 *   value="PT8H30M"
 *   onChange={(duration) => console.log(duration)}
 * />
 *
 * // Days, hours, minutes
 * <DurationTimePicker
 *   label="Duration"
 *   value="P2DT8H30M"
 *   precision="days-hours-minutes"
 *   onChange={(duration) => console.log(duration)}
 * />
 *
 * // Hours, minutes, seconds
 * <DurationTimePicker
 *   label="Time"
 *   value="PT2H30M45S"
 *   precision="hours-minutes-seconds"
 *   onChange={(duration) => console.log(duration)}
 * />
 * ```
 */
export function DurationTimePicker({
  value,
  onChange,
  label,
  helperText,
  showHelperText = true,
  precision = 'hours-minutes',
  ...other
}: DurationTimePickerProps) {
  // For seconds-only mode, use total seconds
  const totalSeconds = useMemo(() => {
    if (precision === 'seconds') {
      return isoDurationToSeconds(value);
    }
    return 0;
  }, [value, precision]);

  // Local state for seconds-only mode
  const [totalSecondsStr, setTotalSecondsStr] = useState(() => 
    precision === 'seconds' && totalSeconds > 0 ? String(totalSeconds) : ''
  );

  // Parse current value into parts (for multi-part modes)
  const parts = useMemo(() => parseDurationToParts(value), [value]);

  // Local state for each input field (as strings to allow empty state)
  const [daysStr, setDaysStr] = useState(() => (parts.days > 0 ? String(parts.days) : ''));
  const [hoursStr, setHoursStr] = useState(() => (parts.hours > 0 ? String(parts.hours) : ''));
  const [minutesStr, setMinutesStr] = useState(() => (parts.minutes > 0 ? String(parts.minutes) : ''));
  const [secondsStr, setSecondsStr] = useState(() => (parts.seconds > 0 ? String(parts.seconds) : ''));

  // Update local state when value prop changes externally
  useEffect(() => {
    if (precision === 'seconds') {
      setTotalSecondsStr(totalSeconds > 0 ? String(totalSeconds) : '');
    } else {
      setDaysStr(parts.days > 0 ? String(parts.days) : '');
      setHoursStr(parts.hours > 0 ? String(parts.hours) : '');
      setMinutesStr(parts.minutes > 0 ? String(parts.minutes) : '');
      setSecondsStr(parts.seconds > 0 ? String(parts.seconds) : '');
    }
    // Sync internal state with external value changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parts.days, parts.hours, parts.minutes, parts.seconds, totalSeconds, precision]);

  // Handle seconds-only input change
  const handleSecondsOnlyChange = useCallback(
    (newValue: string) => {
      setTotalSecondsStr(newValue);
      
      if (onChange) {
        const secs = newValue === '' ? 0 : parseInt(newValue, 10) || 0;
        const isoDuration = secondsToIsoDuration(secs);
        onChange(isoDuration);
      }
    },
    [onChange]
  );

  // Handle input changes (for multi-part modes)
  const handlePartChange = useCallback(
    (partName: 'days' | 'hours' | 'minutes' | 'seconds', newValue: string) => {
      // Update local state
      const updateState = {
        days: partName === 'days' ? setDaysStr : null,
        hours: partName === 'hours' ? setHoursStr : null,
        minutes: partName === 'minutes' ? setMinutesStr : null,
        seconds: partName === 'seconds' ? setSecondsStr : null,
      };

      updateState[partName]?.(newValue);

      // Parse all values (empty string = 0)
      const days = partName === 'days' ? (newValue === '' ? 0 : parseInt(newValue, 10) || 0) : parts.days;
      const hours = partName === 'hours' ? (newValue === '' ? 0 : parseInt(newValue, 10) || 0) : parts.hours;
      const minutes = partName === 'minutes' ? (newValue === '' ? 0 : parseInt(newValue, 10) || 0) : parts.minutes;
      const seconds = partName === 'seconds' ? (newValue === '' ? 0 : parseInt(newValue, 10) || 0) : parts.seconds;

      // Convert to ISO 8601 and notify parent
      if (onChange) {
        const isoDuration = partsToIsoDuration({ days, hours, minutes, seconds });
        onChange(isoDuration);
      }
    },
    [onChange, parts.days, parts.hours, parts.minutes, parts.seconds]
  );

  // Generate helper text
  const generatedHelperText = useMemo(() => {
    if (helperText) return helperText;
    if (!showHelperText) return undefined;

    const humanReadable = formatDurationToHumanReadable(value, precision);
    return (
      <>
        <Typography component="span" variant="caption">
          {humanReadable}
        </Typography>
        {value && (
          <Typography component="span" variant="caption" sx={{ ml: 1, color: 'text.disabled' }}>
            ({value})
          </Typography>
        )}
      </>
    );
  }, [helperText, showHelperText, value, precision]);

  return (
    <Box>
      {label && (
        <Typography variant="body2" sx={{ mb: 0.5, color: 'text.secondary' }}>
          {label}
        </Typography>
      )}
      <Stack direction="row" spacing={1} alignItems="center">
        {/* Seconds-only mode */}
        {precision === 'seconds' && (
          <TextField
            {...other}
            type="number"
            value={totalSecondsStr}
            onChange={(e) => handleSecondsOnlyChange(e.target.value)}
            placeholder="0"
            label="Seconds"
            sx={{ width: 120 }}
            slotProps={{
              htmlInput: {
                min: 0,
                max: 999999,
                ...other.slotProps?.htmlInput,
              },
            }}
          />
        )}

        {/* Multi-part modes */}
        {precision !== 'seconds' && (
          <>
            {precision === 'days-hours-minutes' && (
              <TextField
                {...other}
                type="number"
                value={daysStr}
                onChange={(e) => handlePartChange('days', e.target.value)}
                placeholder="0"
                label="Days"
                sx={{ width: 80 }}
                slotProps={{
                  htmlInput: {
                    min: 0,
                    max: 365,
                    ...other.slotProps?.htmlInput,
                  },
                }}
              />
            )}

            <TextField
              {...other}
              type="number"
              value={hoursStr}
              onChange={(e) => handlePartChange('hours', e.target.value)}
              placeholder="0"
              label="Hours"
              sx={{ width: 80 }}
              slotProps={{
                htmlInput: {
                  min: 0,
                  max: precision === 'days-hours-minutes' ? 23 : 9999,
                  ...other.slotProps?.htmlInput,
                },
              }}
            />

            <TextField
              {...other}
              type="number"
              value={minutesStr}
              onChange={(e) => handlePartChange('minutes', e.target.value)}
              placeholder="0"
              label="Minutes"
              sx={{ width: 90 }}
              slotProps={{
                htmlInput: {
                  min: 0,
                  max: 59,
                  ...other.slotProps?.htmlInput,
                },
              }}
            />

            {precision === 'hours-minutes-seconds' && (
              <TextField
                {...other}
                type="number"
                value={secondsStr}
                onChange={(e) => handlePartChange('seconds', e.target.value)}
                placeholder="0"
                label="Seconds"
                sx={{ width: 90 }}
                slotProps={{
                  htmlInput: {
                    min: 0,
                    max: 59,
                    ...other.slotProps?.htmlInput,
                  },
                }}
              />
            )}
          </>
        )}
      </Stack>
      {generatedHelperText && (
        <Typography variant="caption" sx={{ mt: 0.5, display: 'block', color: 'text.secondary' }}>
          {generatedHelperText}
        </Typography>
      )}
    </Box>
  );
}
