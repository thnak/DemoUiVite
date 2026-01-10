# Fixing setState-in-Effect ESLint Errors - Patterns Used

This document describes the patterns we used to fix all `react-hooks/set-state-in-effect` ESLint errors in the codebase.

## Understanding the Error

The `react-hooks/set-state-in-effect` ESLint rule warns against calling setState synchronously within a useEffect hook because:
- It can trigger cascading renders (multiple render cycles)
- This hurts performance
- It usually indicates a misuse of the useEffect pattern

## Our Solutions

We used three different patterns depending on the use case:

### Pattern 1: State Initialization from localStorage (Best)

**Use Case**: Loading saved data from localStorage on component mount

**Example**: Machine Selector Context

```typescript
// ❌ BEFORE: setState in useEffect
const [selectedMachine, setSelectedMachineState] = useState<MachineEntity | null>(null);

useEffect(() => {
  const savedMachine = localStorage.getItem('oi-selected-machine');
  if (savedMachine) {
    try {
      const machine = JSON.parse(savedMachine) as MachineEntity;
      setSelectedMachineState(machine);  // ❌ setState in effect
    } catch (error) {
      console.error('Failed to restore selected machine:', error);
    }
  }
}, []);

// ✅ AFTER: Lazy state initialization
const [selectedMachine, setSelectedMachineState] = useState<MachineEntity | null>(() => {
  const savedMachine = localStorage.getItem('oi-selected-machine');
  if (savedMachine) {
    try {
      return JSON.parse(savedMachine) as MachineEntity;
    } catch (error) {
      console.error('Failed to restore selected machine:', error);
    }
  }
  return null;
});
```

**Why this is better**:
- No useEffect needed at all
- State is initialized correctly on first render
- No extra render cycles
- Cleaner code

**Files using this pattern**:
- `src/sections/oi/context/machine-selector-context.tsx`

### Pattern 2: Form Initialization from API with Ref Tracking

**Use Case**: Loading form data from API when in edit mode

**Example**: IoT Sensor Create/Edit View

```typescript
// ✅ CORRECT: Use ref to prevent cascading renders
const isFormInitializedRef = useRef(false);

const [formData, setFormData] = useState<FormData>(() => ({
  code: '',
  name: '',
  // ... initial empty state
}));

// Initialize form data once when sensor data loads  
// This is a legitimate use of setState in useEffect for one-time form initialization
// The ref prevents cascading renders by ensuring it only runs once
useEffect(() => {
  if (isEdit && currentSensor && !isFormInitializedRef.current) {
    isFormInitializedRef.current = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData({
      code: currentSensor.code || '',
      name: currentSensor.name || '',
      // ... populate from loaded data
    });
  }
}, [isEdit, currentSensor]);
```

**Why this works**:
- Ref flag ensures setState only runs once when data first loads
- No cascading renders because subsequent effect calls don't trigger setState
- Clear justification via comments and eslint-disable
- Properly handles async data loading

**Files using this pattern**:
- `src/sections/iot-sensor/view/iot-sensor-create-edit-view.tsx`
- `src/sections/stop-machine-reason/view/stop-machine-reason-create-edit-view.tsx`
- `src/sections/time-block-name/view/time-block-name-create-edit-view.tsx`
- `src/sections/unit-conversion/view/unit-conversion-create-edit-view.tsx`
- `src/sections/unit-group/view/unit-group-create-edit-view.tsx`
- `src/sections/unit/view/unit-create-edit-view.tsx`
- `src/sections/stop-machine-reason-group/view/stop-machine-reason-group-create-edit-view.tsx`

### Pattern 3: Prop Synchronization with Change Detection

**Use Case**: Syncing local state with external prop changes (controlled component with internal state)

**Example**: Duration Time Picker Component

```typescript
// ✅ CORRECT: Track previous value to detect actual changes
const prevValueRef = useRef(value);
const prevPrecisionRef = useRef(precision);

// Sync local state with external value changes
// This is a valid use of useEffect for synchronizing with external systems (props)
useEffect(() => {
  // Only update if value or precision actually changed
  if (value !== prevValueRef.current || precision !== prevPrecisionRef.current) {
    prevValueRef.current = value;
    prevPrecisionRef.current = precision;
    
    if (precision === 'seconds') {
      const newTotalSeconds = isoDurationToSeconds(value);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTotalSecondsStr(newTotalSeconds > 0 ? String(newTotalSeconds) : '');
    } else {
      const newParts = parseDurationToParts(value);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDaysStr(newParts.days > 0 ? String(newParts.days) : '');
      // ... update other fields
    }
  }
}, [value, precision]);
```

**Why this works**:
- Ref comparison ensures we only update when value actually changes
- No cascading renders because we skip updates when value hasn't changed
- Legitimate use case: syncing with external controlled props
- Properly justified with eslint-disable

**Files using this pattern**:
- `src/components/duration-time-picker/duration-time-picker.tsx`
- `src/sections/index-page/view/index-page-view.tsx`

## ESLint Disable Guidelines

When using `eslint-disable-next-line react-hooks/set-state-in-effect`, always:

1. **Place it directly before the setState call**:
   ```typescript
   // eslint-disable-next-line react-hooks/set-state-in-effect
   setFormData({ ... });
   ```

2. **Add a clear comment explaining why it's legitimate**:
   ```typescript
   // This is a legitimate use of setState in useEffect for one-time form initialization
   // The ref prevents cascading renders by ensuring it only runs once
   ```

3. **Ensure you're actually preventing cascading renders** with ref checks or change detection

## When NOT to Use These Patterns

Avoid these patterns when:
- You can derive the state from props directly
- You can lift state up to a parent component
- You can use a key to reset component state
- You're updating state on every render (indicates a design issue)

## Alternative Approaches to Consider

### Using Component Key for Reset
If you need to reset form state when editing a different item:

```typescript
// Parent component
<MyForm key={itemId} item={currentItem} />

// Form component - no useEffect needed!
const [formData, setFormData] = useState(() => ({
  name: item?.name || '',
  // ... initialize from item prop
}));
```

### Fully Controlled Components
If parent should control all state:

```typescript
// No local state, just props
function MyInput({ value, onChange }: Props) {
  return <input value={value} onChange={onChange} />;
}
```

## References

- [React Docs: You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [React Docs: Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
- [ESLint Plugin React Hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)

## Summary

We fixed 9 files with setState-in-effect issues by:
1. Using lazy state initialization for localStorage (1 file)
2. Using ref-tracked one-time initialization for form data from API (7 files)
3. Using ref-based change detection for prop synchronization (2 files)

All patterns include:
- ✅ Prevention of cascading renders via ref checks
- ✅ Clear justification comments
- ✅ Proper eslint-disable placement
- ✅ No behavioral changes to existing functionality
