# Tour Quick Reference

## Calendar Tour Steps

### Create/Edit Calendar Tour

| Step | Title | Element | Description |
|------|-------|---------|-------------|
| 1 | Welcome | - | Introduction to calendar creation/editing |
| 2 | Calendar Code | `[data-tour="calendar-code"]` | Unique identifier for the calendar |
| 3 | Calendar Name | `[data-tour="calendar-name"]` | Descriptive name for the calendar |
| 4 | Shift Template | `[data-tour="calendar-shift-template"]` | Select associated shift template |
| 5 | Application Period | `[data-tour="calendar-dates"]` | Define start and end dates |
| 6 | Plan to Infinite | `[data-tour="calendar-infinite"]` | Enable indefinite planning |
| 7 | Work Date Configuration | `[data-tour="calendar-work-time"]` | Set work start time and timezone offset |
| 8 | Description | `[data-tour="calendar-description"]` | Optional description field |
| 9 | Save Your Calendar | `[data-tour="calendar-actions"]` | Save or cancel changes |

**Total Steps**: 9  
**Pages**: `/calendar-create`, `/calendar-edit/:id`

---

## Shift Template Tour Steps

### Create/Edit Shift Template Tour

| Step | Title | Element | Description |
|------|-------|---------|-------------|
| 1 | Welcome | - | Introduction to shift template creation/editing |
| 2 | Template Code | `[data-tour="shift-code"]` | Unique identifier for the template |
| 3 | Template Name | `[data-tour="shift-name"]` | Descriptive name for the template |
| 4 | Description | `[data-tour="shift-description"]` | Optional description field |
| 5 | Editor Mode | `[data-tour="shift-editor-mode"]` | Toggle between Normal and Advanced modes |
| 6 | Shift Definitions | `[data-tour="shift-definitions"]` | Create and manage shift schedules |
| 7 | Shift Times | `[data-tour="shift-times"]` | Set start and end times (24-hour format) |
| 8 | Applicable Days | `[data-tour="shift-days"]` | Select days of the week |
| 9 | Break Management | `[data-tour="shift-breaks"]` | Add and configure breaks |
| 10 | Week Summary | `[data-tour="shift-summary"]` | Visual chart of weekly hours |
| 11 | Save Your Template | `[data-tour="shift-actions"]` | Save or cancel changes |

**Total Steps**: 11  
**Pages**: `/shift-template-create`, `/shift-template-edit/:id`

---

## Tour Controls

### Navigation Buttons

- **Skip**: Cancel the tour at any time (available on welcome step)
- **Back**: Go to the previous step
- **Next**: Proceed to the next step
- **Finish**: Complete the tour (available on last step)

### Keyboard Shortcuts

- **Escape**: Close/cancel the tour
- **Enter**: Proceed to next step (when button is focused)

---

## Tour Features

### Visual Effects

- **Modal Overlay**: Dims the page background
- **Element Highlighting**: Highlights the current element with border and padding
- **Tooltip Positioning**: Automatically positions tooltip (top/bottom/left/right)
- **Smooth Scrolling**: Scrolls highlighted element into view

### Responsive Design

- **Desktop**: Full-width tooltips with side positioning
- **Tablet**: Adjusted tooltip width
- **Mobile**: Stack tooltips above/below elements

### Theme Support

- **Light Mode**: White tooltips with dark text
- **Dark Mode**: Dark tooltips with light text
- **Auto-detection**: Follows system theme preferences

---

## Implementation Summary

### Files Created

```
src/
├── components/
│   └── tour/
│       ├── index.ts              # Export file
│       ├── styles.css            # Custom Shepherd.js styles
│       └── tour-button.tsx       # Tour trigger button
├── hooks/
│   └── use-tour.ts               # Tour management hook
└── sections/
    ├── calendar/
    │   └── tour-steps.ts         # Calendar tour definitions
    └── shift-template/
        └── tour-steps.ts         # Shift template tour definitions
```

### Files Modified

```
src/
├── global.css                                        # Added tour styles import
├── components/ShiftTemplateForm.tsx                  # Added data-tour attributes
└── sections/
    ├── calendar/view/calendar-create-edit-view.tsx   # Added tour integration
    └── shift-template/view/
        └── shift-template-create-edit-view.tsx       # Added tour integration
```

### Dependencies Added

- `shepherd.js` v13.0.3 - Core guided tour library

---

## Code Examples

### Basic Tour Usage

```typescript
import { useTour, TourButton } from 'src/components/tour';
import { myTourSteps } from './tour-steps';

function MyComponent() {
  const { startTour } = useTour({
    steps: myTourSteps(),
    onComplete: () => console.log('Tour completed!'),
    onCancel: () => console.log('Tour cancelled'),
  });

  return (
    <Box>
      <TourButton onStartTour={startTour} />
      {/* Your content */}
    </Box>
  );
}
```

### Defining Tour Steps

```typescript
import type { TourStep } from 'src/hooks/use-tour';

export const myTourSteps = (): TourStep[] => [
  {
    id: 'welcome',
    title: 'Welcome',
    text: 'This tour will guide you through...',
    buttons: [
      { text: 'Skip', secondary: true },
      { text: 'Start Tour' },
    ],
  },
  {
    id: 'field-1',
    title: 'First Field',
    text: 'This is the first field description.',
    attachTo: {
      element: '[data-tour="field-1"]',
      on: 'bottom',
    },
  },
  // ... more steps
];
```

### Adding Data Attributes

```typescript
<TextField
  label="Field Name"
  data-tour="field-1"  // Selector for tour
  // ... other props
/>
```

---

## Testing Checklist

- [ ] Tour appears when clicking Help button
- [ ] All steps are shown in correct order
- [ ] Elements are highlighted correctly
- [ ] Navigation buttons work (Skip, Back, Next, Finish)
- [ ] Tour can be cancelled with Escape key
- [ ] Tour completes successfully on last step
- [ ] Responsive design works on mobile/tablet
- [ ] Light and dark modes render correctly
- [ ] No console errors during tour
- [ ] Tour works on both create and edit pages

---

## Maintenance

### Adding New Steps

1. Add `data-tour` attribute to target element
2. Add step definition to tour steps file
3. Test the tour flow
4. Update documentation

### Modifying Existing Steps

1. Update step definition in tour steps file
2. Update `data-tour` attribute if element changed
3. Test the modified tour
4. Update documentation if needed

### Removing Steps

1. Remove step definition from tour steps file
2. Remove `data-tour` attribute from element
3. Test remaining tour flow
4. Update documentation
