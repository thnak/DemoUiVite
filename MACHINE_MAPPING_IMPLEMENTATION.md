# Machine Mapping Feature Implementation

## Overview
This document describes the implementation of machine mapping functionality for Defect Reasons and Stop Machine Reasons. The feature allows administrators to map machines to specific defect reasons or stop reasons, enabling better tracking and categorization.

## Implementation Summary

### Components Created

#### 1. MachineMappingSection Component
**Location:** `src/components/machine-mapping/machine-mapping-section.tsx`

A reusable React component that provides:
- Display of currently mapped machines with remove functionality
- Search and filter capabilities (by machine type and machine group)
- Multi-select table of available machines
- Select-all functionality
- Add selected machines to mapping
- Disabled state for create mode (only enabled in edit mode)

**Key Features:**
- Uses existing `MachineTypeSelector` and `MachineGroupSelector` components
- Implements real-time search filtering
- Shows loading states during API calls
- Error and success notifications via Snackbar
- Two-column layout: mapped machines (left) and available machines (right)
- Automatic refetch of mapped machines after add/remove operations

### Pages Updated

#### 2. Defect Reason Create/Edit View
**Location:** `src/sections/defect-reason/view/defect-reason-create-edit-view.tsx`

**Changes:**
- Added machine mapping section below the main form
- Integrated with defect reason API endpoints:
  - `GET /api/DefectReason/get-defect-mappings-by-defect-id/{defectId}` - Fetch mapped machines
  - `GET /api/DefectReason/get-available-machines-for-defect-reason/{defectReasonId}` - Search available machines
  - `POST /api/DefectReason/add-machine-defect-reason-mapping` - Add machine mappings
  - `DELETE /api/DefectReason/delete-machine-defect-reason-mapping/{mappingId}` - Remove mapping

**Implementation Details:**
```tsx
// State for available machines
const [availableMachines, setAvailableMachines] = useState<AvailableMachine[]>([]);

// Fetch mapped machines (only in edit mode)
const { data: mappedMachinesData, isLoading: isLoadingMapped, refetch: refetchMappedMachines } =
  useGetapiDefectReasongetdefectmappingsbydefectiddefectId(currentDefectReason?.id || '', {
    enabled: isEdit && !!currentDefectReason?.id,
  });

// Search available machines (mutation)
const { mutate: getAvailableMachinesMutate, isPending: isLoadingAvailable } =
  useGetapiDefectReasongetavailablemachinesfordefectreasondefectReasonId({
    onSuccess: (data) => {
      setAvailableMachines(
        data.map((machine) => ({
          machineId: String(machine.machineId),
          machineName: machine.machineName || '',
        }))
      );
    },
  });
```

#### 3. Stop Machine Reason Create/Edit View
**Location:** `src/sections/stop-machine-reason/view/stop-machine-reason-create-edit-view.tsx`

**Changes:**
- Added machine mapping section below translations card
- Integrated with stop machine reason API endpoints:
  - `GET /api/StopMachineReason/get-stop-reason-mappings-by-reason-id/{reasonId}` - Fetch mapped machines
  - `GET /api/StopMachineReason/get-available-machines-for-stop-reason/{stopReasonId}` - Search available machines
  - `POST /api/StopMachineReason/add-machine-stop-reason-mapping` - Add machine mappings
  - `DELETE /api/StopMachineReason/delete-stop-machine-reason-mapping/{mappingId}` - Remove mapping

**Implementation Details:**
Similar structure to Defect Reason implementation, using the corresponding Stop Machine Reason hooks.

## API Endpoints Used

### Defect Reason Endpoints
1. **Get Mapped Machines**
   - Endpoint: `GET /api/DefectReason/get-defect-mappings-by-defect-id/{defectId}`
   - Returns: Array of `GetDefectMappingFormDefectIdResult` with `mappingId` and `machineName`

2. **Get Available Machines**
   - Endpoint: `GET /api/DefectReason/get-available-machines-for-defect-reason/{defectReasonId}`
   - Request Body: `{ machineTypeId?: string, machineGroupId?: string }`
   - Returns: Array of `GetAvailableMachinesToMappingResult` with `machineId` and `machineName`

3. **Add Machine Mapping**
   - Endpoint: `POST /api/DefectReason/add-machine-defect-reason-mapping`
   - Request Body: `{ defectReasonId: string, machineIds: string[] }`
   - Returns: `BooleanResult`

4. **Remove Machine Mapping**
   - Endpoint: `DELETE /api/DefectReason/delete-machine-defect-reason-mapping/{mappingId}`
   - Returns: `BooleanResult`

### Stop Machine Reason Endpoints
1. **Get Mapped Machines**
   - Endpoint: `GET /api/StopMachineReason/get-stop-reason-mappings-by-reason-id/{reasonId}`

2. **Get Available Machines**
   - Endpoint: `GET /api/StopMachineReason/get-available-machines-for-stop-reason/{stopReasonId}`

3. **Add Machine Mapping**
   - Endpoint: `POST /api/StopMachineReason/add-machine-stop-reason-mapping`

4. **Remove Machine Mapping**
   - Endpoint: `DELETE /api/StopMachineReason/delete-stop-machine-reason-mapping/{mappingId}`

## User Flow

### Create Mode
1. User navigates to Create Defect Reason or Create Stop Machine Reason page
2. Machine mapping section is **disabled** with a notification message:
   > "Machine mapping will be available after creating the entity. Please save the form first."
3. User must first save the entity before machine mapping becomes available

### Edit Mode
1. User navigates to Edit Defect Reason or Edit Stop Machine Reason page
2. Machine mapping section is **enabled** and shows two columns:

