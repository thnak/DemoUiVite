# Working Parameter Refactor Implementation

## Overview

This document describes the refactor of the working parameter list and create/edit pages to follow a product-centric approach for managing working parameters at scale.

## Changes Made

### 1. Working Parameter List Page

**File:** `src/sections/working-parameter/view/working-parameter-list-view.tsx`

#### API Changes
- **Old API:** `getWorkingParameterPage` - retrieved basic working parameter entities
- **New API:** `postapiWorkingParametercreatedworkingparameters` - retrieves enriched working parameter data with product and machine names

#### Key Improvements
- **Server-side pagination:** Data is now fetched from the server with proper pagination support
- **Search functionality:** Supports searching across working parameters
- **Filter support:** Prepared for filtering by:
  - Machine types
  - Machine groups
  - Product categories
- **Better data display:** Shows product and machine names directly (no need for separate lookups)

#### Data Structure
The list now uses `GetCreatedWorkingParaResult` which includes:
```typescript
{
  workingParameterId: ObjectId;
  productName: string;
  machineName: string;
  idealCycleTime: string;  // ISO 8601 duration
  downtimeThreshold: string;  // ISO 8601 duration
  speedLossThreshold: string;  // ISO 8601 duration
  quantityPerCycle: number;
}
```

### 2. Working Parameter Create Page (Product-Centric)

**File:** `src/sections/working-parameter/view/working-parameter-create-view.tsx`

#### New Workflow
This is a completely new approach that allows managing multiple working parameters at once:

1. **Select Product** - Choose a product to configure
2. **Set Working Parameters** - Define common settings:
   - Ideal Cycle Time
   - Downtime Threshold
   - Speed Loss Threshold
   - Quantity Per Cycle
3. **Select Machines** - View and select from mapped machines using a searchable table
4. **Bulk Create** - Create working parameters for all selected machines with one click
5. **View Created Parameters** - See all existing working parameters for the selected product

#### API Endpoints Used
- `GET /api/Product/{productId}/mapped-machines` - Fetches machines mapped to the product
- `POST /api/WorkingParameter/{productId}/create-up-from-mapped-products` - Bulk creates/updates working parameters
- `POST /api/WorkingParameter/created-working-parameters` - Fetches existing working parameters for display
- `DELETE /api/workingparameter/delete/{id}` - Removes individual working parameters

#### Features
- **Product-first approach:** Start by selecting a product, then configure its machines
- **Batch operations:** Create working parameters for multiple machines simultaneously
- **Real-time search:** Filter available machines as you type
- **Checkbox selection:** Select all or individual machines
- **Immediate feedback:** See created parameters in a table at the bottom
- **Delete capability:** Remove working parameters directly from the table

### 3. Working Parameter Edit Page (Simplified)

**File:** `src/sections/working-parameter/view/working-parameter-edit-view.tsx`

The edit page has been simplified to handle individual working parameter updates:

#### Features
- **Single parameter editing:** Edit one working parameter at a time
- **Locked machine/product:** Cannot change the machine or product (disabled fields)
- **Update time thresholds:** Modify cycle time, downtime threshold, speed loss threshold
- **Update quantity:** Change quantity per cycle

#### Use Case
This page is for fine-tuning individual working parameters after bulk creation. The main workflow should use the create page for managing multiple parameters.

## API Integration

### Key Endpoints

1. **List Working Parameters**
   ```typescript
   POST /api/WorkingParameter/created-working-parameters
   {
     pageNumber: number;
     pageSize: number;
     search: string | null;
     machineTypes: ObjectId[] | null;
     machineGroups: ObjectId[] | null;
     productCategories: ObjectId[] | null;
   }
   ```

2. **Get Mapped Machines**
   ```typescript
   GET /api/Product/{productId}/mapped-machines?search=string
   Returns: GetMappedMachineByProductIdResult[]
   ```

3. **Bulk Create Working Parameters**
   ```typescript
   POST /api/WorkingParameter/{productId}/create-up-from-mapped-products
   {
     machineIds: ObjectId[];
     idealCycleTime: string;  // ISO 8601
     downtimeThreshold: string;  // ISO 8601
     speedLossThreshold: string;  // ISO 8601
     quantityPerCycle: number;
   }
   ```

## User Experience Flow

### Creating Working Parameters (New Way)

1. Navigate to `/working-parameter/create`
2. Select a product from the dropdown
3. Set the working parameter values (durations and quantity)
4. Search for machines in the table (if needed)
5. Select one or more machines using checkboxes
6. Click "Create Parameters" button
7. Review created parameters in the bottom table
8. Delete any incorrect parameters if needed
9. Repeat steps 4-6 to add more machines
10. Click "Cancel" when done to return to the list

### Editing Working Parameters

1. Navigate to the list page
2. Click edit on a specific working parameter
3. Modify the time thresholds or quantity
4. Click "Save changes"

## Benefits

1. **Efficiency:** Create working parameters for multiple machines at once
2. **Consistency:** Apply the same settings to multiple machines easily
3. **Product-centric:** Aligns with how users think about production (by product)
4. **Better UX:** Search, filter, and manage large numbers of working parameters
5. **Scalability:** Handles "tons of data" as mentioned in requirements

## Technical Notes

- All time durations use ISO 8601 format (e.g., `PT30S` for 30 seconds)
- The create page can be used multiple times for the same product
- Existing parameters are updated if they already exist (create-or-update behavior)
- Server-side pagination reduces client-side processing
- The edit page maintains backward compatibility for individual updates

## Testing Checklist

- [ ] List page loads with pagination
- [ ] Search functionality works on list page
- [ ] Can navigate to create page
- [ ] Product selector works on create page
- [ ] Working parameter fields accept ISO 8601 durations
- [ ] Mapped machines table loads when product is selected
- [ ] Search filters machines in the machine selection table
- [ ] Checkbox selection works (all/individual)
- [ ] Bulk creation succeeds and shows feedback
- [ ] Created parameters appear in the bottom table
- [ ] Delete functionality removes parameters
- [ ] Edit page loads with existing parameter data
- [ ] Edit page saves changes correctly
- [ ] Machine/product fields are disabled on edit page

## Migration Notes

- No database migration needed (uses existing endpoints)
- Old individual create functionality is replaced by bulk create
- Edit functionality remains for fine-tuning
- No breaking changes to existing working parameters

## Future Enhancements

- Add filter UI for machine types, machine groups, and product categories on list page
- Add export functionality for working parameters
- Add import functionality for bulk creation from CSV/Excel
- Add parameter templates for common configurations
- Add validation rules for reasonable time thresholds
- Add bulk edit functionality
- Add audit log for parameter changes
