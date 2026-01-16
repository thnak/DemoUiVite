# Stop Machine Reason Implementation Summary

## Overview
This implementation adds comprehensive CRUD functionality for Stop Machine Reasons and Stop Machine Reason Groups with proper API integration, tab-based filtering, and all required features.

## What Was Implemented

### 1. Stop Machine Reason Module

#### List Page (`/stop-machine-reason`)
- **Endpoint**: `/api/StopMachineReason/get-reason-page`
- **Features**:
  - Tab-based filtering by group (using `GroupCounts` from API response)
  - Search functionality
  - Pagination
  - Table with columns: Code, Name, Group, Impact, Description
  - Action menu for Edit/Delete

#### Create Page (`/stop-machine-reason/create`)
- **Endpoint**: `/api/stopmachinereason/create`
- **Features**:
  - Auto-generated code field
  - Basic information: Code, Name, Description
  - Group selector (uses `StopMachineReasonGroupSelector` component)
  - Color picker for visual identification
  - Boolean requirements:
    - Requires Approval
    - Requires Note
    - Requires Attachment
    - Requires Comment
  - Translation editor for multi-language support

#### Edit Page (`/stop-machine-reason/edit/:id`)
- **Endpoint**: `/api/stopmachinereason/update/{id}`
- Same features as Create page with pre-filled data

### 2. Stop Machine Reason Group Module

#### List Page (`/stop-machine-reason-group`)
- **Endpoint**: `/api/StopMachineReasonGroup/get-reason-group-page`
- **Features**:
  - Tab-based filtering by impact (using `TotalByImpact` from API response)
  - Impact tabs: All, Run, Unplanned Stop, Planned Stop, Not Scheduled
  - Search functionality
  - Pagination
  - Table with columns: Code, Name, Impact, Description
  - Action menu for Edit/Delete

#### Create Page (`/stop-machine-reason-group/create`)
- **Endpoint**: `/api/stopmachinereasongroup/create`
- **Features**:
  - Auto-generated code field
  - Basic information: Code, Name, Description
  - Impact selector dropdown (Run, Unplanned Stop, Planned Stop, Not Scheduled)
  - Color picker for visual identification
  - Translation editor for multi-language support

#### Edit Page (`/stop-machine-reason-group/edit/:id`)
- **Endpoint**: `/api/stopmachinereasongroup/update/{id}`
- Same features as Create page with pre-filled data

## Technical Implementation Details

### API Integration
- Uses generated API services from `/src/api/services/generated/`
- Uses generated React Query hooks from `/src/api/hooks/generated/`
- All endpoints properly mapped and typed

### UI Components
- **Tabs**: Material-UI Tabs component with count badges
- **Color Picker**: Reusable ColorPicker component from `src/components/color-utils`
- **Translation Editor**: Inline key-value editor with add/remove functionality
- **Group Selector**: Autocomplete selector with search capability
- **Impact Selector**: Material-UI Select with predefined options

### Data Types
- `StopMachineImpact`: `'run' | 'unPlanedStop' | 'planedStop' | 'notScheduled'`
- All entities include: `code`, `name`, `description`, `colorHex`, `translations`
- Stop Machine Reason includes: `groupId`, `requiresApproval`, `requiresNote`, `requiresAttachment`, `requiresComment`
- Stop Machine Reason Group includes: `impact`

## Routes Added

```
/stop-machine-reason                      - List page
/stop-machine-reason/create               - Create page
/stop-machine-reason/edit/:id             - Edit page

/stop-machine-reason-group                - List page
/stop-machine-reason-group/create         - Create page
/stop-machine-reason-group/edit/:id       - Edit page
```

## Files Created/Modified

### Stop Machine Reason
- `src/pages/stop-machine-reason-create.tsx` (new)
- `src/pages/stop-machine-reason-edit.tsx` (new)
- `src/sections/stop-machine-reason/view/stop-machine-reason-create-edit-view.tsx` (new)
- `src/sections/stop-machine-reason/view/stop-machine-reason-list-view.tsx` (modified)
- `src/sections/stop-machine-reason/stop-machine-reason-table-row.tsx` (modified)
- `src/sections/stop-machine-reason/stop-machine-reason-table-toolbar.tsx` (modified)
- `src/sections/stop-machine-reason/stop-machine-reason-utils.ts` (modified)

### Stop Machine Reason Group
- `src/pages/stop-machine-reason-group-list.tsx` (new)
- `src/pages/stop-machine-reason-group-create.tsx` (new)
- `src/pages/stop-machine-reason-group-edit.tsx` (new)
- `src/sections/stop-machine-reason-group/view/stop-machine-reason-group-list-view.tsx` (new)
- `src/sections/stop-machine-reason-group/view/stop-machine-reason-group-create-edit-view.tsx` (new)
- `src/sections/stop-machine-reason-group/stop-machine-reason-group-table-row.tsx` (new)
- `src/sections/stop-machine-reason-group/stop-machine-reason-group-table-toolbar.tsx` (new)
- `src/sections/stop-machine-reason-group/stop-machine-reason-group-table-head.tsx` (new)
- `src/sections/stop-machine-reason-group/stop-machine-reason-group-table-no-data.tsx` (new)
- `src/sections/stop-machine-reason-group/stop-machine-reason-group-table-empty-rows.tsx` (new)

### Routes
- `src/routes/sections.tsx` (modified)

## Testing Checklist

### Stop Machine Reason
- [ ] Navigate to `/stop-machine-reason` and verify list loads
- [ ] Verify tabs show correct group counts
- [ ] Click on different tabs and verify filtering works
- [ ] Search for a reason and verify results
- [ ] Click "Add reason" button and verify create page loads
- [ ] Fill out form and verify all fields work
- [ ] Test color picker
- [ ] Add translations (key-value pairs)
- [ ] Save and verify reason is created
- [ ] Edit an existing reason
- [ ] Verify all boolean checkboxes work
- [ ] Update and verify changes saved

### Stop Machine Reason Group
- [ ] Navigate to `/stop-machine-reason-group` and verify list loads
- [ ] Verify tabs show correct impact counts (All, Run, Unplanned Stop, etc.)
- [ ] Click on different tabs and verify filtering works
- [ ] Search for a group and verify results
- [ ] Click "Add group" button and verify create page loads
- [ ] Fill out form and verify all fields work
- [ ] Select impact from dropdown
- [ ] Test color picker
- [ ] Add translations
- [ ] Save and verify group is created
- [ ] Edit an existing group
- [ ] Update and verify changes saved

### Integration
- [ ] Verify Stop Machine Reason selector shows available groups
- [ ] Create a group, then use it when creating a reason
- [ ] Verify tab counts update after creating/deleting items
- [ ] Test pagination on both list pages
- [ ] Verify error handling and validation messages

## Known Issues
- Pre-existing TypeScript errors in `defect-input-view.tsx` and `shift-template-create-edit-view.tsx` (not related to this implementation)

## Next Steps
1. Manual testing using the checklist above
2. Connect to backend API and test with real data
3. Add delete functionality if needed
4. Add bulk operations if required
5. Consider adding export/import functionality
