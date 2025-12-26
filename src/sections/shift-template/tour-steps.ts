import type { TourStep } from 'src/hooks/use-tour';

// ----------------------------------------------------------------------

/**
 * Tour steps for Shift Template Create/Edit pages
 */
export const shiftTemplateTourSteps = (isEdit: boolean): TourStep[] => [
  {
    id: 'welcome',
    title: isEdit ? 'Edit Shift Template Tour' : 'Create Shift Template Tour',
    text: isEdit
      ? 'Welcome! This guided tour will help you understand how to edit a shift template. Shift templates define the working hours, breaks, and schedules for your workforce.'
      : 'Welcome! This guided tour will help you create a new shift template. Shift templates define the working hours, breaks, and schedules for your workforce.',
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
    title: 'Template Code',
    text: 'Enter a unique code to identify this shift template. This code will be used when assigning templates to calendars.',
    attachTo: {
      element: '[data-tour="shift-code"]',
      on: 'bottom',
    },
  },
  {
    id: 'name',
    title: 'Template Name',
    text: 'Give your shift template a descriptive name. This helps identify the template when selecting it for calendars.',
    attachTo: {
      element: '[data-tour="shift-name"]',
      on: 'bottom',
    },
  },
  {
    id: 'description',
    title: 'Description',
    text: 'Add an optional description to explain the purpose or usage of this shift template.',
    attachTo: {
      element: '[data-tour="shift-description"]',
      on: 'bottom',
    },
  },
  {
    id: 'editor-mode',
    title: 'Editor Mode',
    text: 'Toggle between Normal and Advanced modes. Normal mode provides a simplified interface, while Advanced mode gives you more control over individual shift definitions.',
    attachTo: {
      element: '[data-tour="shift-editor-mode"]',
      on: 'bottom',
    },
  },
  {
    id: 'shift-definitions',
    title: 'Shift Definitions',
    text: 'Define your shifts here. Each shift can have a name, start time, end time, and applicable days. You can add multiple shifts for different times or days.',
    attachTo: {
      element: '[data-tour="shift-definitions"]',
      on: 'bottom',
    },
  },
  {
    id: 'shift-times',
    title: 'Shift Times',
    text: 'Set the start and end times for each shift using the time pickers. Times are specified in 24-hour format (e.g., 08:00 for 8 AM, 17:00 for 5 PM).',
    attachTo: {
      element: '[data-tour="shift-times"]',
      on: 'bottom',
    },
  },
  {
    id: 'applicable-days',
    title: 'Applicable Days',
    text: 'Select which days of the week this shift applies to. Click on day chips to toggle them. This allows you to create different schedules for different days.',
    attachTo: {
      element: '[data-tour="shift-days"]',
      on: 'bottom',
    },
  },
  {
    id: 'breaks',
    title: 'Break Management',
    text: 'Add breaks to your shifts. Each break has a start time, end time, and optional description. Breaks are automatically considered in work time calculations.',
    attachTo: {
      element: '[data-tour="shift-breaks"]',
      on: 'bottom',
    },
  },
  {
    id: 'summary',
    title: 'Week Summary',
    text: 'This chart shows a visual summary of your shift template across the week. It helps you understand the distribution of working hours and identify any gaps or overlaps.',
    attachTo: {
      element: '[data-tour="shift-summary"]',
      on: 'top',
    },
  },
  {
    id: 'actions',
    title: 'Save Your Template',
    text: isEdit
      ? 'Click "Save Changes" to update the shift template, or "Cancel" to discard your changes and return to the template list.'
      : 'Click "Create Template" to save your new shift template, or "Cancel" to discard and return to the template list.',
    attachTo: {
      element: '[data-tour="shift-actions"]',
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