**Left Column - Mapped Machines:**
- Lists all currently mapped machines
- Each row has a delete icon to remove the mapping
- Shows "No mapped machines yet" if empty

**Right Column - Add Machines:**
- Machine Type filter dropdown
- Machine Group filter dropdown
- Search text field for filtering results
- Table with checkboxes for multi-select
- "Select All" checkbox in header
- "Add Selected (n)" button to add machines

### Adding Machines
1. User selects Machine Type and/or Machine Group filter
2. Available machines are fetched and displayed in the table
3. User can search/filter by machine name using the search field
4. User selects one or more machines using checkboxes
5. User can use "Select All" to select all visible machines
6. User clicks "Add Selected (n)" button
7. Selected machines are added to the mapping
8. Success notification is shown
9. Mapped machines list is automatically refreshed
10. Selection is cleared and filters are reset

### Removing Machines
1. User clicks the delete icon next to a mapped machine
2. Machine mapping is removed
3. Success notification is shown
4. Mapped machines list is automatically refreshed

## Component Props

### MachineMappingSection

```typescript
interface MachineMappingSectionProps {
  disabled?: boolean;                    // Disable section (create mode)
  entityId?: string | null;              // Entity ID (defect reason or stop reason)
  mappedMachines: MappedMachine[];       // Currently mapped machines
  isLoadingMapped: boolean;              // Loading state for mapped machines
  availableMachines: AvailableMachine[]; // Available machines from search
  isLoadingAvailable: boolean;           // Loading state for available machines
  onSearchAvailable: (
    machineTypeId: string | null,
    machineGroupId: string | null
  ) => void;                             // Callback to search available machines
  onAddMachines: (machineIds: string[]) => Promise<void>;  // Add machines
  onRemoveMapping: (mappingId: string) => Promise<void>;   // Remove mapping
}
```

## Technical Implementation Details

### State Management
- Uses React Query hooks for API calls (already generated)
- Local state for available machines list
- Local state for selected machine IDs
- Local state for search filters (machine type, machine group, search text)

### Error Handling
- API errors are caught and displayed in Snackbar notifications
- Promise-based approach for add/remove operations allows parent components to handle errors
- Loading states prevent duplicate operations

### Performance Considerations
- Only fetches mapped machines when in edit mode (`enabled: isEdit && !!id`)
- Available machines are fetched on-demand when filters change
- Automatic cleanup of selected state after successful add operation
- Debounced search filtering for smooth UX

### Styling
- Uses MUI Grid system for responsive layout
- Follows existing application design patterns
- Uses theme colors and spacing
- Consistent with other form sections in the application

## Testing Checklist

- [x] Component compiles without TypeScript errors
- [x] Component follows linting rules
- [x] Build succeeds
- [ ] Create mode shows disabled state with notification
- [ ] Edit mode shows enabled state with full functionality
- [ ] Mapped machines table displays correctly
- [ ] Remove mapping works and shows confirmation
- [ ] Machine type filter works
- [ ] Machine group filter works
- [ ] Search text filtering works
- [ ] Multi-select checkboxes work
- [ ] Select-all checkbox works correctly
- [ ] Add selected machines works
- [ ] Success/error notifications appear correctly
- [ ] Automatic refetch after operations works
- [ ] Empty states display correctly
- [ ] Loading states display correctly

## Files Modified/Created

### Created:
- `src/components/machine-mapping/machine-mapping-section.tsx` - Main component
- `src/components/machine-mapping/index.ts` - Barrel export

### Modified:
- `src/sections/defect-reason/view/defect-reason-create-edit-view.tsx` - Added machine mapping integration
- `src/sections/stop-machine-reason/view/stop-machine-reason-create-edit-view.tsx` - Added machine mapping integration

## Dependencies

### Existing Components Used:
- `MachineTypeSelector` - For machine type filtering
- `MachineGroupSelector` - For machine group filtering
- `Iconify` - For icons
- MUI components: `Card`, `Grid`, `Table`, `Checkbox`, `Button`, `Snackbar`, etc.

### API Hooks Used:
All hooks are already generated from the OpenAPI specification:
- `useGetapiDefectReasongetdefectmappingsbydefectiddefectId`
- `useGetapiDefectReasongetavailablemachinesfordefectreasondefectReasonId`
- `useDeleteapiDefectReasondeletemachinedefectreasonmappingmappingId`
- `usePostapiDefectReasonaddmachinedefectreasonmapping`
- `useGetapiStopMachineReasongetstopreasonmappingsbyreasonidreasonId`
- `useGetapiStopMachineReasongetavailablemachinesforstopreasonstopReasonId`
- `useDeleteapiStopMachineReasondeletestopmachinereasonmappingmappingId`
- `usePostapiStopMachineReasonaddmachinestopreasonmapping`

## Future Enhancements

Possible improvements for the future:
1. Add pagination for mapped machines if the list becomes too long
2. Add bulk remove functionality for mapped machines
3. Add confirmation dialog before removing mappings
4. Add ability to edit machine mappings inline
5. Add export/import functionality for mappings
6. Add history/audit log for mapping changes
7. Add machine details preview in the available machines table

## Conclusion

The machine mapping feature is now fully implemented for both Defect Reasons and Stop Machine Reasons. The implementation:
- Follows the existing codebase patterns and standards
- Uses generated API services (no custom endpoints)
- Provides a clean, reusable component
- Handles all edge cases (create mode, empty states, loading states)
- Includes proper error handling and user feedback
- Is ready for testing and deployment
