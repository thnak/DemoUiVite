// ----------------------------------------------------------------------
// Shift Template Types
// ----------------------------------------------------------------------

export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

export const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

// ----------------------------------------------------------------------

export interface ShiftBreak {
  id: string;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  name?: string;
}

export interface ShiftDefinition {
  id: string;
  name: string;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  breaks: ShiftBreak[];
  days: DayOfWeek[];
}

export interface ShiftTemplate {
  id: string;
  code: string;
  name: string;
  description?: string;
  weekType: '5-day' | '7-day';
  shiftPattern: '2-shifts' | '3-shifts';
  definitions: ShiftDefinition[];
  createdAt: string;
  updatedAt: string;
}

// ----------------------------------------------------------------------
// Form Types
// ----------------------------------------------------------------------

export interface ShiftBreakFormData {
  id: string;
  startTime: string;
  endTime: string;
  name?: string;
}

export interface ShiftDefinitionFormData {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  breaks: ShiftBreakFormData[];
  days: DayOfWeek[];
}

export interface ShiftTemplateFormData {
  code: string;
  name: string;
  description?: string;
  weekType: '5-day' | '7-day';
  shiftPattern: '2-shifts' | '3-shifts';
  definitions: ShiftDefinitionFormData[];
}

// ----------------------------------------------------------------------
// Summary Types
// ----------------------------------------------------------------------

export interface DaySummary {
  day: DayOfWeek;
  workMinutes: number;
  breakMinutes: number;
}

export interface WeekSummary {
  totalWorkMinutes: number;
  totalBreakMinutes: number;
  dailySummaries: DaySummary[];
}

// ----------------------------------------------------------------------
// Utility Functions
// ----------------------------------------------------------------------

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

export function parseTime(time: string): { hours: number; minutes: number } {
  const [hours, minutes] = time.split(':').map(Number);
  return { hours, minutes };
}

export function timeToMinutes(time: string): number {
  const { hours, minutes } = parseTime(time);
  return hours * 60 + minutes;
}

export function calculateDurationMinutes(startTime: string, endTime: string): number {
  const startMinutes = timeToMinutes(startTime);
  let endMinutes = timeToMinutes(endTime);

  // Handle overnight shifts
  if (endMinutes <= startMinutes) {
    endMinutes += 24 * 60;
  }

  return endMinutes - startMinutes;
}

export function calculateBreakMinutes(breaks: ShiftBreak[]): number {
  return breaks.reduce(
    (total, breakItem) => total + calculateDurationMinutes(breakItem.startTime, breakItem.endTime),
    0
  );
}

export function calculateWeekSummary(definitions: ShiftDefinition[]): WeekSummary {
  const dailySummaries: DaySummary[] = DAYS_OF_WEEK.map((day) => {
    const dayDefinitions = definitions.filter((def) => def.days.includes(day));

    const workMinutes = dayDefinitions.reduce((total, def) => {
      const shiftDuration = calculateDurationMinutes(def.startTime, def.endTime);
      const breakDuration = calculateBreakMinutes(def.breaks);
      return total + shiftDuration - breakDuration;
    }, 0);

    const breakMinutes = dayDefinitions.reduce(
      (total, def) => total + calculateBreakMinutes(def.breaks),
      0
    );

    return { day, workMinutes, breakMinutes };
  });

  const totalWorkMinutes = dailySummaries.reduce((total, day) => total + day.workMinutes, 0);
  const totalBreakMinutes = dailySummaries.reduce((total, day) => total + day.breakMinutes, 0);

  return { totalWorkMinutes, totalBreakMinutes, dailySummaries };
}

export function minutesToHoursString(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${mins}m`;
}

export function createDefaultShiftDefinition(name: string = 'Shift 1'): ShiftDefinitionFormData {
  return {
    id: generateId(),
    name,
    startTime: '08:00',
    endTime: '16:00',
    breaks: [],
    days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  };
}

export function createDefaultBreak(): ShiftBreakFormData {
  return {
    id: generateId(),
    startTime: '12:00',
    endTime: '12:30',
    name: 'Lunch Break',
  };
}
