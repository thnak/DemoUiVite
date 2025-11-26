# Shift Templates Guide

This guide explains how to use the Shift Template management UI to create and manage work shift schedules.

## Overview

Shift Templates allow you to define recurring work schedules for your organization. Each template can include:

- Multiple shift definitions (e.g., morning, afternoon, night shifts)
- Configurable work days (5-day or 7-day week)
- Break times within each shift
- Support for 2 or 3 shifts per day patterns

## Getting Started

### Navigate to Shift Templates

Access the Shift Templates page at `/shift-templates` from the dashboard.

### Creating a New Template

1. Click **"Add Template"** button
2. Fill in the basic information:
   - **Code**: A unique identifier (e.g., "ST-001")
   - **Name**: Descriptive name (e.g., "Standard Factory Schedule")
   - **Description**: Optional notes about the template
   - **Week Type**: Choose 5-day or 7-day week
   - **Shift Pattern**: Choose 2 or 3 shifts per day

3. Define your shifts using Normal or Advanced mode
4. Review the weekly summary chart
5. Click **"Create Template"** to save

## Normal vs Advanced Mode

### Normal Mode

Normal mode provides a simple interface for defining shifts:

- Add multiple shift definitions
- Set start/end times for each shift
- Select which days each shift applies to
- Add breaks within each shift

This mode is ideal when most shifts follow the same pattern across multiple days.

### Advanced Mode

Advanced mode adds a visual grid showing:

- All shifts across all days of the week
- Click cells to toggle shifts on/off for specific days
- Better visibility for complex schedules

Use Advanced mode when:
- Different days have different shift patterns
- You need to quickly visualize the entire week
- Making fine-grained adjustments to specific days

## Working with Shift Definitions

### Adding a Shift

1. Click **"Add Shift"** in the Shift Definitions section
2. Enter the shift name (e.g., "Morning Shift")
3. Set the start and end times
4. Select which days this shift applies to

### Adding Breaks

Within each shift definition:

1. Click **"Add Break"** button
2. Enter break name (e.g., "Lunch Break")
3. Set break start and end times
4. Add multiple breaks as needed

### Example: Standard 3-Shift Factory Schedule

```
Shift 1 (Morning):   06:00 - 14:00, Mon-Fri
  - Break: 10:00 - 10:15 (Tea Break)
  - Break: 12:00 - 12:30 (Lunch)

Shift 2 (Afternoon): 14:00 - 22:00, Mon-Fri
  - Break: 18:00 - 18:30 (Dinner)

Shift 3 (Night):     22:00 - 06:00, Mon-Thu
  - Break: 02:00 - 02:30 (Midnight Break)
```

## Weekly Summary Chart

The chart at the bottom of the form displays:

- **Work Hours**: Net working hours per day (shift duration minus breaks)
- **Break Hours**: Total break time per day
- **Weekly Totals**: Aggregate hours for the entire week

Use this chart to verify your schedule before saving.

## Managing Templates

### Editing a Template

1. From the list view, click the **edit icon** on any template
2. Make your changes
3. Click **"Save Changes"**

### Deleting Templates

**Single Delete:**
- Click the **delete icon** on any template row

**Bulk Delete:**
1. Select multiple templates using checkboxes
2. Click **"Delete Selected"** button

## Data Storage

> **Note:** This demo implementation uses browser localStorage for data persistence. In a production environment, you should replace the `shiftTemplateService` with API calls to your backend.

### Integrating with Backend

Replace the localStorage calls in `src/services/shiftTemplateService.ts` with your API endpoints:

```typescript
// Example API integration
export const shiftTemplateService = {
  async getAll(): Promise<ShiftTemplate[]> {
    const response = await api.get('/shift-templates');
    return response.data;
  },

  async create(data: ShiftTemplateFormData): Promise<ShiftTemplate> {
    const response = await api.post('/shift-templates', data);
    return response.data;
  },

  // ... other methods
};
```

## Types Reference

### ShiftTemplate

```typescript
interface ShiftTemplate {
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
```

### ShiftDefinition

```typescript
interface ShiftDefinition {
  id: string;
  name: string;
  startTime: string; // HH:mm format
  endTime: string;   // HH:mm format
  breaks: ShiftBreak[];
  days: DayOfWeek[];
}
```

### ShiftBreak

```typescript
interface ShiftBreak {
  id: string;
  startTime: string; // HH:mm format
  endTime: string;   // HH:mm format
  name?: string;
}
```

## Related Documentation

- [Quickstart Guide](./quickstart.md)
- [i18n Documentation](./i18n.md)
- [API Usage](./api-usage.md)
