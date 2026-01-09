# Calendar Entity Time-Shift Policy Configuration Guide

**Document Version:** 1.0  
**Last Updated:** 2026-01-09  
**Related Documents:** 
- [TIME_SHIFT_CASE_VALIDATION_TEST_REPORT.md](TIME_SHIFT_CASE_VALIDATION_TEST_REPORT.md)
- [TIME_SHIFT_CASE_PHASE4_GUIDE.md](TIME_SHIFT_CASE_PHASE4_GUIDE.md)
- [features/time-and-shifts-entities-review.md](features/time-and-shifts-entities-review.md)

---

## Executive Summary

The `CalendarEntity` is the central configuration point for time-shift case categorization in VaultForge's OEE (Overall Equipment Effectiveness) computation system. This entity defines **how** the 8 time-shift cases are treated when calculating production metrics, allowing organizations to customize behavior based on their operational policies.

**Key Configuration Fields:**
- **LateBufferMinutes** (int): Threshold for distinguishing overtime from night runs
- **MergeCase4ToShift1** (bool): Policy for early start production
- **MergeCase5ToLatest** (bool): Policy for overtime production
- **AutoVirtualShift** (bool): Policy for weekend/holiday production

These four policy fields, combined with shift schedules and break definitions, enable sophisticated OEE calculations that accurately reflect real-world manufacturing operations.

---

## Table of Contents

