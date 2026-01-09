# OI Module Refactor - Implementation Documentation

## Overview

This document describes the **complete rewrite** of the OI (Operator Interface) module from scratch. All legacy OI pages have been removed and replaced with two modern, fullscreen screens:

1. **Machine Selection Screen** (`/oi/select-machine`) - Grid-based machine browsing with area-colored theming
2. **Machine Operation Screen** (`/oi/operation`) - Skeleton dashboard for future implementation

**Status:** ✅ Phase 1 Complete - Machine selection fully implemented, operation screen is a basic skeleton ready for feature development.

## Architecture

### Component Structure

```
src/
├── layouts/
│   └── fullscreen/
│       ├── fullscreen-layout.tsx             # NEW: Fullscreen layout (no header/sidebar)
│       └── index.ts
├── sections/oi/
│   ├── context/
│   │   └── machine-selector-context.tsx      # Manages selected machine state + localStorage
│   ├── machine-selection/
│   │   └── view/
│   │       ├── machine-selection-view.tsx    # NEW: Grid-based machine selection
│   │       └── index.ts
│   └── machine-operation/
│       └── view/
│           ├── machine-operation-view.tsx    # NEW: Skeleton operation dashboard
│           └── index.ts
├── pages/oi/
│   ├── machine-selection.tsx                 # NEW: Page wrapper for selection view
│   └── machine-operation.tsx                 # NEW: Page wrapper for operation view
└── utils/
    └── jwt.ts                                # NEW: JWT decoding and role checking
```

**Removed Files:**
- All old OI pages: `operator-dashboard.tsx`, `change-product.tsx`, `defect-input.tsx`, `downtime-input.tsx`
- All old OI sections: `dashboard/`, `change-product/`, `defect-input/`, `downtime-input/`, `components/`
- Legacy components: `machine-selector-card.tsx`

### Routing Configuration

**Active Routes:**
- `/oi/select-machine` - Machine selection screen (entry point for operators)
- `/oi/operation` - Machine operation screen (requires selected machine)

**Layout:**
- All OI routes use `FullscreenLayout` (no appbar, sidebar, or navigation menu)
- Fullscreen design provides distraction-free operator experience

**Removed Routes:**
- ❌ `/oi/dashboard` - Removed (replaced by `/oi/select-machine`)
- ❌ `/oi/change-product` - Removed (functionality will be in operation screen)
- ❌ `/oi/defect-input` - Removed (functionality will be in operation screen)
- ❌ `/oi/downtime-input` - Removed (functionality will be in operation screen)

**Role-based Redirect:**
When a user with the "Operator" role accesses the home page (`/`), they are automatically redirected to `/oi/select-machine` (implemented in `index-page-view.tsx`).

## Screen 1: Machine Selection (✅ Complete)

### Features

1. **Title and Subtitle** - "Operator Dashboard" with description
2. **Search Input** - Real-time search for machines by name or code
3. **Area Filter** - Multi-select dropdown to filter machines by area
4. **Machine Cards Grid** - Responsive grid (1-4 columns) with area color theming
5. **Framer Motion Animations** - Smooth staggered card animations
6. **Machine Card Details:**
   - **Sequential number badge** - Colored with area hex color
   - **Machine image** - With fallback icon
   - **Machine name** - Large, bold display
   - **Area name chip** - Colored background (20% opacity of area color)
   - **"TRUY CẬP" link** - Call-to-action with arrow icon
   - **Area color theming:**
     - Top border in area hex color
     - Background tint (15% opacity of area color)
     - Hover animation with lift effect

### Visual Design

- **Fullscreen layout** - No header, sidebar, or navigation
- **Responsive grid:**
  - Mobile (xs): 1 column
  - Tablet (sm): 2 columns
  - Desktop (md): 3 columns
  - Large (lg): 4 columns
- **Area color integration:** Uses `areaHexColor` from API for visual theming
- **Smooth animations:** Header fade-in, search section fade-in, staggered card animations

### Implementation Details

**API Integration:**
```typescript
// Search machines with area colors
const response = await getapiAreasearchmachines({
  areaIds: selectedAreas,      // Array of area IDs to filter
  searchText: searchTerm        // Search term for machine name/code
});

// Response: SearchMachineByAreaResult[]
// Fields: machineId, machineName, areaName, areaHexColor

// Get areas for filter dropdown
const areas = await getapiAreaminimalnames();
```

