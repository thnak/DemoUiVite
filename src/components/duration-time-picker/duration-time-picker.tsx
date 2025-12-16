import type { TextFieldProps } from '@mui/material/TextField';

import { useMemo, useCallback } from 'react';

import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

/**
 * Parse ISO 8601 duration to HH:mm format (e.g., "PT8H30M" -> "08:30")
 * Supports hours and minutes only (for time of day within 24 hours)
 * Note: Negative durations are converted to positive for display
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

  // Ensure values are in valid range for display (0-23 hours, 0-59 minutes)
  const displayHours = hours % 24;
  const displayMinutes = minutes % 60;

  return `${displayHours.toString().padStart(2, '0')}:${displayMinutes.toString().padStart(2, '0')}`;
}

/**
 * Convert HH:mm format to ISO 8601 duration (e.g., "08:30" -> "PT8H30M")
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

  // Handle text input change with format validation
  const handleTimeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      let newTime = event.target.value;
      
      // Remove any non-digit and non-colon characters
      newTime = newTime.replace(/[^\d:]/g, '');
      
      // Auto-format as user types
      if (newTime.length === 2 && !newTime.includes(':')) {
        newTime += ':';
      }
      
      // Limit to HH:mm format
      const parts = newTime.split(':');
      if (parts.length > 2) {
        newTime = `${parts[0]}:${parts[1]}`;
      }
      
      // Validate and convert when complete
      if (newTime.match(/^\d{2}:\d{2}$/)) {
        const [hours, minutes] = newTime.split(':').map(Number);
        
        // Validate ranges
        if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
          if (onChange) {
            const isoDuration = timeToIsoDuration(newTime);
            onChange(isoDuration);
          }
        }
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
      value={timeValue}
      onChange={handleTimeChange}
      helperText={generatedHelperText}
      placeholder="HH:mm (24-hour)"
      slotProps={{
        inputLabel: { shrink: true },
        input: {
          ...other.slotProps?.input,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton edge="end" size="small" disabled>
                <Iconify icon="solar:clock-circle-outline" width={20} />
              </IconButton>
            </InputAdornment>
          ),
        },
        htmlInput: {
          ...other.slotProps?.htmlInput,
          maxLength: 5, // HH:mm = 5 characters
          pattern: '[0-2][0-9]:[0-5][0-9]', // 24-hour pattern
        },
        ...other.slotProps,
      }}
    />
  );
}