1. [Overview: The 8 Time-Shift Cases](#overview-the-8-time-shift-cases)
2. [Calendar Entity Structure](#calendar-entity-structure)
3. [Policy Field Details](#policy-field-details)
4. [Case-by-Case Configuration Impact](#case-by-case-configuration-impact)
5. [Configuration Examples](#configuration-examples)
6. [Best Practices](#best-practices)
7. [Integration with OEE Pipeline](#integration-with-oee-pipeline)
8. [Troubleshooting](#troubleshooting)

---

## Overview: The 8 Time-Shift Cases

Time-shift case categorization addresses a fundamental challenge in manufacturing OEE: **not all production time is equal**. Equipment may run during scheduled shifts, overtime, breaks, or even completely unscheduled periods. Each scenario has different implications for OEE metrics.

### The Case Matrix

| Case | Name | Trigger Condition | Impact on OEE | Configured By |
|------|------|-------------------|---------------|---------------|
| **Standard** | Normal Production | During shift, not during break | Counts toward availability, performance, quality | Default behavior |
| **Case 1** | Shift Loss | Stopped during shift (not break) | Reduces availability | Automatically detected |
| **Case 2** | Planned Break | Stopped during scheduled break | Excluded from OEE | Break schedules |
| **Case 3** | Break Run | Running during scheduled break | Bonus runtime (policy-dependent) | Break schedules |
| **Case 4** | Early Start | Before first shift of the day | Merged to Shift 1 OR separate | `MergeCase4ToShift1` |
| **Case 5** | Overtime | Within buffer after shift end | Merged to last shift OR separate | `MergeCase5ToLatest`, `LateBufferMinutes` |
| **Case 6** | Night Run | Beyond buffer from any shift | Tracked as ghost production | `LateBufferMinutes` |
| **Case 7** | Sunday | Production on Sunday | Virtual shift OR unscheduled | `AutoVirtualShift` |
| **Case 8** | Holiday | Production on public holiday | Virtual shift OR unscheduled | `AutoVirtualShift` |

### Why This Matters

**Without time-shift categorization:**
- Overtime production inflates shift OEE incorrectly
- Break time counted as downtime (penalizing OEE unfairly)
- Weekend production missed or attributed incorrectly
- Cannot distinguish planned vs. unplanned production

**With time-shift categorization:**
- Accurate OEE by shift, excluding inappropriate time periods
- Visibility into overtime, early starts, and weekend work
- Policy-driven reporting aligned with business rules
- Compliance with labor regulations and scheduling practices

---

## Calendar Entity Structure

### Entity Definition

```csharp
/// <summary>
/// Lịch làm việc (Work Calendar)
/// Defines working time patterns and time-shift case policies for OEE computation
/// </summary>
[MessagePackObject]
public class CalendarEntity : InformationBaseEntity, IEquatable<CalendarEntity>
{
    // Standard Properties
    [Key(13)] public ObjectId? ParentCalendarId { get; set; }
    [Key(14)] public ObjectId ShiftTemplateId { get; set; }
    [Key(15)] public DateOnly ApplyFrom { get; set; } = DateOnly.FromDateTime(DateTime.UtcNow);
    [Key(12)] public DateOnly? ApplyTo { get; set; }
    [Key(16)] public bool Plan2Infinite { get; set; } = false;
    [Key(17)] public TimeSpan WorkDateStartTime { get; set; } = TimeSpan.Zero;
    [Key(18)] public TimeSpan TimeOffset { get; set; } = TimeSpan.Zero;

    // Time-Shift Policy Configuration (Phase 4)
    [Key(19)] public int LateBufferMinutes { get; set; } = 120;
    [Key(20)] public bool MergeCase4ToShift1 { get; set; } = false;
    [Key(21)] public bool MergeCase5ToLatest { get; set; } = false;
    [Key(22)] public bool AutoVirtualShift { get; set; } = false;
}
```

### Inherited Properties

From `InformationBaseEntity` and `BaseEntity`:
- `Id` (ObjectId): Unique identifier
- `Name` (string): Display name of the calendar
- `Code` (string): Unique code identifier
- `Description` (string): Human-readable description
- `CreateTime` (DateTime UTC): Creation timestamp
- `ModifiedTime` (DateTime UTC): Last modification timestamp

### Key Relationships

```
CalendarEntity
    ├─→ ShiftTemplateEntity (via ShiftTemplateId)
    │   └─→ ShiftDefinitions[]
    │       └─→ BreakDefinitions[]
    ├─→ CalendarExceptionEntity[] (holidays, special dates)
    └─→ WorkDateCalendarStatisticEntity[] (computed statistics)
```

---

## Policy Field Details

### 1. LateBufferMinutes

**Type:** `int`  
**Default:** `120` (2 hours)  
**Range:** `0` to `1440` (0 to 24 hours)  
**Purpose:** Threshold for distinguishing Case 5 (Overtime) from Case 6 (Night Run)

#### How It Works

After the last shift of a WorkDay ends, equipment activity is categorized based on this buffer:

```
Last Shift End Time: 5:00 PM (17:00)
LateBufferMinutes: 120 (2 hours)
Buffer Expiry: 7:00 PM (19:00)

Timeline:
├─ 5:00 PM ────┤ (Shift ends)
│              │
│ [CASE 5]     │ Activity between 5:00 PM and 7:00 PM = Overtime
│              │
├─ 7:00 PM ────┤ (Buffer expires)
│              │
│ [CASE 6]     │ Activity after 7:00 PM = Night Run (Ghost Production)
│              │
└─ Midnight ───┘
```

#### Configuration Guidance

| Industry/Scenario | Recommended Value | Rationale |
|-------------------|-------------------|-----------|
| **Strict 8-hour shifts** | 60-90 minutes | Limited overtime policy, any activity beyond 90 mins is unauthorized |
| **Standard manufacturing** | 120 minutes (default) | Common overtime window, balances flexibility and control |
| **Flexible production** | 180-240 minutes | Extended overtime common, e.g., to complete large batches |
| **24/7 operations** | 0 minutes | No concept of "overtime" - all activity is either scheduled or ghost run |
| **Lights-out manufacturing** | 480+ minutes | Unmanned production can run many hours after shift end |

#### Example Scenarios

**Scenario 1: Short Buffer (60 minutes)**
```
Shift End: 5:00 PM
Activity at 5:45 PM → Case 5 (Overtime) ✓
Activity at 6:15 PM → Case 6 (Night Run) ✓
```

**Scenario 2: Long Buffer (240 minutes = 4 hours)**
```
Shift End: 5:00 PM
Activity at 7:30 PM → Case 5 (Overtime) ✓
Activity at 9:30 PM → Case 6 (Night Run) ✓
```

---

### 2. MergeCase4ToShift1

**Type:** `bool`  
**Default:** `false`  
**Purpose:** Controls how pre-shift activity (Case 4: Early Start) is attributed

#### How It Works

**When `true`:**
- Activity between `WorkDateStartTime` and `Shift 1 StartTime` is **merged** into Shift 1 performance
- OEE metrics for Shift 1 include early start runtime
- Useful for operations where early setup is part of standard Shift 1 operations

**When `false`:**
- Activity is tracked as a separate "Early Production" or "Prep Time" bucket
- OEE metrics for Shift 1 only include actual shift time
- Useful when early start is overtime or unscheduled prep work

#### Decision Matrix

| Question | If YES, set to | If NO, set to |
|----------|---------------|---------------|
| Do workers arrive early and start production as part of normal Shift 1? | `true` | `false` |
| Is early start compensated as regular shift time? | `true` | `false` |
| Do you want Shift 1 OEE to reflect early start performance? | `true` | `false` |
| Is early start optional/voluntary overtime? | `false` | `true` |
| Do you need to track early start separately for labor costing? | `false` | `true` |

#### Example Scenarios

**Scenario A: MergeCase4ToShift1 = true**

```yaml
WorkDateStartTime: 6:00 AM
Shift 1 Start: 8:00 AM
Shift 1 End: 4:00 PM

Production Timeline:
  6:30 AM - 8:00 AM: Early start (90 minutes)
  8:00 AM - 4:00 PM: Regular shift (8 hours)

Result:
  Shift 1 Duration: 9.5 hours (includes early start)
  Shift 1 OEE: Calculated over 9.5 hours
  Benefit: Recognizes early start efficiency in Shift 1 performance
```

**Scenario B: MergeCase4ToShift1 = false**

```yaml
Same timeline as above

Result:
  Early Production Bucket: 90 minutes (tracked separately)
  Shift 1 Duration: 8 hours (standard shift only)
  Shift 1 OEE: Calculated over 8 hours
  Benefit: Clearly separates standard vs. early start performance
```

---

### 3. MergeCase5ToLatest

**Type:** `bool`  
**Default:** `false`  
**Purpose:** Controls how post-shift activity (Case 5: Overtime) is attributed

#### How It Works

**When `true`:**
- Activity starting before shift end and continuing after, OR starting within `LateBufferMinutes`, is **appended** to the last shift
- OEE metrics for the last shift include overtime runtime
- Useful for completing batches or orders started during the shift

**When `false`:**
- Activity is tracked as a separate "Overtime Production" bucket
- OEE metrics for the shift only include actual scheduled shift time
- Useful for clear separation of regular vs. overtime performance

#### Decision Matrix

| Question | If YES, set to | If NO, set to |
|----------|---------------|---------------|
| Is overtime a natural extension of shift work (same crew)? | `true` | `false` |
| Do you want shift OEE to reflect completion of started work? | `true` | `false` |
| Is overtime scheduled and planned? | `true` | `false` |
| Do you need separate labor cost tracking for overtime? | `false` | `true` |
| Is overtime ad-hoc or unplanned? | `false` | `true` |

#### Example Scenarios

**Scenario A: MergeCase5ToLatest = true**

```yaml
Shift 3 Start: 10:00 PM
Shift 3 End: 6:00 AM
LateBufferMinutes: 120 (2 hours)

Production Timeline:
  10:00 PM - 6:00 AM: Regular Shift 3 (8 hours)
  6:00 AM - 7:30 AM: Overtime (90 minutes)

Result:
  Shift 3 Duration: 9.5 hours (includes overtime)
  Shift 3 OEE: Calculated over 9.5 hours
  Benefit: Recognizes crew completing their batch
```

**Scenario B: MergeCase5ToLatest = false**

```yaml
Same timeline as above

Result:
  Shift 3 Duration: 8 hours (standard shift only)
  Overtime Production: 90 minutes (tracked separately)
  Benefit: Clear separation for labor cost and efficiency analysis
```

#### Important Note: Interaction with LateBufferMinutes

**MergeCase5ToLatest only applies to Case 5 (Overtime).** Activity beyond the buffer (Case 6: Night Run) is **never merged** regardless of this setting.

```
Example with MergeCase5ToLatest = true and LateBufferMinutes = 120:

Shift End: 6:00 AM
Activity 6:30 AM → Case 5 → Merged to shift ✓
Activity 7:45 AM → Case 5 → Merged to shift ✓
Activity 8:15 AM → Case 6 → NOT merged (separate ghost production) ✗
```

---

### 4. AutoVirtualShift

**Type:** `bool`  
**Default:** `false`  
**Purpose:** Controls how weekend/holiday activity (Cases 7 & 8) is handled

#### How It Works

**When `true`:**
- Activity detected on **Sunday** (Case 7) or **Public Holiday** (Case 8) automatically generates a "Virtual Shift"
- Virtual shift has its own OEE calculation
- Enables reporting on non-standard workdays
- Useful for operations that occasionally run on weekends/holidays

**When `false`:**
- Activity is logged as "Unauthorized/Unscheduled Run"
- Not included in standard shift OEE
- Useful for flagging unexpected production for investigation

#### Decision Matrix

| Question | If YES, set to | If NO, set to |
|----------|---------------|---------------|
| Does your operation occasionally run on weekends/holidays? | `true` | `false` |
| Do you want OEE metrics for weekend/holiday production? | `true` | `false` |
| Is weekend work planned and authorized? | `true` | `false` |
| Should weekend production be flagged as unusual? | `false` | `true` |
| Do you never operate on weekends/holidays? | `false` | `true` |

#### Example Scenarios

**Scenario A: AutoVirtualShift = true**

```yaml
Date: Sunday, January 15, 2026
Activity: 8:00 AM - 4:00 PM (8 hours)

Result:
  Virtual Shift Created: "Sunday Virtual Shift"
  OEE Calculated: Yes, for this 8-hour period
  Dashboard: Shows as "Weekend Production"
  Benefit: Visibility into weekend efficiency
```

**Scenario B: AutoVirtualShift = false**

```yaml
Same timeline as above

Result:
  No Virtual Shift Created
  Activity Logged: "Unscheduled Run - Sunday"
  OEE Calculated: No
  Alert: Potential investigation required
  Benefit: Flags unexpected production
```

#### Case 7 vs. Case 8

- **Case 7 (Sunday)**: Automatically detected based on day of week
- **Case 8 (Holiday)**: Requires holiday list defined in `CalendarExceptionEntity` records

Both cases respect the `AutoVirtualShift` policy identically.

---

## Case-by-Case Configuration Impact

This section details how CalendarEntity configuration affects each of the 8 time-shift cases and their OEE computation.

### Standard Case (Normal Production)

**Trigger:** Equipment running during scheduled shift, not during break  
**Configuration Impact:** None (default behavior)  
**OEE Computation:**
- ✓ Counts toward scheduled runtime
- ✓ Included in availability calculation
- ✓ Included in performance calculation
- ✓ Included in quality calculation
- ✓ Full OEE attribution

**Example:**
```
Shift: 8:00 AM - 4:00 PM (minus 1-hour lunch)
Production: 8:30 AM - 11:30 AM (3 hours)
Result: 3 hours of standard productive time
```

---

### Case 1: Shift Loss (Downtime During Shift)

**Trigger:** Equipment stopped during scheduled shift (excluding breaks)  
**Configuration Impact:** None (automatic detection)  
**OEE Computation:**
- ✓ Scheduled runtime continues to accumulate
- ✓ Downtime increases (reduces availability)
- ✗ No output (affects performance and quality)
- 📊 **Availability = (Scheduled Time - Downtime) / Scheduled Time**

**Example:**
```
Shift: 8:00 AM - 4:00 PM (8 hours)
Downtime: 10:00 AM - 11:00 AM (1 hour)
Result: 
  Scheduled Time: 8 hours
  Downtime: 1 hour
  Available Time: 7 hours
  Availability: 87.5%
```

**Related Fields:**
- Detected based on `ShiftTemplateId` → `ShiftDefinitions`
- Respects `BreakDefinitions` (breaks are NOT Case 1)

---

### Case 2: Planned Break (Machine Stopped During Break)

**Trigger:** Equipment stopped during scheduled break period  
**Configuration Impact:** Defined via `ShiftDefinitions` → `BreakDefinitions`  
**OEE Computation:**
- ✗ NOT counted as downtime
- ✗ NOT counted in scheduled runtime
- ✓ Excluded from OEE calculation entirely
- 📊 **Break time subtracted from shift duration before OEE calculation**

**Example:**
```
Shift: 8:00 AM - 4:00 PM (8 hours)
Lunch Break: 12:00 PM - 1:00 PM (1 hour)
Machine Status: Stopped 12:00 PM - 1:00 PM

Result:
  Scheduled Time: 7 hours (8 - 1 break)
  Downtime: 0 hours
  Availability: 100% (break not penalized)
```

**Configuration:**
```csharp
new ShiftDefinition
{
    ShiftName = "Shift 1",
    StartTime = TimeSpan.FromHours(8),
    EndTime = TimeSpan.FromHours(16),
    BreakDefinitions = new List<BreakDefinition>
    {
        new() { StartTime = TimeSpan.FromHours(12), EndTime = TimeSpan.FromHours(13) }
    }
}
```

**Why This Matters:**
Without Case 2 logic, every lunch break would be counted as 1 hour of downtime, unfairly penalizing OEE. Case 2 ensures breaks are handled correctly.

---

### Case 3: Break Run (Production During Break)

**Trigger:** Equipment running during scheduled break period  
**Configuration Impact:** Defined via `ShiftDefinitions` → `BreakDefinitions`  
**OEE Computation (Current Behavior):**
- ✓ Tracked as "bonus runtime"
- ⚠️ Policy for attribution pending (Phase 4 implementation)
- 📊 **Logged for reporting but handling depends on implementation**

**Future Enhancement:** Add policy field `CountBreakRunInOee` (bool) to control whether Case 3 runtime adds to shift performance.

**Example:**
```
Shift: 8:00 AM - 4:00 PM
Lunch Break: 12:00 PM - 1:00 PM
Machine Status: Running 12:00 PM - 1:00 PM (1 hour)

Result:
  Case 3 Detected: ✓
  Logged As: "Bonus Production"
  Consider: Was labor present? Should count toward OEE?
```

**Related Questions:**
- Should Case 3 runtime count toward shift OEE?
- Does it indicate good efficiency or violation of break policy?
- Requires business rule decision (not yet in Phase 4)

---

### Case 4: Early Start (Pre-Shift Activity)

**Trigger:** Equipment activity between `WorkDateStartTime` and first shift start  
**Configuration Impact:** `MergeCase4ToShift1` + `WorkDateStartTime`  
**OEE Computation:**

**When `MergeCase4ToShift1 = true`:**
- ✓ Early start runtime **added** to Shift 1 scheduled time
- ✓ Early start output **added** to Shift 1 performance
- ✓ Shift 1 OEE includes early start
- 📊 **Shift 1 Duration = Standard Shift + Early Start Duration**

**When `MergeCase4ToShift1 = false`:**
- ✗ NOT merged to Shift 1
- ✓ Tracked as separate "Early Production" bucket
- ✓ Has its own OEE calculation (if desired)
- 📊 **Shift 1 Duration = Standard Shift Only**

**Example with Merging:**
```
WorkDateStartTime: 6:00 AM
Shift 1: 8:00 AM - 4:00 PM
Early Activity: 6:30 AM - 7:45 AM (1.25 hours)
MergeCase4ToShift1: true

Result:
  Shift 1 Duration: 9.25 hours (8 + 1.25)
  Shift 1 Output: Includes units produced 6:30-7:45 AM
  Shift 1 OEE: Reflects full 9.25-hour performance
```

**Example without Merging:**
```
Same scenario, MergeCase4ToShift1: false

Result:
  Early Production: 1.25 hours (separate bucket)
  Shift 1 Duration: 8 hours (standard)
  Reporting: Shows as two distinct production periods
```

---

### Case 5: Overtime (Post-Shift Within Buffer)

**Trigger:** Equipment activity after shift end, within `LateBufferMinutes`  
**Configuration Impact:** `MergeCase5ToLatest` + `LateBufferMinutes`  
**OEE Computation:**

**When `MergeCase5ToLatest = true`:**
- ✓ Overtime runtime **appended** to last shift scheduled time
- ✓ Overtime output **added** to last shift performance
- ✓ Last shift OEE includes overtime
- 📊 **Last Shift Duration = Standard Shift + Overtime Duration**

**When `MergeCase5ToLatest = false`:**
- ✗ NOT merged to last shift
- ✓ Tracked as separate "Overtime Production" bucket
- ✓ Has its own OEE calculation (if desired)
- 📊 **Last Shift Duration = Standard Shift Only**

**Example with Buffer:**
```
Shift 3: 10:00 PM - 6:00 AM
LateBufferMinutes: 120 (2 hours)
Activity: 6:15 AM - 7:30 AM (1.25 hours)
MergeCase5ToLatest: true

Validation:
  Time since shift end: 75 minutes
  Within buffer? Yes (75 < 120)
  Case: 5 (Overtime) ✓

Result:
  Shift 3 Duration: 9.25 hours (8 + 1.25)
  Shift 3 Output: Includes units produced 6:15-7:30 AM
  Shift 3 OEE: Reflects full 9.25-hour performance
```

**Example Outside Buffer (Case 6):**
```
Same scenario, activity 8:30 AM - 9:00 AM

Validation:
  Time since shift end: 150 minutes
  Within buffer? No (150 > 120)
  Case: 6 (Night Run) ✓

Result:
  NOT merged to Shift 3 (even if MergeCase5ToLatest = true)
  Logged as: Ghost Production / Night Run
```

---

### Case 6: Night Run (Ghost Production)

**Trigger:** Equipment activity beyond `LateBufferMinutes` from any shift  
**Configuration Impact:** `LateBufferMinutes`  
**OEE Computation:**
- ✗ NOT merged to any shift (regardless of merge policies)
- ✓ Tracked as separate "Ghost Production" or "Unscheduled Run"
- ✓ Has its own reporting bucket
- 📊 **Never affects scheduled shift OEE**

**Purpose:** Flag unexpected or lights-out production for investigation

**Example:**
```
Last Shift End: 6:00 AM
LateBufferMinutes: 120
Activity: 9:00 AM - 11:00 AM (2 hours)

Validation:
  Time since shift end: 180 minutes
  Beyond buffer? Yes (180 > 120)
  Case: 6 (Night Run) ✓

Result:
  Ghost Production: 2 hours
  Alert: "Unplanned production detected"
  Investigation: Check if authorized lights-out operation
```

**Common Causes of Case 6:**
1. Lights-out manufacturing (intentional)
2. Forgotten equipment running after shift
3. Automated processes triggered unexpectedly
4. Maintenance testing logged as production

---

### Case 7: Sunday (Weekend Production)

**Trigger:** Equipment activity on Sunday  
**Configuration Impact:** `AutoVirtualShift`  
**OEE Computation:**

**When `AutoVirtualShift = true`:**
- ✓ "Virtual Shift" automatically created
- ✓ OEE calculated for virtual shift period
- ✓ Appears in dashboards and reports as weekend production
- 📊 **Treated as a regular shift for metrics purposes**

**When `AutoVirtualShift = false`:**
- ✗ No virtual shift created
- ✓ Logged as "Unscheduled Run - Sunday"
- ✓ Flagged for investigation
- 📊 **Not included in standard OEE reporting**

**Example with Virtual Shift:**
```
Date: Sunday, January 15, 2026
Activity: 8:00 AM - 4:00 PM (8 hours)
AutoVirtualShift: true

Result:
  Virtual Shift Name: "Sunday Virtual Shift"
  Shift Duration: 8 hours
  OEE Calculated: Yes
  Dashboard View: "Weekend Production - 8 hours"
```

**Example without Virtual Shift:**
```
Same scenario, AutoVirtualShift: false

Result:
  No Shift Created
  Alert: "Unauthorized Sunday production"
  Logged: "Unscheduled Run - Investigate"
```

---

### Case 8: Holiday (Public Holiday Production)

**Trigger:** Equipment activity on date matching `CalendarExceptionEntity` with holiday flag  
**Configuration Impact:** `AutoVirtualShift` + `CalendarExceptionEntity` records  
**OEE Computation:** Identical to Case 7 (Sunday)

**Holiday Detection:**
```csharp
// Holiday must be defined in CalendarExceptionEntity
new CalendarExceptionEntity
{
    CalendarId = calendarId,
    Description = "New Year's Day",
    StartTime = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc),
    EndTime = new DateTime(2026, 1, 2, 0, 0, 0, DateTimeKind.Utc),
    IsWorkingTime = false, // Non-working day
    OverrideShiftPatternId = null // No shifts scheduled
}
```

**Example:**
```
Date: January 1, 2026 (New Year's Day)
Activity: 10:00 AM - 2:00 PM (4 hours)
AutoVirtualShift: true

Result:
  Virtual Shift Name: "Holiday Virtual Shift"
  Shift Duration: 4 hours
  OEE Calculated: Yes
  Dashboard View: "Holiday Production - 4 hours"
  Note: May flag for premium labor rate calculation
```

**Difference from Case 7:**
- Case 7 is **automatic** (every Sunday)
- Case 8 requires **explicit** holiday definition in `CalendarExceptionEntity`

---

## Configuration Examples

### Example 1: Standard Manufacturing Plant

**Operation Characteristics:**
- 3 shifts, Monday-Friday
- Minimal overtime
- No weekend work
- Strict break enforcement

**Calendar Configuration:**
```csharp
var calendar = new CalendarEntity
{
    Name = "Standard 3-Shift Calendar",
    Code = "STD_3SHIFT",
    ShiftTemplateId = standardThreeShiftTemplate,
    WorkDateStartTime = TimeSpan.FromHours(6), // 6:00 AM
    TimeOffset = TimeSpan.FromHours(7), // UTC+7
    
    // Time-Shift Policies
    LateBufferMinutes = 90,              // 1.5 hours max overtime
    MergeCase4ToShift1 = false,          // Track early start separately
    MergeCase5ToLatest = false,          // Track overtime separately
    AutoVirtualShift = false             // No weekend work expected
};
```

**Expected Behavior:**
- Case 1 (Shift Loss): Downtime during shifts reduces OEE
- Case 2 (Planned Break): Breaks excluded from OEE
- Case 4 (Early Start): Logged separately if workers arrive early
- Case 5 (Overtime): Logged separately if shifts run late (up to 90 mins)
- Case 6 (Night Run): Any activity >90 mins after shift flagged as ghost production
- Case 7/8 (Weekend/Holiday): Flagged as unauthorized

**Reporting Insights:**
- Clear separation of regular vs. overtime hours
- Alerts on any weekend/holiday activity
- Track shift efficiency without overtime inflation

---

### Example 2: Flexible Production Facility

**Operation Characteristics:**
- 2 shifts with frequent overtime to meet demand
- Occasional weekend work during peak season
- Early morning prep work is standard practice
- Overtime is part of normal operations

**Calendar Configuration:**
```csharp
var calendar = new CalendarEntity
{
    Name = "Flexible 2-Shift Calendar",
    Code = "FLEX_2SHIFT",
    ShiftTemplateId = flexibleTwoShiftTemplate,
    WorkDateStartTime = TimeSpan.FromHours(5), // 5:00 AM
    TimeOffset = TimeSpan.FromHours(-5), // UTC-5 (Eastern Time)
    
    // Time-Shift Policies
    LateBufferMinutes = 180,             // 3 hours overtime window
    MergeCase4ToShift1 = true,           // Early start is part of Shift 1
    MergeCase5ToLatest = true,           // Overtime merged to shift
    AutoVirtualShift = true              // Weekend work is normal
};
```

**Expected Behavior:**
- Case 1 (Shift Loss): Normal downtime tracking
- Case 2 (Planned Break): Breaks excluded
- Case 4 (Early Start): Merged into Shift 1 OEE (5:00-8:00 AM prep work)
- Case 5 (Overtime): Merged into last shift OEE (up to 3 hours)
- Case 6 (Night Run): Only activity >3 hours after shift flagged
- Case 7/8 (Weekend/Holiday): Virtual shifts created automatically

**Reporting Insights:**
- Shift OEE includes typical early/late activity
- Weekend production tracked with full metrics
- Clear view of total effective shift duration
- Case 6 alerts only for truly unusual activity

---

### Example 3: Lights-Out Manufacturing

**Operation Characteristics:**
- Highly automated with minimal supervision
- Equipment can run unmanned for extended periods
- No concept of "overtime" - runs until job complete
- Weekend operation depends on batch scheduling

**Calendar Configuration:**
```csharp
var calendar = new CalendarEntity
{
    Name = "Lights-Out Automation Calendar",
    Code = "LIGHTSOUT_AUTO",
    ShiftTemplateId = singleShiftTemplate, // One "supervision" shift
    WorkDateStartTime = TimeSpan.Zero, // Midnight
    TimeOffset = TimeSpan.FromHours(1), // UTC+1
    
    // Time-Shift Policies
    LateBufferMinutes = 720,             // 12-hour window (half day)
    MergeCase4ToShift1 = true,           // All activity belongs to "shift"
    MergeCase5ToLatest = true,           // Continuous operation
    AutoVirtualShift = true              // Weekend operation normal
};
```

**Expected Behavior:**
- Supervision shift: 8:00 AM - 4:00 PM (when operators present)
- Equipment can run 12 hours after supervision ends (Case 5)
- Only activity after 4:00 AM next day is Case 6 (ghost production)
- Weekend virtual shifts created for unmanned operation

**Reporting Insights:**
- Distinguishes supervised vs. lights-out operation
- Weekend automation tracked with metrics
- Very permissive buffer reflects automation capabilities

---

### Example 4: Multi-Site Enterprise

**Operation Characteristics:**
- Multiple factories with different policies
- Corporate-wide base calendar
- Site-specific overrides

**Corporate Base Calendar:**
```csharp
var corporateCalendar = new CalendarEntity
{
    Name = "Corporate Standard Calendar",
    Code = "CORP_BASE",
    ShiftTemplateId = corporateStandardTemplate,
    
    // Conservative defaults
    LateBufferMinutes = 120,
    MergeCase4ToShift1 = false,
    MergeCase5ToLatest = false,
    AutoVirtualShift = false
};
```

**Site-Specific Calendar (Inherits from Corporate):**
```csharp
var siteCalendar = new CalendarEntity
{
    Name = "Texas Plant Calendar",
    Code = "TEXAS_SITE",
    ParentCalendarId = corporateCalendar.Id, // Inheritance
    ShiftTemplateId = texasPlantTemplate,
    
    // Override corporate policies
    LateBufferMinutes = 180,        // Texas allows more overtime
    MergeCase5ToLatest = true,      // Texas merges overtime
    AutoVirtualShift = true         // Texas runs weekends
};
```

**Reporting Insights:**
- Centralized policy management with local flexibility
- Consistent case categorization across sites
- Site-specific OEE reflects local practices

---

## Best Practices

### 1. Start Conservative, Then Adjust

**Recommendation:** Begin with default settings (policies `false`, buffer `120` mins) and observe actual operations before enabling merging.

**Why:** Merging policies combine time periods that may have different efficiency characteristics. Starting conservative allows you to:
- Understand baseline shift performance
- Identify patterns in early start / overtime
- Make data-driven decisions about policy changes

**Example Workflow:**
1. **Week 1:** Deploy with defaults, observe Case 4/5 frequency
2. **Week 2:** Analyze if early start/overtime is planned or ad-hoc
3. **Week 3:** Enable merging if activity is consistent and expected
4. **Week 4:** Validate OEE metrics align with operational reality

---

### 2. Align Buffer with Labor Policy

**Recommendation:** Set `LateBufferMinutes` to match your overtime authorization window.

**Examples:**
- If supervisors can authorize up to 2 hours overtime: `LateBufferMinutes = 120`
- If no overtime is permitted: `LateBufferMinutes = 30` (flag quickly)
- If overtime requires VP approval beyond 3 hours: `LateBufferMinutes = 180`

**Rationale:** The buffer distinguishes "expected" (Case 5) from "unexpected" (Case 6) activity. Align it with your business rules for when activity transitions from normal to requiring investigation.

---

### 3. Use ParentCalendarId for Policy Inheritance

**Recommendation:** Create a base calendar with corporate policies, then create site/department-specific calendars that inherit and override as needed.

**Structure:**
```
Corporate Calendar (Base)
 ├─ North America Division Calendar
 │   ├─ Texas Plant Calendar (override overtime policy)
 │   └─ Ohio Plant Calendar (override weekend policy)
 └─ Europe Division Calendar
     ├─ Germany Plant Calendar (stricter break enforcement)
     └─ Poland Plant Calendar (24/7 shifts)
```

**Benefits:**
- Centralized policy management
- Consistency where appropriate
- Flexibility where needed

---

### 4. Document Policy Rationale

**Recommendation:** Use the `Description` field to explain **why** policies are set as they are.

**Example:**
```csharp
calendar.Description = @"
Texas Plant Calendar
- LateBufferMinutes=180: Per site policy HR-TX-2024-03, 
  supervisors can authorize up to 3 hours overtime without approval.
- MergeCase5ToLatest=true: Overtime is planned part of shift 
  to meet customer commitments (per Ops Mgr 2024-01-15).
- AutoVirtualShift=true: Saturday production common during Q4 peak season.
";
```

**Benefits:**
- Auditable decisions
- Easier onboarding of new staff
- Compliance documentation

---

### 5. Test Policy Changes in Staging

**Recommendation:** When changing policies, test in a staging/dev environment first with historical data replay.

**Why:** Policy changes can significantly affect OEE calculations. Testing ensures:
- No unexpected metric changes
- Dashboards display correctly
- Reports reflect intended behavior

**Testing Approach:**
1. Clone production calendar to staging
2. Modify policies
3. Re-run OEE computation for past week
4. Compare metrics before/after
5. If metrics align with expectations, deploy to production

---

### 6. Monitor Case Distribution

**Recommendation:** Regularly review the distribution of cases across your production.

**Healthy Distribution (typical manufacturing):**
- Standard: 75-85% (most time is normal production)
- Case 1 (Shift Loss): 5-15% (downtime happens)
- Case 2 (Planned Break): 10-15% (lunch, breaks)
- Case 4 (Early Start): 0-5% (minimal)
- Case 5 (Overtime): 0-10% (occasional)
- Case 6 (Night Run): 0-1% (rare, should investigate)
- Case 7/8 (Weekend/Holiday): 0-5% (depends on business)

**Red Flags:**
- Case 6 > 5%: Investigate unauthorized runs
- Case 5 > 20%: Overtime excessive, review planning
- Case 4 > 10%: Workers consistently arriving early, adjust shift start?
- Standard < 60%: Too much time in edge cases, review calendar config

---

### 7. Coordinate with HR and Payroll

**Recommendation:** Ensure calendar policies align with labor agreements and payroll rules.

**Key Alignments:**
- Overtime classification (Case 5) should match payroll overtime
- Weekend work (Case 7) should trigger appropriate premium pay
- Holiday work (Case 8) should flag for HR review

**Integration Point:**
Case information can be exported for payroll validation:
```sql
SELECT Date, Case, Duration, EmployeeID
WHERE Case IN (5, 7, 8) -- Overtime, Weekend, Holiday
```

---

### 8. Version Control Calendar Changes

**Recommendation:** Maintain a changelog of calendar policy modifications.

**Why:** Calendar changes affect historical OEE interpretation. Knowing when policies changed helps explain metric trends.

**Example Changelog:**
```
2026-01-15: Changed LateBufferMinutes from 120 to 180
  Reason: New overtime policy HR-2026-01
  Impact: More Case 5 (Overtime), less Case 6 (Night Run)

2026-02-01: Enabled AutoVirtualShift
  Reason: Q1 peak season weekend work authorized
  Impact: Case 7 (Sunday) now generates virtual shifts
```

---

## Integration with OEE Pipeline

### Data Flow Overview

```
┌─────────────────────┐
│  CalendarEntity     │
│  (Configuration)    │
└──────────┬──────────┘
           │
           │ Streams via
           ↓
┌─────────────────────┐
│  CalendarGrain      │
│  (Publishes Time    │
│   State to Machines)│
└──────────┬──────────┘
           │
           │ Subscribes
           ↓
┌─────────────────────┐
│  MachineGrain       │
│  (Receives Sensor   │
│   Data + Time State)│
└──────────┬──────────┘
           │
           │ Invokes
           ↓
┌─────────────────────┐
│ OeeComputePipe      │
│ (Computes OEE with  │
│  Case Awareness)    │
└──────────┬──────────┘
           │
           │ Uses
           ↓
┌─────────────────────┐
│ OeeComputePipeContext│
│ (Includes Calendar   │
│  Policies)          │
└─────────────────────┘
```

### OeeComputePipeContext Fields

The calendar policies are passed to OEE computation via these fields:

```csharp
public class OeeComputePipeContext : IResettable
{
    // ... other fields ...
    
    /// <summary>
    /// Threshold in minutes for Case 5/6 distinction
    /// </summary>
    public int LateBufferMinutes { get; set; } = 120;
    
    /// <summary>
    /// Early Start Policy (Case 4)
    /// </summary>
    public bool MergeCase4ToShift1 { get; set; }
    
    /// <summary>
    /// Post-Shift Policy (Case 5 & 6)
    /// </summary>
    public bool MergeCase5ToLatest { get; set; }
    
    /// <summary>
    /// Non-Workday Policy (Case 7 & 8)
    /// </summary>
    public bool AutoVirtualShift { get; set; }
}
```

### MachineGrain Integration

**Step 1: Subscribe to CalendarGrain Stream**

```csharp
// In MachineGrain.OnActivateAsync()
var calendarId = await GetCalendarIdForMachine();
var calendarStream = GetStreamProvider("CalendarStreamProvider")
    .GetStream<MachineTimeState>(calendarId, "TimeState");
await calendarStream.SubscribeAsync(OnCalendarTimeStateReceived);
```

**Step 2: Receive Time State with Policies**

```csharp
private Task OnCalendarTimeStateReceived(MachineTimeState timeState)
{
    // Update local state with current case and policies
    _currentTimeState = timeState;
    
    // TimeState includes:
    // - timeState.CurrentCase (TimeShiftCaseType)
    // - timeState.CalendarConfig.LateBufferMinutes
    // - timeState.CalendarConfig.MergeCase4ToShift1
    // - timeState.CalendarConfig.MergeCase5ToLatest
    // - timeState.CalendarConfig.AutoVirtualShift
    
    return Task.CompletedTask;
}
```

**Step 3: Pass to OEE Computation**

```csharp
private async Task<OeeComputePipeContext> ComputeOeeAsync()
{
    var context = new OeeComputePipeContext
    {
        // ... other configuration ...
        
        // Copy calendar policies from current time state
        LateBufferMinutes = _currentTimeState.CalendarConfig.LateBufferMinutes,
        MergeCase4ToShift1 = _currentTimeState.CalendarConfig.MergeCase4ToShift1,
        MergeCase5ToLatest = _currentTimeState.CalendarConfig.MergeCase5ToLatest,
        AutoVirtualShift = _currentTimeState.CalendarConfig.AutoVirtualShift
    };
    
    return await _oeePipeline.ExecuteAsync(context);
}
```

### CalendarGrain Responsibilities

CalendarGrain is responsible for:

1. **Time Block Generation**: Generate time blocks for each day based on `ShiftTemplateId`
2. **Case Categorization**: Categorize each time block as Standard or Case 1-8
3. **Policy Streaming**: Publish current time state with policies to subscribed machines
4. **Exception Handling**: Apply `CalendarExceptionEntity` overrides (holidays, special shifts)

**Simplified CalendarGrain Logic:**

```csharp
public class CalendarGrain : Grain, ICalendarGrain
{
    private CalendarEntity _calendar;
    private IAsyncStream<MachineTimeState> _timeStateStream;
    
    public override async Task OnActivateAsync()
    {
        _calendar = await LoadCalendarEntityAsync();
        _timeStateStream = GetStreamProvider("CalendarStreamProvider")
            .GetStream<MachineTimeState>(this.GetPrimaryKey(), "TimeState");
        
        // Start periodic publishing (e.g., every minute)
        RegisterTimer(PublishTimeState, null, TimeSpan.Zero, TimeSpan.FromMinutes(1));
    }
    
    private async Task PublishTimeState(object state)
    {
        var now = DateTime.UtcNow;
        var currentBlock = GetTimeBlockForTime(now); // Categorizes case
        
        var timeState = new MachineTimeState
        {
            CurrentTime = now,
            CurrentCase = currentBlock?.TimeShiftCase ?? TimeShiftCaseType.Standard,
            CalendarConfig = new CalendarConfiguration
            {
                LateBufferMinutes = _calendar.LateBufferMinutes,
                MergeCase4ToShift1 = _calendar.MergeCase4ToShift1,
                MergeCase5ToLatest = _calendar.MergeCase5ToLatest,
                AutoVirtualShift = _calendar.AutoVirtualShift
            }
        };
        
        await _timeStateStream.OnNextAsync(timeState);
    }
}
```

---

## Troubleshooting

### Issue 1: OEE Seems Too High

**Symptom:** OEE percentages are unexpectedly high (e.g., >95% consistently)

**Possible Causes:**
1. **Case 4/5 Merging Enabled**: Early start and overtime artificially inflating shift duration
2. **Case 2 Not Working**: Breaks counted as productive time instead of excluded

**Diagnosis:**
```sql
-- Check case distribution
SELECT TimeShiftCase, SUM(Duration) AS TotalMinutes
FROM TimeBlockCalendarStatisticEntity
WHERE CalendarId = @CalendarId AND Date BETWEEN @Start AND @End
GROUP BY TimeShiftCase;

-- Expected: Case 2 (Breaks) should be 10-15% of total
-- If Case 2 = 0%, breaks not being excluded
```

**Solutions:**
- If Case 4/5 is high: Consider setting `MergeCase4ToShift1 = false` and `MergeCase5ToLatest = false`
- If Case 2 is missing: Verify `ShiftDefinitions` include `BreakDefinitions`

---

### Issue 2: Too Many Case 6 (Night Run) Alerts

**Symptom:** Constant alerts about ghost production

**Possible Causes:**
1. **LateBufferMinutes Too Short**: Legitimate overtime categorized as Case 6
2. **Shifts Not Properly Defined**: Gaps between shifts treated as night runs

**Diagnosis:**
```csharp
// Check buffer expiration time
var lastShiftEnd = new TimeSpan(17, 0, 0); // 5:00 PM
var bufferMinutes = 120;
var bufferExpiry = lastShiftEnd.Add(TimeSpan.FromMinutes(bufferMinutes));
Console.WriteLine($"Case 6 starts after: {bufferExpiry}"); // 7:00 PM

// If activity at 6:30 PM is flagged as Case 6, buffer too short
```

**Solutions:**
- Increase `LateBufferMinutes` to match actual overtime window (e.g., 180 or 240)
- Verify shift definitions don't have large gaps

---

### Issue 3: Weekend Production Not Showing in Reports

**Symptom:** Activity on Sunday/holidays not appearing in OEE dashboards

**Possible Cause:** `AutoVirtualShift = false`

**Solution:**
```csharp
calendar.AutoVirtualShift = true; // Enable virtual shift generation
await _calendarRepository.UpdateAsync(calendar);
```

After enabling, re-run computation for past dates:
```csharp
await _mediator.SendAsync(new RecomputeTimeShiftCommand
{
    CalendarId = calendar.Id,
    StartDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-30)),
    EndDate = DateOnly.FromDateTime(DateTime.UtcNow)
});
```

---

### Issue 4: Policy Changes Not Taking Effect

**Symptom:** Changed `MergeCase5ToLatest` but OEE metrics unchanged

**Possible Causes:**
1. **CalendarGrain Not Reloaded**: Old policy cached
2. **Metrics Not Recomputed**: Historical data not updated

**Solutions:**

**Force CalendarGrain Reload:**
```csharp
var calendarGrain = GrainFactory.GetGrain<ICalendarGrain>(calendarId);
await calendarGrain.RefreshConfigurationAsync();
```

**Recompute Metrics:**
```csharp
await _mediator.SendAsync(new RecomputeTimeShiftCommand
{
    CalendarId = calendar.Id,
    StartDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-7)),
    EndDate = DateOnly.FromDateTime(DateTime.UtcNow)
});
```

---

### Issue 5: Different Sites Showing Different Metrics for Same Production

**Symptom:** Two machines with identical production show different OEE

**Possible Cause:** Machines using different calendars with different policies

**Diagnosis:**
```csharp
var machine1Calendar = await GetCalendarForMachine(machineId1);
var machine2Calendar = await GetCalendarForMachine(machineId2);

Console.WriteLine($"Machine 1 LateBuffer: {machine1Calendar.LateBufferMinutes}");
Console.WriteLine($"Machine 2 LateBuffer: {machine2Calendar.LateBufferMinutes}");
Console.WriteLine($"Machine 1 MergeCase5: {machine1Calendar.MergeCase5ToLatest}");
Console.WriteLine($"Machine 2 MergeCase5: {machine2Calendar.MergeCase5ToLatest}");
```

**Solution:**
- Ensure machines in same production area use same calendar
- Use `ParentCalendarId` for consistency across sites

---

### Issue 6: Breaks Counted as Downtime

**Symptom:** Every lunch break shows as 1 hour downtime

**Possible Cause:** Break definitions missing or not properly configured

**Diagnosis:**
```csharp
var shiftTemplate = await _shiftTemplateRepository.GetByIdAsync(calendar.ShiftTemplateId);
var shift1 = shiftTemplate.Shifts.First(s => s.ShiftName == "Shift 1");

Console.WriteLine($"Shift 1 Breaks: {shift1.BreakDefinitions.Count}");
foreach (var breakDef in shift1.BreakDefinitions)
{
    Console.WriteLine($"  Break: {breakDef.StartTime} - {breakDef.EndTime}");
}
```

**Solution:**
```csharp
// Ensure break definitions exist
shift1.BreakDefinitions.Add(new BreakDefinition
{
    StartTime = TimeSpan.FromHours(12), // 12:00 PM
    EndTime = TimeSpan.FromHours(13)    // 1:00 PM
});
await _shiftTemplateRepository.UpdateAsync(shiftTemplate);
```

---

## Summary

The CalendarEntity is the **policy control center** for time-shift case categorization in VaultForge. Through its four configuration fields—`LateBufferMinutes`, `MergeCase4ToShift1`, `MergeCase5ToLatest`, and `AutoVirtualShift`—organizations can customize how the 8 time-shift cases affect OEE calculations.

**Key Takeaways:**

1. **Flexible Configuration**: Policies adapt to different operational styles (strict shifts vs. flexible production)

2. **Case-Specific Treatment**: Each of the 8 cases can be handled according to business rules

3. **OEE Accuracy**: Proper configuration ensures OEE metrics reflect actual operational efficiency

4. **Reporting Clarity**: Case categorization provides visibility into early starts, overtime, weekend work, and ghost production

5. **Policy Inheritance**: Parent-child calendar relationships enable enterprise-wide consistency with site-specific flexibility

**Next Steps:**

- Review your organization's operational policies
- Configure calendar(s) to match business rules
- Test with historical data
- Monitor case distribution
- Adjust policies based on insights

**References:**
- [TIME_SHIFT_CASE_VALIDATION_TEST_REPORT.md](TIME_SHIFT_CASE_VALIDATION_TEST_REPORT.md) - Test results and validation status
- [TIME_SHIFT_CASE_PHASE4_GUIDE.md](TIME_SHIFT_CASE_PHASE4_GUIDE.md) - Implementation guide for developers
- [features/time-and-shifts-entities-review.md](features/time-and-shifts-entities-review.md) - Entity model review

---

**Document Maintenance:**
- This document should be updated when new policy fields are added
- Examples should reflect current default values
- Integration section should track CalendarGrain/MachineGrain changes

**Feedback:**  
Questions or suggestions about this guide? Contact the VaultForge development team or open an issue in the repository.