**Image Loading:**
```typescript
// Machine image URL with fallback
const imageUrl = `${apiConfig.baseUrl}/api/Machine/${machine.machineId}/image`;
```

**Area Color Theming:**
```typescript
// Top border
borderColor: machine.areaHexColor || 'primary.main'

// Sequential number badge
bgcolor: machine.areaHexColor || 'primary.main'

// Card background tint (15% opacity)
bgcolor: machine.areaHexColor ? `${machine.areaHexColor}15` : 'background.neutral'

// Area name chip (20% opacity)
bgcolor: machine.areaHexColor ? `${machine.areaHexColor}20` : 'background.neutral'
```

**Animations:**
```typescript
// Header fade-in from top
headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

// Staggered card animations
containerVariants = {
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
}

cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}
```

**State Management:**
- Search term: Component-local state (`useState`)
- Selected areas: Component-local state (`useState`)
- Machine list: Component-local state (`useState`)
- Selected machine: Shared context (`MachineSelectContext`) + localStorage persistence

### User Flow

1. User lands on `/oi/select-machine`
2. (Optional) User enters search term or selects areas to filter
3. Machines are displayed as horizontal scrolling cards
4. User clicks a machine card
5. Selected machine is saved to context and localStorage
6. User is navigated to `/oi/operation`

## Screen 2: Machine Operation (🚧 Skeleton Only)

**Status:** Basic skeleton implemented. All features below need to be implemented in future work.

### Planned Features (Not Yet Implemented)

#### Header Section
- **Back Button** - Returns to machine selection
- **Machine Name** - Currently selected machine
- **Action Buttons** (placeholders):
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
- **Timeline Visualization** - Interactive blocks for run/unplan stop/planned stop
- **Alert Message** - Shows count of unlabeled unplanned stops
- **Click-to-label** - Click unplanned stop blocks to assign stop reasons

#### Metrics Section (Bottom Left)
- **OEE Percentage** - Overall Equipment Effectiveness
- **APQ Breakdown** - Availability × Performance × Quality
- **Downtime Stats** - Hours and count
- **Test Stats** - Hours and count

#### Production Info Section (Bottom Right)
- **Estimated Completion Time**
- **Production Order Number**
- **Product Code**
- **Quantity Stats** - Total/Pass/Fail
- **Progress Percentage**
- **Cycle Times** - Ideal vs Actual
- **Operator Information** - Name and avatar

### Current Implementation

The current operation screen is a **skeleton/placeholder** with:
- Basic layout structure
- Back button (functional)
- Machine name display (from context)
- Placeholder containers for future content
- Fullscreen layout (no header/sidebar)

**All data mapping and real-time features need to be implemented.**

### Planned API Integration (For Future Implementation)

**Real-time Data Integration:**
```typescript
// Subscribe to machine updates via SignalR (TODO)
await hubService.subscribeToMachine(
  machineId,
  handleMachineUpdate
);

// Get initial aggregation (TODO)
const aggregation = await hubService.getMachineAggregation(machineId);
```

**Machine Status Logic (To Be Implemented):**
```typescript
// Determine machine status from real-time data
const getMachineStatus = (machineData: MachineOeeUpdate | null): MachineStatus => {
  // Logic to determine: running, planstop, unplanstop, testing
  // Based on machine state, scheduled downtime, and test mode
};
```

**API Endpoints Needed:**
- MachineHub SignalR - Real-time OEE, production, and status data
- `/api/Machine/{id}/current-product` - Get current production info
- `/api/Machine/{id}/timeline` - Get timeline blocks (run/stop periods)
- `/api/Machine/{id}/operator` - Get current operator info
- `/api/User/{id}/avatar-image` - Get operator avatar

### User Flow

1. User arrives from machine selection (or directly with machine in localStorage)
2. **Skeleton screen is displayed** with basic layout
3. *(Future)* System connects to MachineHub SignalR for real-time updates
4. *(Future)* Initial machine data is loaded and displayed
5. *(Future)* Data updates are received and displayed in real-time
6. User can:
   - Click back button to return to machine selection ✅
   - *(Future)* Switch between timeline views (Current/Shift/Day)
   - *(Future)* Toggle test/run mode
   - *(Future)* Click action buttons
   - *(Future)* Click timeline blocks to label stop reasons

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

