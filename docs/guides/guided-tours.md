# Guided Tour Implementation

This document describes the implementation of Shepherd.js guided tours for the Calendar and Shift Template pages.

## Overview

Guided tours have been added to help users understand how to create and edit calendars and shift templates. The tours provide step-by-step guidance through the form fields and features.

## Features

### Tour Components

1. **TourButton Component** (`src/components/tour/tour-button.tsx`)
   - A reusable button component that triggers tours
   - Displays a "Help" button with an info icon
   - Positioned in the page header next to the breadcrumbs

2. **useTour Hook** (`src/hooks/use-tour.ts`)
   - Custom React hook for managing Shepherd.js tours
   - Handles tour lifecycle (start, cancel, complete)
   - Dynamically imports Shepherd.js to avoid SSR issues
   - Supports custom tour steps and options

3. **Tour Styling** (`src/components/tour/styles.css`)
   - Custom Shepherd.js theme matching the application design
   - Support for both light and dark modes
   - Responsive design for mobile devices

### Implemented Tours

#### 1. Calendar Create/Edit Tour

**Location**: `src/sections/calendar/tour-steps.ts`

**Steps**:
1. **Welcome** - Introduction to calendar creation/editing
2. **Code** - Explains the calendar code field
3. **Name** - Describes the calendar name field
4. **Shift Template** - How to select a shift template
5. **Application Period** - Setting start and end dates
6. **Plan to Infinite** - Using the infinite planning option
7. **Work Date Configuration** - Configuring work times and offsets
8. **Description** - Adding optional descriptions
9. **Actions** - Saving or canceling changes

**Trigger**: Click the "Help" button in the page header on:
- `/calendar-create` - Calendar Create page
- `/calendar-edit/:id` - Calendar Edit page

#### 2. Shift Template Create/Edit Tour

**Location**: `src/sections/shift-template/tour-steps.ts`

**Steps**:
1. **Welcome** - Introduction to shift template creation/editing
2. **Code** - Explains the template code field
3. **Name** - Describes the template name field
4. **Description** - Adding optional descriptions
5. **Editor Mode** - Toggling between Normal and Advanced modes
6. **Shift Definitions** - Creating and managing shifts
7. **Shift Times** - Setting start and end times
8. **Applicable Days** - Selecting days of the week
9. **Break Management** - Adding and managing breaks
10. **Week Summary** - Understanding the visual summary chart
11. **Actions** - Saving or canceling changes

**Trigger**: Click the "Help" button in the page header on:
- `/shift-template-create` - Shift Template Create page
- `/shift-template-edit/:id` - Shift Template Edit page

## Implementation Details

### Data Attributes

Form elements are tagged with `data-tour` attributes to enable the tour to highlight specific elements:

**Calendar Form**:
- `data-tour="calendar-code"` - Code input field
- `data-tour="calendar-name"` - Name input field
- `data-tour="calendar-shift-template"` - Shift template selector
- `data-tour="calendar-dates"` - Date range fields
- `data-tour="calendar-infinite"` - Plan to infinite switch
- `data-tour="calendar-work-time"` - Work time configuration
- `data-tour="calendar-description"` - Description field
- `data-tour="calendar-actions"` - Action buttons

**Shift Template Form**:
- `data-tour="shift-code"` - Code input field
- `data-tour="shift-name"` - Name input field
- `data-tour="shift-description"` - Description field
- `data-tour="shift-editor-mode"` - Editor mode tabs
- `data-tour="shift-definitions"` - Shift definitions card
- `data-tour="shift-times"` - Time picker fields
- `data-tour="shift-days"` - Days of week selector
- `data-tour="shift-breaks"` - Break management section
- `data-tour="shift-summary"` - Week summary chart
- `data-tour="shift-actions"` - Action buttons

### Tour Behavior

- **Skip Option**: Users can skip the tour at any time using the "Skip" button
- **Navigation**: Users can navigate forward ("Next") or backward ("Back") through steps
- **Modal Overlay**: The tour uses a modal overlay to focus user attention
- **Element Highlighting**: Targeted elements are highlighted with a border and padding
- **Responsive**: Tours adapt to different screen sizes

### Customization

Tours can be customized by modifying the tour steps files:

```typescript
export const calendarTourSteps = (isEdit: boolean): TourStep[] => [
  {
    id: 'step-id',
    title: 'Step Title',
    text: 'Step description...',
    attachTo: {
      element: '[data-tour="element-id"]',
      on: 'bottom', // or 'top', 'left', 'right'
    },
    buttons: [
      { text: 'Back', secondary: true },
      { text: 'Next' },
    ],
  },
  // ... more steps
];
```

## Usage Example

To add a tour to a new page:

1. **Create tour steps file**:
```typescript
// src/sections/mypage/tour-steps.ts
import type { TourStep } from 'src/hooks/use-tour';

export const myPageTourSteps = (): TourStep[] => [
  {
    id: 'welcome',
    title: 'Welcome',
    text: 'Welcome to this page...',
  },
  // ... more steps
];
```

2. **Add tour to your component**:
```typescript
import { useTour, TourButton } from 'src/components/tour';
import { myPageTourSteps } from './tour-steps';

export function MyPage() {
  const { startTour } = useTour({
    steps: myPageTourSteps(),
    onComplete: () => console.log('Tour completed'),
  });

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4">My Page</Typography>
        <TourButton onStartTour={startTour} />
      </Box>
      {/* ... rest of your page */}
    </DashboardContent>
  );
}
```

3. **Add data-tour attributes to form elements**:
```typescript
<TextField
  label="Name"
  data-tour="my-field"
  // ... other props
/>
```

## Dependencies

- **shepherd.js** (v13.0.3+): The core guided tour library
- All Shepherd.js styles are imported and customized in `src/components/tour/styles.css`

## Browser Support

Tours work in all modern browsers that support:
- ES6+ JavaScript
- CSS Grid
- CSS Flexbox
- CSS Custom Properties (CSS Variables)

## Accessibility

- Tours use semantic HTML and ARIA attributes
- Keyboard navigation is supported (Escape to close, arrow keys to navigate)
- Focus management ensures screen readers can follow the tour
- Color contrast meets WCAG AA standards

## Future Enhancements

Potential improvements for the tour system:

1. **Tour Progress Tracking**: Store user's tour completion status
2. **Auto-trigger**: Automatically show tour for first-time users
3. **Multi-language Support**: Translate tour steps using i18n
4. **Video Tutorials**: Embed video content in tour steps
5. **Interactive Steps**: Allow users to interact with elements during the tour
6. **Tour Analytics**: Track which steps users skip or complete

## Testing

To test the tours:

1. Start the development server: `npm run dev`
2. Navigate to `/calendar-create` or `/shift-template-create`
3. Click the "Help" button in the page header
4. Follow the tour steps
5. Test skip, back, and next navigation
6. Verify element highlighting works correctly
7. Test on different screen sizes

## Troubleshooting

**Tour doesn't start**:
- Check browser console for errors
- Verify Shepherd.js is installed: `npm list shepherd.js`
- Ensure tour styles are imported in `src/global.css`

**Elements not highlighted**:
- Verify `data-tour` attributes are present on elements
- Check element selectors in tour steps match actual DOM elements
- Ensure elements are visible when tour step is shown

**Styling issues**:
- Check `src/components/tour/styles.css` for custom styles
- Verify theme colors are correctly applied
- Test in both light and dark modes

## License

This implementation uses Shepherd.js which is licensed under MIT.
