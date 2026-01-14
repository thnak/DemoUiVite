import type { Dayjs } from 'dayjs';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

// ----------------------------------------------------------------------

/**
 * @Docs
 * https://day.js.org/docs/en/display/format
 */

/**
 * Default timezones
 * https://day.js.org/docs/en/timezone/set-default-timezone#docsNav
 *
 */

/**
 * UTC
 * https://day.js.org/docs/en/plugin/utc
 * @install
 * import utc from 'dayjs/plugin/utc';
 * dayjs.extend(utc);
 * @usage
 * dayjs().utc().format()
 *
 */

dayjs.extend(duration);
dayjs.extend(relativeTime);

// ----------------------------------------------------------------------

export type DatePickerFormat = Dayjs | Date | string | number | null | undefined;

export const formatPatterns = {
  dateTime: 'DD MMM YYYY h:mm a', // 17 Apr 2022 12:00 am
  date: 'DD MMM YYYY', // 17 Apr 2022
  time: 'h:mm a', // 12:00 am
  split: {
    dateTime: 'DD/MM/YYYY h:mm a', // 17/04/2022 12:00 am
    date: 'DD/MM/YYYY', // 17/04/2022
  },
  paramCase: {
    dateTime: 'DD-MM-YYYY h:mm a', // 17-04-2022 12:00 am
    date: 'DD-MM-YYYY', // 17-04-2022
  },
};

const isValidDate = (date: DatePickerFormat) =>
  date !== null && date !== undefined && dayjs(date).isValid();

// ----------------------------------------------------------------------

/**
 * @output 17 Apr 2022 12:00 am
 */
export function fDateTime(date: DatePickerFormat, template?: string): string {
  if (!isValidDate(date)) {
    return 'Invalid date';
  }

  return dayjs(date).format(template ?? formatPatterns.dateTime);
}

// ----------------------------------------------------------------------

/**
 * @output 17 Apr 2022
 */
export function fDate(date: DatePickerFormat, template?: string): string {
  if (!isValidDate(date)) {
    return 'Invalid date';
  }

  return dayjs(date).format(template ?? formatPatterns.date);
}

// ----------------------------------------------------------------------

/**
 * @output a few seconds, 2 years
 */
export function fToNow(date: DatePickerFormat): string {
  if (!isValidDate(date)) {
    return 'Invalid date';
  }

  return dayjs(date).toNow(true);
}

// ----------------------------------------------------------------------

/**
 * Parse ISO 8601 duration string (e.g., "PT2H30M15S") to milliseconds
 * @param isoDuration - ISO 8601 duration string
 * @returns milliseconds or 0 if invalid
 */
function parseIsoDuration(isoDuration?: string): number {
  if (!isoDuration || typeof isoDuration !== 'string') return 0;

  const match = isoDuration.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?$/);
  if (!match) return 0;

  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseFloat(match[3] || '0');

  return (hours * 3600 + minutes * 60 + seconds) * 1000;
}

/**
 * Format ISO 8601 duration to human-readable text
 * @param isoDuration - ISO 8601 duration string (e.g., "PT2H30M15S")
 * @returns Human-readable duration (e.g., "about 2 hours", "30 minutes", "15 seconds")
 * @output "about 2 hours", "30 minutes", "15 seconds", "a few seconds"
 */
export function fDuration(isoDuration?: string): string {
  if (!isoDuration) return 'N/A';

  const ms = parseIsoDuration(isoDuration);
  if (ms === 0) return '0 seconds';

  const dur = dayjs.duration(ms);

  // Get components
  const hours = Math.floor(dur.asHours());
  const minutes = dur.minutes();
  const seconds = dur.seconds();

  // Build human-readable string
  const parts: string[] = [];

  if (hours > 0) {
    if (hours === 1) {
      parts.push('about 1 hour');
    } else {
      parts.push(`about ${hours} hours`);
    }
  }

  if (minutes > 0) {
    if (minutes === 1) {
      parts.push('1 minute');
    } else {
      parts.push(`${minutes} minutes`);
    }
  }

  if (seconds > 0 && hours === 0) {
    // Only show seconds if less than 1 hour
    if (seconds === 1) {
      parts.push('1 second');
    } else {
      parts.push(`${seconds} seconds`);
    }
  }

  if (parts.length === 0) return 'a few seconds';

  // Join with "and" for last item
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return parts.join(' and ');

  const last = parts.pop();
  return `${parts.join(', ')} and ${last}`;
}

/**
 * Format ISO 8601 duration to simple time display (HH:MM:SS or MM:SS)
 * @param isoDuration - ISO 8601 duration string (e.g., "PT2H30M15S")
 * @returns Simple time format (e.g., "2:30:15", "30:15", "0:15")
 */
export function fDurationSimple(isoDuration?: string): string {
  if (!isoDuration) return '00:00';

  const ms = parseIsoDuration(isoDuration);
  if (ms === 0) return '00:00';

  const dur = dayjs.duration(ms);
  const hours = Math.floor(dur.asHours());
  const minutes = dur.minutes();
  const seconds = dur.seconds();

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Format datetime to relative time from now
 * @param date - Date to format
 * @returns Relative time (e.g., "in 15 minutes", "in 2 hours", "in about 1 hour")
 */
export function fRelativeTime(date: DatePickerFormat): string {
  if (!isValidDate(date)) {
    return 'N/A';
  }

  const now = dayjs();
  const target = dayjs(date);
  const diffMinutes = target.diff(now, 'minute');

  // Past dates
  if (diffMinutes < 0) {
    return target.fromNow(); // "5 minutes ago"
  }

  // Future dates - customize for better UX
  if (diffMinutes < 1) {
    return 'in a few seconds';
  }
  if (diffMinutes === 1) {
    return 'in about 1 minute';
  }
  if (diffMinutes < 60) {
    return `in about ${diffMinutes} minutes`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  const remainingMinutes = diffMinutes % 60;

  if (diffHours === 1) {
    if (remainingMinutes === 0) {
      return 'in about 1 hour';
    }
    return `in about 1 hour ${remainingMinutes} min`;
  }

  if (diffHours < 24) {
    if (remainingMinutes === 0) {
      return `in about ${diffHours} hours`;
    }
    return `in about ${diffHours} hours ${remainingMinutes} min`;
  }

  // More than 24 hours - use default
  return target.fromNow(); // "in 2 days"
}