## API Endpoints

### Currently Used

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/api/Area/search-machines` | GET | Search machines with area colors | ✅ Implemented |
| `/api/Area/minimal-names` | GET | Get areas for filter dropdown | ✅ Implemented |
| `/api/Machine/{id}/image` | GET | Load machine image | ✅ Implemented |

### Planned for Operation Screen

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| MachineHub (SignalR) | WebSocket | Real-time machine data updates | 🚧 TODO |
| `/api/Machine/{id}/current-product` | GET | Get current product info | 🚧 TODO |
| `/api/Machine/{id}/timeline` | GET | Get timeline blocks | 🚧 TODO |
| `/api/Machine/{id}/operator` | GET | Get current operator info | 🚧 TODO |
| `/api/User/{id}/avatar-image` | GET | Get operator avatar | 🚧 TODO |
| `/api/Machine/{id}/available-products` | GET | List products for change-product | 🚧 TODO |
| `/api/Machine/{id}/change-product` | POST | Change current product | 🚧 TODO |
| `/api/Machine/{id}/add-quantity` | POST | Add produced quantity | 🚧 TODO |
| `/api/Machine/{id}/input-defect` | POST | Input defect reason | 🚧 TODO |
| `/api/Machine/{id}/stop-reason` | POST | Label stop reason | 🚧 TODO |

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

### ✅ Completed (Phase 1)

- [x] **Role-based Redirect**
  - [x] Operator role redirects to `/oi/select-machine` from `/`
  - [x] Non-operator roles stay on home page

- [x] **Machine Selection**
  - [x] Search filter works correctly
  - [x] Area multi-select filter works correctly
  - [x] Machine cards display correctly with images
  - [x] Area colors display on cards (border, badge, background)
  - [x] Clicking a card navigates to operation screen
  - [x] Selected machine persists to localStorage
  - [x] Animations render smoothly
  - [x] Responsive grid layout (1-4 columns)

- [x] **Fullscreen Layout**
  - [x] No appbar/header visible
  - [x] No sidebar/navigation menu visible
  - [x] Full viewport utilization

- [x] **localStorage Persistence**
  - [x] Refresh page maintains selected machine
  - [x] Clear localStorage removes selection
  - [x] Invalid JSON in storage doesn't crash app

- [x] **Responsive Design**
  - [x] Works on mobile (< 768px) - 1 column
  - [x] Works on tablet (768px - 1024px) - 2 columns
  - [x] Works on desktop (> 1024px) - 3-4 columns

### 🚧 TODO (Phase 2 - Operation Screen)

- [ ] **Machine Operation Basic**
  - [ ] Back button returns to selection screen ✅ (works)
  - [ ] Machine name displays correctly ✅ (works)
  - [ ] Machine data loads from SignalR hub
  - [ ] Real-time updates display correctly
  - [ ] Timeline view switcher works
  - [ ] Test/run switch state persists
  - [ ] All metrics display correctly
  - [ ] All action buttons are functional

- [ ] **Timeline Component**
  - [ ] Run blocks display with correct time ranges
  - [ ] Unplanned stop blocks display in red
  - [ ] Planned stop blocks display in yellow
  - [ ] Testing blocks display in blue
  - [ ] Click on unplanned stop opens label dialog
  - [ ] Timeline updates in real-time
  - [ ] View switcher (Current/Shift/Day) works

- [ ] **Action Buttons**
  - [ ] Change Product opens product selection modal
  - [ ] Add Product opens quantity input dialog
  - [ ] Input Defect opens defect reason selection
  - [ ] Stop Reason opens stop reason labeling

## Next Steps for Continued Development

### Phase 2: Machine Selection Enhancements

#### 2.1 Mouse Wheel Scrolling Support
**Priority:** Medium  
**Description:** Enable horizontal scrolling on machine grid using mouse wheel

**Tasks:**
- [ ] Add mouse wheel event listener to machine grid container
- [ ] Convert vertical scroll to horizontal scroll when over grid
- [ ] Add smooth scrolling animation
- [ ] Test on different browsers (Chrome, Firefox, Safari)
- [ ] Handle edge cases (end of scroll, mobile devices)

**Implementation Approach:**
```typescript
// In machine-selection-view.tsx
const handleWheel = (e: WheelEvent) => {
  if (Math.abs(e.deltaY) > 0) {
    e.preventDefault();
    containerRef.current?.scrollBy({
      left: e.deltaY,
      behavior: 'smooth'
    });
  }
};
```

**Acceptance Criteria:**
- Mouse wheel scrolls grid horizontally
- Smooth animation on scroll
- No conflicts with page scroll
- Works on all supported browsers

---

### Phase 3: Machine Operation Screen - Core Features

#### 3.1 Real-time Data Mapping
**Priority:** High  
**Description:** Connect operation screen to MachineHub SignalR for live data

**Tasks:**
- [ ] Set up SignalR connection to MachineHub
- [ ] Subscribe to machine updates on mount
- [ ] Handle connection/disconnection events
- [ ] Implement automatic reconnection logic
- [ ] Map SignalR data to UI state
- [ ] Add loading states and error handling
- [ ] Test with real machine data

**Data to Map:**
```typescript
interface MachineOperationData {
  // OEE Metrics
  oee: number;                    // Overall Equipment Effectiveness %
  availability: number;           // A in APQ formula
  performance: number;            // P in APQ formula
  quality: number;                // Q in APQ formula
  
