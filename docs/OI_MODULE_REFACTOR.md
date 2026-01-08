# OI Module Refactor - Implementation Documentation

## Overview

This document describes the implementation of the simplified OI (Operator Interface) module design. The refactor consolidates the operator interface into two main screens:

1. **Machine Selection Screen** - Browse and select machines to operate
2. **Machine Operation Screen** - Comprehensive operation dashboard for the selected machine

## Architecture

### Component Structure

```
src/
├── sections/oi/
│   ├── context/
│   │   └── machine-selector-context.tsx      # Manages selected machine state
│   ├── machine-selection/
│   │   └── view/
│   │       ├── machine-selection-view.tsx    # Machine browsing interface
│   │       └── index.ts
│   ├── machine-operation/
│   │   └── view/
│   │       ├── machine-operation-view.tsx    # Operation dashboard
│   │       └── index.ts
│   └── components/
│       └── machine-selector-card.tsx         # (existing) Legacy component
├── pages/oi/
│   ├── machine-selection.tsx                 # Page wrapper for selection view
│   └── machine-operation.tsx                 # Page wrapper for operation view
└── utils/
    └── jwt.ts                                # JWT decoding and role checking
```

### Routing Configuration

**Routes:**
- `/oi/select-machine` - Machine selection screen (entry point for operators)
- `/oi/operation` - Machine operation screen (requires selected machine)
- `/oi/dashboard` - Legacy operator dashboard (kept for backward compatibility)
- `/oi/change-product` - Legacy change product page
- `/oi/defect-input` - Legacy defect input page
- `/oi/downtime-input` - Legacy downtime input page

**Role-based Redirect:**
When a user with the "Operator" role accesses the home page (`/`), they are automatically redirected to `/oi/select-machine`.

## Screen 1: Machine Selection

### Features

1. **Search Input** - Real-time search for machines by name or code
2. **Area Filter** - Multi-select dropdown to filter machines by area
3. **Machine Cards** - Horizontal scrolling grid of machine cards
4. **Machine Card Details:**
   - Sequential number badge
   - Machine image (with fallback icon)
   - Machine code/name
   - Area name

### Implementation Details

**API Integration:**
```typescript
// Search machines with pagination
const response = await postapiMachinesearchmachines(
  [], // Sort array
  {
    searchTerm: 'search text',
    pageNumber: 1,
    pageSize: 100,
  }
);

// Get areas for filter
const areas = await searchArea({ maxResults: 100 });
```

**Image Loading:**
```typescript
// Machine image URL
const imageUrl = `${apiConfig.baseUrl}/api/Machine/${machine.id}/image`;
```

**State Management:**
- Search term: Component-local state
- Selected areas: Component-local state
- Machine list: Component-local state
- Selected machine: Shared context + localStorage

### User Flow

1. User lands on `/oi/select-machine`
2. (Optional) User enters search term or selects areas to filter
3. Machines are displayed as horizontal scrolling cards
4. User clicks a machine card
5. Selected machine is saved to context and localStorage
6. User is navigated to `/oi/operation`

## Screen 2: Machine Operation

### Features

#### Header Section
- **Back Button** - Returns to machine selection
- **Machine Name** - Currently selected machine
- **Action Buttons:**
  - Đổi mã hàng (Change Product)
  - Thêm sản phẩm (Add Product)
  - Nhập lỗi (Input Defect)
  - Lý do dừng máy (Machine Stop Reason)

#### Status Section (Top Right)
- **Test/Run Switch** - Toggle between test and production modes
- **Current Time** - Real-time clock
- **Machine Status Chip** - Running/Stopped/Testing status

#### Timeline Container
- **View Switcher** - Current/Shift/Day buttons
- **Timeline Visualization** - (Placeholder for run/stop blocks)
- **Alert Message** - Shows count of unlabeled unplanned stops

#### Metrics Section (Bottom Left)
- **OEE Percentage** - Overall Equipment Effectiveness
- **APQ Formula** - Availability × Performance × Quality
- **Downtime Stats** - Hours and count
- **Test Stats** - Hours and count

#### Production Info Section (Bottom Right)
- **Estimated Completion Time**
- **Production Order Number**
- **Product Code**
- **Quantity Stats** - Total/Pass/Fail
- **Progress Percentage**
- **Cycle Times** - Ideal vs Actual
- **Operator Information**

### Implementation Details

**Real-time Data Integration:**
```typescript
// Subscribe to machine updates via SignalR
await hubService.subscribeToMachine(
  machineId,
  handleMachineUpdate
);

// Get initial aggregation
const aggregation = await hubService.getMachineAggregation(machineId);
```

**Machine Status Logic:**
```typescript
const getMachineStatus = (machineData: MachineOeeUpdate | null): MachineStatus => {
  // Simplified - should be based on actual machine state
  if (!machineData) {
    return { status: 'unplanstop', label: 'Dừng không kế hoạch', color: 'error' };
  }
  return { status: 'running', label: 'Đang chạy', color: 'success' };
};
```

### User Flow

1. User arrives from machine selection (or directly with machine in localStorage)
2. System connects to MachineHub SignalR for real-time updates
3. Initial machine data is loaded and displayed
4. Data updates are received and displayed in real-time
5. User can:
   - Switch between timeline views (Current/Shift/Day)
   - Toggle test/run mode
   - Click action buttons (to be implemented)
   - Click back button to return to machine selection

## Core Utilities

### JWT Utility (`src/utils/jwt.ts`)

**Purpose:** Decode JWT tokens and extract user information without verification.

**Key Functions:**

