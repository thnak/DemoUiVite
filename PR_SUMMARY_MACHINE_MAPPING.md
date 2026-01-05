# Pull Request: Add Machine Mapping Feature for Defect Reasons and Stop Machine Reasons

## Summary
This PR implements machine mapping functionality for Defect Reasons and Stop Machine Reasons pages, allowing administrators to map specific machines to defect reasons or stop reasons for better tracking and categorization.

## Changes Overview

### New Components
- **MachineMappingSection** (`src/components/machine-mapping/`)
  - Reusable component for managing machine mappings
  - Features:
    - Two-column layout (mapped machines / available machines)
    - Machine Type and Machine Group filters
    - Search functionality
    - Multi-select with Select-All support
    - Add/Remove operations with confirmations
    - Disabled state for create mode
    - Loading and error states
    - Success/error notifications via Snackbar

### Updated Pages

#### 1. Defect Reason Create/Edit Page
**File:** `src/sections/defect-reason/view/defect-reason-create-edit-view.tsx`
- Added machine mapping section below the main form
- Integrated with defect reason mapping endpoints
- Section disabled in create mode, enabled in edit mode

#### 2. Stop Machine Reason Create/Edit Page
**File:** `src/sections/stop-machine-reason/view/stop-machine-reason-create-edit-view.tsx`
- Added machine mapping section below translations card
- Integrated with stop machine reason mapping endpoints
- Section disabled in create mode, enabled in edit mode

## API Endpoints Used

### Defect Reason Endpoints
- `GET /api/DefectReason/get-defect-mappings-by-defect-id/{defectId}` - Fetch mapped machines
- `GET /api/DefectReason/get-available-machines-for-defect-reason/{defectReasonId}` - Get available machines with filters
- `POST /api/DefectReason/add-machine-defect-reason-mapping` - Add machine mappings
- `DELETE /api/DefectReason/delete-machine-defect-reason-mapping/{mappingId}` - Remove mapping

### Stop Machine Reason Endpoints
- `GET /api/StopMachineReason/get-stop-reason-mappings-by-reason-id/{reasonId}` - Fetch mapped machines
- `GET /api/StopMachineReason/get-available-machines-for-stop-reason/{stopReasonId}` - Get available machines with filters
- `POST /api/StopMachineReason/add-machine-stop-reason-mapping` - Add machine mappings
- `DELETE /api/StopMachineReason/delete-stop-machine-reason-mapping/{mappingId}` - Remove mapping

## Technical Details

### Technologies & Patterns Used
- React functional components with hooks
- React Query for data fetching and caching
- MUI components for UI
- TypeScript for type safety
- Existing generated API hooks (no custom endpoints)

### Key Features
1. **Create Mode Protection**: Mapping section is disabled until entity is created
2. **Filter-First Approach**: Users select filters before viewing available machines
3. **Multi-Select**: Efficient bulk operations with select-all support
4. **Auto-Refresh**: Mapped machines automatically refetch after add/remove
5. **Error Handling**: Comprehensive error handling with user-friendly messages
6. **Loading States**: Visual feedback during async operations
7. **Search Filtering**: Client-side search for better UX

### Code Quality
✅ TypeScript compilation passes (0 errors)
✅ ESLint passes (0 errors, warnings in unrelated files only)
✅ Follows project coding standards
✅ Uses existing component library (MachineTypeSelector, MachineGroupSelector)
✅ Reusable component architecture
✅ Proper separation of concerns

## Documentation

### New Documentation Files
1. **MACHINE_MAPPING_IMPLEMENTATION.md**
   - Comprehensive implementation guide
   - API endpoint documentation
   - User flow documentation
   - Component props and interfaces
   - Testing checklist

2. **MACHINE_MAPPING_ARCHITECTURE.md**
   - Component hierarchy diagrams
   - Data flow diagrams
   - State management flow
   - User interaction flow
   - Error handling flow
   - Design decisions and responsibilities

## Testing

### Automated Testing
- ✅ TypeScript compilation
- ✅ Linting rules
- ✅ Build process

### Manual Testing Required
The following scenarios need manual testing with the actual API:

#### Defect Reason Mapping
- [ ] Create mode: Section shows as disabled with notification
- [ ] Edit mode: All functionality works
- [ ] Filter by machine type
- [ ] Filter by machine group
- [ ] Search machines by name
- [ ] Select individual machines
- [ ] Select all machines
- [ ] Add selected machines
- [ ] Remove mapped machines
- [ ] Empty states display correctly
- [ ] Loading states display correctly
- [ ] Error messages display correctly
- [ ] Success messages display correctly

#### Stop Machine Reason Mapping
- [ ] Same test cases as Defect Reason Mapping

## Screenshots
_Note: Screenshots will be added after manual testing with live API backend_

## Breaking Changes
None. This is a new feature addition that doesn't modify existing functionality.

## Migration Guide
Not applicable. No migration needed.

## Deployment Notes
- Ensure API endpoints are available and working
- No database migrations required (assuming backend is already implemented)
- No configuration changes needed

## Performance Considerations
- Mapped machines only fetched when in edit mode
- Available machines fetched on-demand based on filters
- Client-side search filtering for smooth UX
- React Query caching reduces redundant API calls

## Security Considerations
- Uses existing authentication/authorization from API hooks
- No sensitive data stored in component state
- All API calls go through generated hooks with proper error handling

## Future Enhancements
Possible future improvements:
1. Pagination for mapped machines (if lists become very long)
2. Bulk remove functionality
3. Confirmation dialogs before removing mappings
4. Export/Import functionality for mappings
5. Audit log for mapping changes
6. Machine details preview

## Dependencies
No new external dependencies added. Uses existing:
- React 19
- MUI 7
- React Query
- Existing component library

## Checklist
- [x] Code follows project style guidelines
- [x] TypeScript compiles without errors
- [x] Linting passes
- [x] Build succeeds
- [x] Documentation added
- [x] No breaking changes
- [ ] Manual testing completed (requires live API)
- [ ] Screenshots added (requires manual testing)

## Related Issues
Closes: _[Link to issue if applicable]_

## Reviewers
@thnak

---

## How to Test

1. **Start the application**: `npm run dev`
2. **Navigate to Defect Reasons**: `/defect-reasons`
3. **Test Create Mode**:
   - Click "New defect reason"
   - Scroll down to see the machine mapping section
   - Verify it shows as disabled with notification message
4. **Test Edit Mode**:
   - Click "Edit" on an existing defect reason
   - Scroll down to the machine mapping section
   - Verify it's enabled
   - Test all filtering, selection, and add/remove operations
5. **Repeat for Stop Machine Reasons**: `/stop-machine-reason`

## Support
For questions or issues, please contact the development team or create an issue in the repository.
