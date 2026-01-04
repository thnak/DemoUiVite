# Machine Mapping Feature - Component Structure

## Component Hierarchy

```
DefectReasonCreateEditView / StopMachineReasonCreateEditView
│
├── Form Fields (existing)
│   ├── Code
│   ├── Name
│   ├── Description
│   └── Other fields...
│
└── MachineMappingSection (NEW)
    │
    ├── Disabled State (Create Mode)
    │   └── Notification Card
    │
    └── Enabled State (Edit Mode)
        │
        ├── Left Column - Mapped Machines
        │   ├── Table Header
        │   │   ├── "Machine Name" column
        │   │   └── "Action" column
        │   │
        │   └── Table Body
        │       ├── Mapped Machine Row (repeat)
        │       │   ├── Machine Name
        │       │   └── Delete Button
        │       │
        │       └── Empty State (if no mappings)
        │
        └── Right Column - Add Machines
            ├── Filters Section
            │   ├── MachineTypeSelector
            │   └── MachineGroupSelector
            │
            ├── Search TextField
            │
            ├── Available Machines Table
            │   ├── Table Header
            │   │   ├── Select All Checkbox
            │   │   └── "Machine Name" column
            │   │
            │   └── Table Body
            │       ├── Machine Row (repeat)
            │       │   ├── Checkbox
            │       │   └── Machine Name
            │       │
            │       └── Empty State
            │
            └── Add Selected Button
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│           Defect Reason / Stop Machine Reason               │
│                    Edit Page                                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Props: entityId, disabled
                     ↓
┌─────────────────────────────────────────────────────────────┐
│              MachineMappingSection Component                │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌───────────────────────┐    ┌──────────────────────────┐ │
│  │  Mapped Machines      │    │  Available Machines      │ │
│  │  (Left Column)        │    │  (Right Column)          │ │
│  └───────┬───────────────┘    └──────────┬───────────────┘ │
│          │                               │                  │
│          │ GET /get-mappings             │ GET /get-avail  │
│          │ by-id/{id}                    │ able-machines   │
│          │                               │ + filters        │
│          ↓                               ↓                  │
│  ┌─────────────────────┐         ┌──────────────────────┐ │
│  │ Display mapped      │         │ Display available    │ │
│  │ machines with       │         │ machines with        │ │
│  │ remove button       │         │ checkboxes           │ │
│  └─────────┬───────────┘         └──────┬───────────────┘ │
│            │                             │                  │
│            │ DELETE /delete              │ POST /add       │
│            │ -mapping/{id}               │ -mapping        │
│            │                             │ + machineIds[]  │
│            ↓                             ↓                  │
│  ┌─────────────────────┐         ┌──────────────────────┐ │
│  │ Remove mapping      │         │ Add selected         │ │
│  │ → Refetch mappings  │         │ machines             │ │
│  │ → Show success msg  │         │ → Refetch mappings   │ │
│  └─────────────────────┘         │ → Show success msg   │ │
│                                   │ → Clear selection    │ │
│                                   └──────────────────────┘ │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## State Management Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    Parent Component State                     │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  currentDefectReason / id (from route params)                │
│         │                                                      │
│         ├─→ availableMachines (local state)                  │
│         │                                                      │
│         ├─→ mappedMachinesData (React Query)                 │
│         │   • Query Key: based on entityId                   │
│         │   • Auto-fetch: enabled when isEdit && entityId    │
│         │   • Refetch: after add/remove operations           │
│         │                                                      │
│         └─→ getAvailableMachinesMutate (React Query)         │
│             • Triggered by: filter changes                    │
│             • Updates: availableMachines state               │
│                                                                │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│              MachineMappingSection State                      │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  machineTypeId (filter) ─────┐                               │
│  machineGroupId (filter) ────┼─→ onSearchAvailable callback │
│                               │                                │
│  selectedMachineIds [] ───────┼─→ onAddMachines callback     │
│                               │                                │
│  searchText (local filter) ───┘                              │
│                                                                │
│  errorMessage / successMessage (notifications)                │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

## User Interaction Flow

```
1. User navigates to Edit page
   ↓
2. Page loads entity data
   ↓
3. MachineMappingSection receives entityId
   ↓
4. Component fetches mapped machines
   ↓
5. User selects Machine Type filter
   ↓
6. onSearchAvailable callback triggered
   ↓
7. Parent fetches available machines
   ↓
8. Available machines displayed in table
   ↓
9. User selects machines using checkboxes
   ↓
10. User clicks "Add Selected" button
    ↓
11. onAddMachines callback triggered
    ↓
12. API call to add mappings
    ↓
13. On success:
    • Show success notification
    • Refetch mapped machines
    • Clear selection
    • Reset filters
    ↓
14. User sees updated mapped machines list
```

## Error Handling Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    API Call Initiated                         │
└──────────────────┬───────────────────────────────────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
         ↓                   ↓
    ┌────────┐         ┌────────┐
    │Success │         │ Error  │
    └───┬────┘         └───┬────┘
        │                  │
        ↓                  ↓
  ┌───────────┐      ┌──────────────┐
  │ Update    │      │ Catch error  │
  │ state     │      │ in callback  │
  └─────┬─────┘      └──────┬───────┘
        │                   │
        ↓                   ↓
  ┌───────────┐      ┌──────────────┐
  │ Show      │      │ Set error    │
  │ success   │      │ message      │
  │ snackbar  │      │ state        │
  └───────────┘      └──────┬───────┘
                            │
                            ↓
                     ┌──────────────┐
                     │ Display      │
                     │ error        │
                     │ snackbar     │
                     └──────────────┘
```

## Key Design Decisions

1. **Reusable Component**
   - Single component for both Defect Reason and Stop Machine Reason
   - Props-based configuration
   - Parent handles API calls (separation of concerns)

2. **Disabled State in Create Mode**
   - Prevents confusion about unsaved entity
   - Clear notification message to user
   - Only enables after entity is created

3. **Two-Column Layout**
   - Left: Current state (mapped machines)
   - Right: Actions (add new machines)
   - Clear visual separation of concerns

4. **Filter-First Approach**
   - User must select filters before seeing available machines
   - Prevents loading all machines at once
   - Better performance for large datasets

5. **Multi-Select with Select-All**
   - Efficient for bulk operations
   - Standard UI pattern
   - Works with filtered results

6. **Automatic Refetch**
   - Ensures data consistency
   - No manual refresh needed
   - Immediate visual feedback

7. **Local Search Filtering**
   - Client-side filtering for better UX
   - No API calls for typing
   - Works on fetched results

8. **Promise-Based Callbacks**
   - Allows parent to handle success/error
   - Clean async flow
   - Easy to test

## Component Responsibilities

### MachineMappingSection (Presentational + Logic)
- ✅ Render UI elements
- ✅ Manage local state (selection, filters, search text)
- ✅ Handle user interactions
- ✅ Display loading/error states
- ✅ Show notifications
- ✅ Filter available machines by search text
- ❌ Make API calls directly (delegates to parent)
- ❌ Manage React Query state (delegates to parent)

### Parent Component (Container)
- ✅ Fetch entity data
- ✅ Make API calls via React Query hooks
- ✅ Manage mapped machines data (React Query)
- ✅ Manage available machines state
- ✅ Provide callbacks for component actions
- ✅ Handle API response transformation
- ❌ UI rendering (delegates to MachineMappingSection)
- ❌ User interaction handling (delegates to MachineMappingSection)
```