```typescript
// Decode JWT token
const payload = decodeJwt(token);

// Extract user roles
const roles = getUserRolesFromToken(token);

// Check for specific role
const isOp = hasRole(token, 'Operator');

// Check if token is expired
const expired = isTokenExpired(token);

// Convenience function for Operator check
const isOperator = isOperator();
```

**Security Note:** This utility only decodes tokens, it does NOT verify signatures. Token verification should be done on the backend.

### Machine Selector Context

**Purpose:** Manage shared state for the selected machine across OI module.

**Features:**
- Stores selected machine in React context
- Persists selection to localStorage
- Restores selection from localStorage on mount
- Provides hooks for accessing and updating selection

**Usage:**
```typescript
// In a component
const { selectedMachine, setSelectedMachine } = useMachineSelector();

// Select a machine
setSelectedMachine(machine);

// Clear selection
setSelectedMachine(null);
```

**localStorage Key:** `oi-selected-machine`

## API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/Machine/search-machines` | POST | Search machines with filters |
| `/api/Area/search` | GET | Get areas for filter dropdown |
| `/api/Machine/{id}/image` | GET | Load machine image |
| `/api/Machine/{id}/available-products` | GET | Get available products (future) |
| `/api/Machine/{id}/current-product` | GET | Get current product info (future) |
| MachineHub (SignalR) | WebSocket | Real-time machine data updates |

## Translation Keys

### Common
- `common.unknown` - "Unknown" / "Không xác định"
- `common.cancel` - "Cancel" / "Hủy"
- `common.confirm` - "Confirm" / "Xác nhận"

### OI Module (Existing)
- `oi.selectedMachine` - "Selected Machine" / "Máy đã chọn"
- `oi.noMachineSelected` - "No machine selected" / "Chưa chọn máy"
- `oi.selectMachine` - "Select Machine" / "Chọn máy"
- `oi.changeMachine` - "Change Machine" / "Đổi máy"
- `oi.searchMachine` - "Search machine..." / "Tìm máy..."

## Testing Checklist

- [ ] **Role-based Redirect**
  - [ ] Operator role redirects to `/oi/select-machine` from `/`
  - [ ] Non-operator roles stay on home page

- [ ] **Machine Selection**
  - [ ] Search filter works correctly
  - [ ] Area multi-select filter works correctly
  - [ ] Machine cards display correctly with images
  - [ ] Clicking a card navigates to operation screen
  - [ ] Selected machine persists to localStorage

- [ ] **Machine Operation**
  - [ ] Back button returns to selection screen
  - [ ] Machine data loads from SignalR hub
  - [ ] Real-time updates display correctly
  - [ ] Timeline view switcher works
  - [ ] Test/run switch state persists
  - [ ] All metrics display correctly

- [ ] **localStorage Persistence**
  - [ ] Refresh page maintains selected machine
  - [ ] Clear localStorage removes selection
  - [ ] Invalid JSON in storage doesn't crash app

- [ ] **Responsive Design**
  - [ ] Works on mobile (< 768px)
  - [ ] Works on tablet (768px - 1024px)
  - [ ] Works on desktop (> 1024px)
  - [ ] Horizontal scroll works on small screens

## Known Issues & Future Work

### Known Issues
1. **SignalR Generated Code** - Pre-existing TypeScript errors in `use-signal-r-hubs-documentation.ts` (not related to this PR)
2. **Timeline Component** - Currently a placeholder, needs full implementation
3. **Action Buttons** - Not yet connected to workflows (change product, add product, etc.)

### Future Enhancements
1. **Timeline Visualization**
   - Interactive timeline with color-coded blocks
   - Click on downtime blocks to label stop reasons
   - Drag to zoom timeline
   - Show detailed tooltips on hover

2. **Action Button Workflows**
   - Connect "Change Product" to product selection modal
   - Connect "Add Product" to quantity input dialog
   - Connect "Input Defect" to defect reason selection
   - Connect "Stop Reason" to stop reason labeling

3. **Enhanced Metrics**
   - Live countdown to completion time
   - Trend charts for OEE/availability/performance
   - Shift comparison graphs
   - Goal indicators and alerts

4. **Mobile Optimization**
   - Simplified layout for small screens
   - Touch-friendly buttons
   - Swipe gestures for navigation

5. **Offline Support**
   - Service worker for offline access
   - Queue actions when offline
   - Sync when connection restored

## Migration Notes

### For Developers

**Old OI Module Structure:**
- Single "Operator Dashboard" page
- Separate pages for each action (change product, defect input, etc.)
- Machine selection via dialog

**New OI Module Structure:**
- Two main screens (selection + operation)
- All operator actions on one screen
- Machine selection is a dedicated page

**Backward Compatibility:**
The old OI pages (`/oi/dashboard`, `/oi/change-product`, etc.) are still available in the routes for backward compatibility. They can be removed once migration is complete.

### For Users

**Key Changes:**
1. Operators are now redirected directly to machine selection (no home page)
2. All operations happen on a single screen (no page switching)
3. Machine selection persists across browser sessions
4. Cleaner, more focused interface

**Training Points:**
1. How to search and filter machines
2. How to read the timeline visualization
3. How to use action buttons
4. How to interpret OEE metrics
5. When to use test vs run mode

## Conclusion

This refactor simplifies the OI module by consolidating functionality into two well-designed screens. The implementation follows modern React patterns, integrates with existing APIs, and provides a solid foundation for future enhancements.

The modular architecture makes it easy to:
- Add new features
- Test components in isolation
- Maintain code quality
- Scale the application

All code follows the project's coding standards and documentation guidelines as specified in `COPILOT_INSTRUCTIONS.md`.
