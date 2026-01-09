import type { TourStep } from 'src/hooks/use-tour';

// ----------------------------------------------------------------------

/**
 * Tour steps for Calendar Create/Edit pages
 */
export const calendarTourSteps = (isEdit: boolean): TourStep[] => [
  {
    id: 'welcome',
    title: isEdit ? 'Edit Calendar Tour' : 'Create Calendar Tour',
    text: isEdit
      ? 'Welcome! This guided tour will help you understand how to edit a calendar. A calendar defines the shift schedule and working days for your organization.'
      : 'Welcome! This guided tour will help you create a new calendar. A calendar defines the shift schedule and working days for your organization.',
    buttons: [
      {
        text: 'Skip',
        secondary: true,
      },
      {
        text: 'Start Tour',
      },
    ],
  },
  {
    id: 'code',
    title: 'Calendar Code',
    text: 'Enter a unique code to identify this calendar. This code will be used in reports and references throughout the system.',
    attachTo: {
      element: '[data-tour="calendar-code"]',
      on: 'bottom',
    },
  },
  {
    id: 'name',
    title: 'Calendar Name',
    text: 'Give your calendar a descriptive name. This will help you identify it easily in lists and selections.',
    attachTo: {
      element: '[data-tour="calendar-name"]',
      on: 'bottom',
    },
  },
  {
    id: 'shift-template',
    title: 'Shift Template',
    text: 'Select a shift template that defines the working hours and breaks for this calendar. Shift templates can be created in the Shift Templates section.',
    attachTo: {
      element: '[data-tour="calendar-shift-template"]',
      on: 'bottom',
    },
  },
  {
    id: 'apply-dates',
    title: 'Application Period',
    text: 'Define when this calendar is active. "Apply From" is the start date, and "Apply To" is the end date. You can enable "Plan to Infinite" for calendars without an end date.',
    attachTo: {
      element: '[data-tour="calendar-dates"]',
      on: 'bottom',
    },
  },
  {
    id: 'plan-infinite',
    title: 'Plan to Infinite',
    text: 'Enable this option if the calendar should continue indefinitely. When enabled, the "Apply To" date is not required.',
    attachTo: {
      element: '[data-tour="calendar-infinite"]',
      on: 'bottom',
    },
  },
  {
    id: 'work-date-time',
    title: 'Work Date Configuration',
    text: 'Configure the work date start time and time offset. The start time defines when a work day begins, and the time offset adjusts for timezone differences.',
    attachTo: {
      element: '[data-tour="calendar-work-time"]',
      on: 'bottom',
    },
  },
  {
    id: 'description',
    title: 'Description',
    text: 'Add an optional description to provide more context about this calendar. This helps other users understand its purpose and usage.',
    attachTo: {
      element: '[data-tour="calendar-description"]',
      on: 'bottom',
    },
  },
  {
    id: 'policy',
    title: 'Time-Shift Policy Configuration',
    text: 'Configure how the 8 time-shift cases are handled. These policies control OEE computation for early starts, overtime, night runs, and weekend/holiday production.',
    attachTo: {
      element: '[data-tour="calendar-policy"]',
      on: 'bottom',
    },
  },
  {
    id: 'late-buffer',
    title: 'Late Buffer Minutes',
    text: 'Set the threshold in minutes to distinguish between Case 5 (Overtime) and Case 6 (Night Run). Activity within this buffer after shift end is considered overtime. Default is 120 minutes (2 hours).',
    attachTo: {
      element: '[data-tour="calendar-late-buffer"]',
      on: 'bottom',
    },
  },
  {
    id: 'case4-merge',
    title: 'Merge Case 4: Early Start',
    text: 'Enable this to merge early start production (before first shift) into Shift 1 performance metrics. Disable to track it separately as "Early Production".',
    attachTo: {
      element: '[data-tour="calendar-case4-merge"]',
      on: 'bottom',
    },
  },
  {
    id: 'case5-merge',
    title: 'Merge Case 5: Overtime',
    text: 'Enable this to append overtime (within buffer) to the last shift performance. Disable to track it separately as "Overtime Production".',
    attachTo: {
      element: '[data-tour="calendar-case5-merge"]',
      on: 'bottom',
    },
  },
  {
    id: 'auto-virtual',
    title: 'Auto Virtual Shift',
    text: 'Enable this to automatically create virtual shifts for weekend (Case 7) and holiday (Case 8) production with OEE calculations. Disable to flag them as unscheduled runs.',
    attachTo: {
      element: '[data-tour="calendar-auto-virtual"]',
      on: 'bottom',
    },
  },
  {
    id: 'visualization',
    title: 'Time-Shift Case Visualization',
    text: 'This interactive diagram shows the 8 time-shift cases and how your policy configuration affects them. Click "Expand" to see the full timeline and case details. Cases highlighted in color are actively affected by your policies.',
    attachTo: {
      element: '[data-tour="calendar-visualization"]',
      on: 'top',
    },
  },
  {
    id: 'actions',
    title: 'Save Your Calendar',
    text: isEdit
      ? 'Click "Save Changes" to update the calendar, or "Cancel" to discard your changes and return to the calendar list.'
      : 'Click "Create Calendar" to save your new calendar, or "Cancel" to discard and return to the calendar list.',
    attachTo: {
      element: '[data-tour="calendar-actions"]',
      on: 'top',
    },
    buttons: [
      {
        text: 'Back',
        secondary: true,
      },
      {
        text: 'Finish',
      },
    ],
  },
];
