import type { TextFieldProps } from '@mui/material/TextField';

import { useMemo, useCallback } from 'react';

import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

/**
 * Parse ISO 8601 duration to HH:mm format (e.g., "PT8H30M" -> "08:30")
 * Supports hours and minutes only (for time of day within 24 hours)
 * Note: Negative durations are converted to positive for display
 * Modulo operation ensures values fit within time input constraints
 */
export function parseDurationToTime(duration: string | undefined): string {
  if (!duration) return '00:00';

  let hours = 0;
  let minutes = 0;

  // Extract numeric values (remove any negative signs for display)
  const cleanDuration = duration.replace(/-/g, '');

  const hourMatch = cleanDuration.match(/(\d+)H/);
  const minuteMatch = cleanDuration.match(/(\d+)M/);

  if (hourMatch) {
    hours = parseInt(hourMatch[1], 10);
  }
  if (minuteMatch) {
    minutes = parseInt(minuteMatch[1], 10);
  }

  // Ensure values are in valid range for HTML5 time input (0-23 hours, 0-59 minutes)
  const displayHours = hours % 24;
  const displayMinutes = minutes % 60;

  return `${displayHours.toString().padStart(2, '0')}:${displayMinutes.toString().padStart(2, '0')}`;
}

/**
 * Convert HH:mm format to ISO 8601 duration (e.g., "08:30" -> "PT8H30M")
 * Note: Input is expected to be validated by HTML5 time input (type="time")
 */
export function timeToIsoDuration(time: string): string {
  if (!time) return 'PT0M';

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

/**
 * Format ISO 8601 duration to human-readable format (e.g., "PT8H30M" -> "8 hours 30 minutes")
 */
export function formatDurationToHumanReadable(duration: string | undefined): string {
  if (!duration) return '0 minutes';

  let hours = 0;
  let minutes = 0;

  // Extract numeric values
  const cleanDuration = duration.replace(/-/g, '');

  const hourMatch = cleanDuration.match(/(\d+)H/);
  const minuteMatch = cleanDuration.match(/(\d+)M/);

  if (hourMatch) {
    hours = parseInt(hourMatch[1], 10);
  }
  if (minuteMatch) {
    minutes = parseInt(minuteMatch[1], 10);
  }

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
  }
  if (minutes > 0) {
    parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
  }

  if (parts.length === 0) {
    return '0 minutes';
  }

  return parts.join(' ');
}

// ----------------------------------------------------------------------

export interface DurationTimePickerProps
  extends Omit<TextFieldProps, 'value' | 'onChange' | 'type'> {
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
}

/**
 * DurationTimePicker Component
 *
 * A time picker component for ISO 8601 duration format with 24-hour display.
 *
 * @example
 * ```tsx
 * <DurationTimePicker
 *   label="Start Time"
 *   value="PT8H30M"
 *   onChange={(duration) => console.log(duration)}
 * />
 * ```
 */
export function DurationTimePicker({
  value,
  onChange,
  helperText,
  showHelperText = true,
  ...other
}: DurationTimePickerProps) {
  // Convert ISO 8601 duration to HH:mm format for the time input
  const timeValue = useMemo(() => parseDurationToTime(value), [value]);

  // Convert HH:mm format back to ISO 8601 duration
  const handleTimeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newTime = event.target.value;
      if (onChange) {
        const isoDuration = timeToIsoDuration(newTime);
        onChange(isoDuration);
      }
    },
    [onChange]
  );

  // Generate helper text
  const generatedHelperText = useMemo(() => {
    if (helperText) return helperText;
    if (!showHelperText) return undefined;

    const humanReadable = formatDurationToHumanReadable(value);
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
  }, [helperText, showHelperText, value]);

  return (
    <TextField
      {...other}
      type="time"
      value={timeValue}
      onChange={handleTimeChange}
      helperText={generatedHelperText}
      slotProps={{
        inputLabel: { shrink: true },
        ...other.slotProps,
      }}
    />
  );
}