  // Downtime Stats
  downtimeHours: number;          // Total downtime in hours
  downtimeCount: number;          // Number of downtime events
  
  // Test Stats
  testHours: number;              // Total test time in hours
  testCount: number;              // Number of test runs
  
  // Production Info
  estimatedCompletion: string;    // ISO datetime
  productionOrderNumber: string;
  productCode: string;
  productName: string;
  totalQuantity: number;
  passQuantity: number;
  failQuantity: number;
  progressPercentage: number;
  idealCycleTime: number;         // In seconds
  actualCycleTime: number;        // In seconds
  
  // Operator Info
  operatorId: string;
  operatorName: string;
  operatorAvatar?: string;
  
  // Machine Status
  status: 'running' | 'planstop' | 'unplanstop' | 'testing';
  isTestMode: boolean;
  lastUpdateTime: string;         // ISO datetime
}
```

**Acceptance Criteria:**
- Real-time data updates every time SignalR sends new data
- All metrics display correctly
- Connection status indicator shows connected/disconnected
- Graceful error handling for connection issues
- Data persists during brief disconnections

#### 3.2 Interactive Timeline Component
**Priority:** High  
**Description:** Implement timeline visualization with interactive blocks

**Tasks:**
- [ ] Create `TimelineBlock` component
- [ ] Implement timeline scale (time axis)
- [ ] Add color-coded blocks:
  - Green: Running
  - Red: Unplanned stop
  - Yellow: Planned stop
  - Blue: Testing
- [ ] Calculate block positions and widths from time ranges
- [ ] Add hover tooltips showing:
  - Block type
  - Start/end time
  - Duration
  - Stop reason (if labeled)
- [ ] Implement click handler for unplanned stops
- [ ] Add "Label Stop Reason" dialog
- [ ] Implement view switcher (Current/Shift/Day)
- [ ] Add alert badge for unlabeled stops
- [ ] Make timeline scrollable for long time ranges
- [ ] Add zoom controls (optional)

**Timeline Data Structure:**
```typescript
interface TimelineBlock {
  id: string;
  type: 'running' | 'unplanstop' | 'planstop' | 'testing';
  startTime: string;              // ISO datetime
  endTime: string | null;         // null if ongoing
  duration: number;               // In seconds
  stopReasonId?: string;          // For stop blocks
  stopReasonName?: string;
  isLabeled: boolean;             // For unplanstop only
}

