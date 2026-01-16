# Key-Value Store - Visual Implementation Guide

## 📋 Table of Contents
1. [Navigation Menu](#navigation-menu)
2. [List Page Layout](#list-page-layout)
3. [Create/Edit Form](#createedit-form)
4. [Table Features](#table-features)

## 🎯 Navigation Menu

The Settings menu now has unique icons for each item:

```
Settings
├── 📊 Unit Group          (solar:scale-bold-duotone)
├── 📏 Unit                (solar:ruler-bold-duotone)
├── 🔄 Unit Conversion     (solar:restart-bold)
├── 🕐 Time Block Name     (solar:clock-circle-bold)
└── 💾 Key-Value Store     (solar:database-bold-duotone) ← NEW
```

## �� List Page Layout

### Page Header
```
┌─────────────────────────────────────────────────────────────┐
│ Key-Value Store List                    [Import] [Export] [+ Add] │
│ Dashboard • Settings • Key-Value Store                       │
└─────────────────────────────────────────────────────────────┘
```

### Table Structure
```
┌───────────────────────────────────────────────────────────────────────┐
│ [ ] Search...                                    [Columns] [Filters]  │
├─────┬──────────┬────────────┬───────────┬────────┬─────────┬─────────┤
│ [ ] │ Key      │ Value      │ Type Name │ Tags   │ Expires │ Actions │
├─────┼──────────┼────────────┼───────────┼────────┼─────────┼─────────┤
│ [ ] │ 🔒 mykey │ "sample"   │ string    │ [tag1] │ Jan 15  │   ⋮    │
│ [ ] │ config   │ {...}      │ json      │ [api]  │ Feb 20  │   ⋮    │
└─────┴──────────┴────────────┴───────────┴────────┴─────────┴─────────┘
                         Rows per page: 5 ▼   1-5 of 10   < >
```

**Key Features:**
- 🔒 Lock icon for encrypted entries
- 📝 Value truncated to 50 characters
- 🏷️ Tags as colored chips (max 2 visible + "+N")
- 📅 Formatted expiration dates
- ⋮ Action menu (Edit/Delete)

## ✏️ Create/Edit Form

### Form Layout (Grid 4/12 + 8/12)

```
┌─────────────────────────────────────────────────────────────────┐
│ Create Key-Value Store                                [Help ?]  │
│ Dashboard • Settings • Key-Value Store • Create                 │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┬────────────────────────────────────────────────┐
│              │                                                │
│  Encryption  │              Main Form                         │
│              │                                                │
│  ┌────────┐  │  Key *                                        │
│  │ 🛡️     │  │  ┌─────────────────────────────────────────┐ │
│  │ [✓]    │  │  │ my-config-key                           │ │
│  │Encrypt │  │  └─────────────────────────────────────────┘ │
│  └────────┘  │                                                │
│              │  Value                                         │
│  When        │  ┌─────────────────────────────────────────┐ │
│  encrypted,  │  │                                         │ │
│  value is    │  │ {"setting": "value"}                    │ │
│  secured     │  │                                         │ │
│              │  └─────────────────────────────────────────┘ │
│              │                                                │
│              │  Type Name                                     │
│              │  ┌─────────────────────────────────────────┐ │
│              │  │ json                                    │ │
│              │  └─────────────────────────────────────────┘ │
│              │                                                │
│              │  Tags                                          │
│              │  ┌─────────────────────────────────────────┐ │
│              │  │ [config] [api] [v1]        Add tag...   │ │
│              │  └─────────────────────────────────────────┘ │
│              │                                                │
│              │  Expires At                                    │
│              │  ┌─────────────────────────────────────────┐ │
│              │  │ 2024-12-31 23:59      📅               │ │
│              │  └─────────────────────────────────────────┘ │
│              │                                                │
│              │                        [Cancel]  [Save]       │
└──────────────┴────────────────────────────────────────────────┘
```

**Form Fields:**
1. **Key** (required) - Unique identifier
2. **Value** - Multiline text (JSON, string, etc.)
3. **Type Name** - Data type identifier
4. **Tags** - Autocomplete with freeSolo (create new tags)
5. **Expires At** - Datetime picker (native input)
6. **IsEncrypted** - Checkbox with visual indicator

## 🎨 Table Features Detail

### Encrypted Entry Display
```
Row with encryption:
┌─────┬──────────────┬────────────┬───────────┬────────┐
│ [ ] │ 🔒 secret   │ ••••••••  │ password  │ [admin]│
└─────┴──────────────┴────────────┴───────────┴────────┘
       Lock icon      Truncated    Type       Tag chip
```

### Tag Display (Multiple)
```
Single tag:    [api]
Two tags:      [api] [v1]
Many tags:     [api] [v1] +3
```

### Actions Menu
```
Click ⋮ button:
┌──────────┐
│ ✏️ Edit  │
│ 🗑️ Delete│
└──────────┘
```

### Delete Confirmation
```
┌─────────────────────────────────────┐
│  ⚠️  Delete Key-Value Store         │
│                                     │
│  Are you sure you want to delete    │
│  this key-value store entry?        │
│                                     │
│  This action cannot be undone.      │
│                                     │
│         [Cancel]     [Delete]       │
└─────────────────────────────────────┘
```

## 🎯 User Flow Examples

### Creating a New Entry
1. Click "Add Key-Value Store" button
2. Fill in the Key field (required)
3. Add Value (optional, multiline)
4. Add TypeName (e.g., "json", "string")
5. Add Tags (press Enter after each tag)
6. Set Expires At (optional)
7. Check "IsEncrypted" if needed
8. Click "Save"

### Editing an Entry
1. Find entry in table
2. Click ⋮ menu button
3. Select "Edit"
4. Modify fields as needed
5. Click "Save"

### Searching and Filtering
1. Type in search box
2. Searches across: key, value, typeName, tags
3. Results update in real-time
4. Use pagination to browse results

### Bulk Operations
1. Select multiple rows with checkboxes
2. Click "Delete" button in toolbar
3. Confirm deletion
4. All selected entries removed

## 🏗️ Component Architecture

```
key-value-store/
├── view/
│   ├── key-value-store-list-view.tsx      (Main list page)
│   └── key-value-store-create-edit-view.tsx (Form page)
├── key-value-store-table-row.tsx          (Table row)
├── key-value-store-table-head.tsx         (Table header)
├── key-value-store-table-toolbar.tsx      (Search/filters)
├── key-value-store-table-no-data.tsx      (Empty state)
├── key-value-store-table-empty-rows.tsx   (Pagination)
└── key-value-store-utils.ts               (Utilities)
```

## 🎨 Theme Integration

### Light Mode
```
Background:  #FFFFFF (white)
Text:        #212B36 (dark gray)
Cards:       #FFFFFF with shadow
Chips:       Blue/gray outlined
Icons:       Dark gray
```

### Dark Mode
```
Background:  #161C24 (dark)
Text:        #FFFFFF (white)
Cards:       #212B36 with glow
Chips:       Blue/gray outlined
Icons:       Light gray
```

All colors use theme tokens for automatic adaptation.

## 📱 Responsive Design

### Desktop (>= 1200px)
- Grid: 4 columns (left) + 8 columns (right)
- Full table visible
- All features accessible

### Tablet (768px - 1199px)
- Grid stacks: 12 columns each
- Table scrollable horizontally
- Touch-friendly buttons

### Mobile (< 768px)
- Single column layout
- Cards stack vertically
- Simplified table view
- Large touch targets

## 🚀 Performance Features

- **Lazy Loading**: Routes loaded on demand
- **Pagination**: Only load visible items
- **Search Debouncing**: Reduces API calls
- **Memo Optimization**: React Compiler auto-memoization
- **Code Splitting**: Separate chunks per route

## ✅ Accessibility

- **Keyboard Navigation**: Full keyboard support
- **ARIA Labels**: Proper screen reader support
- **Focus Management**: Clear focus indicators
- **Color Contrast**: WCAG AA compliant
- **Form Validation**: Clear error messages