interface TimelineData {
  blocks: TimelineBlock[];
  unlabeledCount: number;
  totalDuration: number;
  viewType: 'current' | 'shift' | 'day';
}
```

**Acceptance Criteria:**
- Timeline displays all blocks correctly
- Colors match block types
- Hover tooltips show correct information
- Clicking unplanned stop opens label dialog
- View switcher changes time range correctly
- Unlabeled count badge is accurate
- Timeline scrolls/zooms smoothly

#### 3.3 Action Button Workflows
**Priority:** High  
**Description:** Implement dialogs and logic for all action buttons

**3.3.1 Change Product**
- [ ] Create product selection modal
- [ ] Fetch available products from API
- [ ] Display products in searchable list
- [ ] Show product code, name, and image
- [ ] Implement confirmation dialog
- [ ] Call API to change product
- [ ] Update UI with new product info
- [ ] Show success/error notifications

**3.3.2 Add Product (Add Quantity)**
- [ ] Create quantity input dialog
- [ ] Add numeric input for quantity
- [ ] Add pass/fail toggle or separate inputs
- [ ] Validate input (positive numbers only)
- [ ] Call API to add quantity
- [ ] Update production stats in real-time
- [ ] Show success/error notifications

**3.3.3 Input Defect**
- [ ] Create defect reason selection dialog
- [ ] Fetch defect reasons from API
- [ ] Group by defect reason groups
- [ ] Add quantity input for defect count
- [ ] Add optional notes/comments field
- [ ] Call API to record defect
- [ ] Update fail quantity in UI
- [ ] Show success/error notifications

**3.3.4 Stop Reason (Label Downtime)**
- [ ] Create stop reason selection dialog
- [ ] Fetch stop machine reasons from API
- [ ] Group by stop reason groups
- [ ] Show color-coded options
- [ ] Add optional notes/comments field
- [ ] Call API to label stop
- [ ] Update timeline block with label
- [ ] Decrease unlabeled count
- [ ] Show success/error notifications

**Acceptance Criteria for All Actions:**
- Dialogs open/close smoothly
- Data loads correctly from API
- Input validation works
- API calls succeed and update UI
- Error handling is graceful
- Success/error messages are clear
- UI updates reflect changes immediately

#### 3.4 Test/Run Mode Toggle
**Priority:** Medium  
**Description:** Implement test mode switching functionality

**Tasks:**
- [ ] Add switch component in header
- [ ] Store test mode state
- [ ] Call API to toggle test mode
- [ ] Update machine status chip
- [ ] Show confirmation dialog before switching
- [ ] Disable switch during API call
- [ ] Handle API errors gracefully
- [ ] Update timeline to show testing blocks

**Acceptance Criteria:**
- Switch toggles test/run mode
- Confirmation dialog appears before switching
- Machine status updates correctly
- Timeline reflects test mode changes
- Switch is disabled during loading

#### 3.5 Real-time Clock
**Priority:** Low  
**Description:** Display current time in header

**Tasks:**
- [ ] Add clock component to header
- [ ] Update time every second
- [ ] Format time appropriately (HH:mm:ss or locale format)
- [ ] Add timezone indicator if needed
- [ ] Sync with server time (optional)

**Acceptance Criteria:**
- Clock displays correct current time
- Updates every second
- Format is readable and appropriate

---

### Phase 4: Visual Enhancements

#### 4.1 Machine Selection Screen
**Priority:** Medium

**Tasks:**
- [ ] Add carousel navigation buttons (previous/next)
- [ ] Implement touch/swipe gestures for mobile
- [ ] Add card loading skeletons
- [ ] Improve image loading (progressive, blur-up)
- [ ] Add empty state when no machines found
- [ ] Add pagination or infinite scroll for large datasets
- [ ] Enhance animations (more subtle, performant)
- [ ] Add machine status indicators on cards (running/stopped)

**Acceptance Criteria:**
- Carousel buttons navigate smoothly
- Swipe gestures work on touch devices
- Loading states are smooth and non-jarring
- Images load progressively
- Empty state is informative
- Large datasets perform well

#### 4.2 Machine Operation Screen
**Priority:** Medium

**Tasks:**
- [ ] Design and implement metric cards with icons
- [ ] Add progress bars for OEE metrics
- [ ] Implement gauge charts for percentages
- [ ] Add trend indicators (up/down arrows)
- [ ] Improve spacing and typography
- [ ] Add subtle animations on data updates
- [ ] Implement dark mode support
- [ ] Make layout responsive for tablets
- [ ] Add print-friendly stylesheet

**Acceptance Criteria:**
- Visual hierarchy is clear
- Metrics are easy to read at a glance
- Charts/gauges are accurate
- Animations are smooth and purposeful
- Dark mode looks good
- Responsive on all screen sizes
- Prints correctly

---

### Phase 5: Advanced Features

#### 5.1 Notifications and Alerts
**Priority:** Medium

**Tasks:**
- [ ] Add notification system for important events
- [ ] Alert on long downtime (configurable threshold)
- [ ] Notify when production order is near completion
- [ ] Alert on high defect rate
- [ ] Add sound notifications (optional, user-configurable)
- [ ] Implement notification history
- [ ] Add notification preferences

#### 5.2 Offline Support
**Priority:** Low

**Tasks:**
- [ ] Implement service worker for offline access
- [ ] Cache machine selection screen
- [ ] Queue actions when offline
- [ ] Sync actions when connection restored
- [ ] Show offline indicator
- [ ] Handle conflicts on sync

#### 5.3 Analytics and Reporting
**Priority:** Low

**Tasks:**
- [ ] Add shift summary report
- [ ] Implement day summary report
- [ ] Add export to PDF functionality
- [ ] Show historical OEE trends
- [ ] Compare current shift to previous shifts
- [ ] Add goal tracking and alerts

---

### Phase 6: Testing and Quality

#### 6.1 Unit Tests
**Priority:** Medium

**Tasks:**
- [ ] Write tests for JWT utilities
- [ ] Write tests for MachineSelector context
- [ ] Write tests for timeline calculations
- [ ] Write tests for data mapping functions
- [ ] Achieve >80% code coverage

#### 6.2 Integration Tests
**Priority:** Medium

**Tasks:**
- [ ] Test machine selection flow end-to-end
- [ ] Test operation screen with mock SignalR data
- [ ] Test action button workflows
- [ ] Test localStorage persistence
- [ ] Test role-based routing

#### 6.3 Performance Optimization
**Priority:** Low

**Tasks:**
- [ ] Optimize re-renders (React.memo, useMemo, useCallback)
- [ ] Implement virtual scrolling for large lists
- [ ] Optimize image loading and caching
- [ ] Reduce bundle size (code splitting, lazy loading)
- [ ] Monitor and optimize real-time data updates
- [ ] Profile performance and fix bottlenecks

---

### Implementation Priority Order

1. **Phase 3.1** - Real-time Data Mapping (High Priority)
2. **Phase 3.2** - Interactive Timeline Component (High Priority)
3. **Phase 3.3** - Action Button Workflows (High Priority)
4. **Phase 3.4** - Test/Run Mode Toggle (Medium Priority)
5. **Phase 2.1** - Mouse Wheel Scrolling Support (Medium Priority)
6. **Phase 4.1** - Machine Selection Visual Enhancements (Medium Priority)
7. **Phase 4.2** - Machine Operation Visual Enhancements (Medium Priority)
8. **Phase 3.5** - Real-time Clock (Low Priority)
9. **Phase 5** - Advanced Features (Low Priority)
10. **Phase 6** - Testing and Quality (Ongoing)

---

### Estimated Timeline

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| Phase 2.1 | Mouse wheel scrolling | 2-3 days |
| Phase 3.1 | Real-time data mapping | 5-7 days |
| Phase 3.2 | Interactive timeline | 7-10 days |
| Phase 3.3 | Action button workflows | 10-14 days |
| Phase 3.4 | Test/run mode toggle | 2-3 days |
| Phase 3.5 | Real-time clock | 1 day |
| Phase 4.1 | Selection visual enhancements | 3-5 days |
| Phase 4.2 | Operation visual enhancements | 5-7 days |
| Phase 5 | Advanced features | 10-15 days |
| Phase 6 | Testing and quality | Ongoing |

**Total Estimated Time:** 45-67 days (9-13 weeks)

---

### Success Metrics

- [ ] All high-priority features implemented and tested
- [ ] Zero critical bugs in production
- [ ] Page load time < 2 seconds
- [ ] Real-time update latency < 500ms
- [ ] Mobile responsive score > 90 (Lighthouse)
- [ ] Accessibility score > 90 (Lighthouse)
- [ ] User satisfaction rating > 4/5
- [ ] Operator training time < 1 hour

---

## Known Issues & Limitations

### Current Limitations

1. **Operation Screen** - Skeleton only, all features need implementation
2. **Timeline Component** - Not yet implemented
3. **Action Buttons** - Not yet connected to workflows
4. **Real-time Data** - SignalR integration not yet implemented
5. **Mouse Wheel Scrolling** - Not yet supported on machine selection grid
6. **Offline Support** - Not yet implemented

### Technical Debt

1. **Type Safety** - Some API responses use `as any` casts (from nullable fixes)
2. **Error Handling** - Needs more comprehensive error boundaries
3. **Loading States** - Could be more polished
4. **Accessibility** - Needs ARIA labels and keyboard navigation improvements
5. **Performance** - Real-time updates may need optimization for many machines

---

## Migration Notes

### For Developers

**Complete Rewrite - No Migration Needed:**
- All old OI pages have been **completely removed**
- No backward compatibility routes exist
- Fresh start with new architecture

**Old OI Module (Removed):**
- ❌ Single "Operator Dashboard" page
- ❌ Separate pages for each action (change product, defect input, etc.)
- ❌ Machine selection via dialog
- ❌ Routes: `/oi/dashboard`, `/oi/change-product`, `/oi/defect-input`, `/oi/downtime-input`

**New OI Module (Current):**
- ✅ Two main screens (selection + operation)
- ✅ Fullscreen layout (no dashboard UI)
- ✅ Grid-based machine selection with area colors
- ✅ All operator actions will be on one screen (when implemented)
- ✅ Machine selection is a dedicated page
- ✅ Routes: `/oi/select-machine`, `/oi/operation`

**Key Architectural Changes:**
1. **Fullscreen Layout** - New `FullscreenLayout` component removes all dashboard chrome
2. **Area Color Theming** - Machine cards use area hex colors from API
3. **Framer Motion Animations** - Smooth, professional animations throughout
4. **localStorage Persistence** - Machine selection survives page reloads
5. **Role-based Routing** - Operators automatically redirected to OI module

### For Users

**Key Changes:**
1. Operators are now redirected directly to machine selection (no home page)
2. Machine selection uses a modern grid layout with color theming
3. Operation screen is being built from scratch (skeleton currently)
4. Machine selection persists across browser sessions
5. Cleaner, more focused fullscreen interface

**Training Points (For Phase 1):**
1. How to search and filter machines
2. How to recognize area colors on machine cards
3. How to select a machine
4. Understanding the fullscreen layout (no navigation menu)

**Training Points (For Future Phases):**
1. How to read the timeline visualization
2. How to use action buttons
3. How to interpret OEE metrics
4. When to use test vs run mode
5. How to label unplanned stops

## Conclusion

### What Has Been Completed (Phase 1)

This phase represents a **complete rewrite** of the OI module foundation:

✅ **Machine Selection Screen (Fully Functional):**
- Modern grid-based layout with 1-4 responsive columns
- Real-time search and area filtering
- Area color theming on machine cards
- Smooth Framer Motion animations
- localStorage persistence
- Fullscreen design (no dashboard UI)

✅ **Core Infrastructure:**
- JWT-based role detection and automatic redirection
- Machine selector context with localStorage integration
- Fullscreen layout component
- New routing structure
- Cleaned up codebase (removed all legacy OI pages)

✅ **Development Standards:**
- MuiColorInput standardization across all entities
- Comprehensive documentation
- Zero TypeScript errors
- Follows project coding standards

### What Needs to Be Built (Phase 2+)

🚧 **Machine Operation Screen:**
- Currently a basic skeleton
- All features need implementation (timeline, metrics, actions)
- Real-time SignalR data integration
- Interactive workflows for operators

🚧 **Enhancements:**
- Mouse wheel scrolling on machine grid
- Visual polish and refinements
- Offline support
- Analytics and reporting

### Architecture Benefits

The modular architecture created in Phase 1 makes it easy to:
- ✅ Add new features incrementally
- ✅ Test components in isolation
- ✅ Maintain code quality
- ✅ Scale the application
- ✅ Onboard new developers

### Project Status

**Phase 1: Complete** ✅  
Machine selection is production-ready and can be deployed for users to browse and select machines.

**Phase 2+: Planned** 🚧  
Operation screen features can be built incrementally following the roadmap in the "Next Steps" section above.

---

All code follows the project's coding standards and documentation guidelines as specified in `.github/copilot-instructions.md`.
