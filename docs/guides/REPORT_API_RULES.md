# Report API Rules and Best Practices

## Overview

This document provides comprehensive rules and best practices for using the VaultForge Report API effectively. Following these guidelines will help you avoid common pitfalls and build efficient, maintainable reports.

---

## Critical Rules

### 1. Join Rules

#### Rule 1.1: No Duplicate Joins
**❌ WRONG - Will cause errors:**
```json
{
  "joins": [
    {
      "targetEntity": "MachineEntity",
      "joinType": "Inner",
      "sourceField": "MachineId",
      "targetField": "Id",
      "alias": "Machine"
    },
    {
      "targetEntity": "MachineEntity",
      "joinType": "Inner",
      "sourceField": "MachineId",
      "targetField": "Id",
      "alias": "Machine"
    }
  ]
}
```

**✅ CORRECT - Each join must be unique:**
```json
{
  "joins": [
    {
      "targetEntity": "MachineEntity",
      "joinType": "Inner",
      "sourceField": "MachineId",
      "targetField": "Id",
      "alias": "Machine"
    }
  ]
}
```

**Why**: Duplicate joins create redundant MongoDB pipeline stages, causing query errors or returning empty results.

**Server Response for Duplicate Joins**:
```json
{
  "isValid": false,
  "errors": [
    {
      "code": "DUPLICATE_JOIN",
      "message": "Duplicate join detected: joining 'MachineEntity' on 'MachineId' multiple times with alias 'Machine'. Each join must be unique.",
      "field": "joins"
    }
  ]
}
```

#### Rule 1.2: Unique Aliases
**❌ WRONG - Same alias for different entities:**
```json
{
  "joins": [
    {
      "targetEntity": "MachineEntity",
      "sourceField": "MachineId",
      "alias": "Related"
    },
    {
      "targetEntity": "AreaEntity",
      "sourceField": "AreaId",
      "alias": "Related"  // Same alias!
    }
  ]
}
```

**✅ CORRECT - Unique aliases:**
```json
{
  "joins": [
    {
      "targetEntity": "MachineEntity",
      "sourceField": "MachineId",
      "alias": "Machine"
    },
    {
      "targetEntity": "AreaEntity",
      "sourceField": "AreaId",
      "alias": "Area"
    }
  ]
}
```

#### Rule 1.3: Enum Values are Case-Sensitive
**❌ WRONG - Lowercase enum value:**
```json
{
  "joinType": "inner"  // Will cause error
}
```

**✅ CORRECT - Proper case:**
```json
{
  "joinType": "Inner"  // Must be capitalized
}
```

**Valid JoinType values**: `"Inner"`, `"Left"` (case-sensitive)

#### Rule 1.4: Choose the Right Join Type

| Join Type | Use When | Result Structure | Example |
|-----------|----------|------------------|---------|
| **Inner** | Relationship is required | Object | `machine.MachineType.Name` |
| **Left** | Relationship is optional | Array (may be empty) | `machine.Area[0].Name` |

**Example**:
```csharp
// Machine MUST have a type (required relationship)
new ReportJoinDto
{
    TargetEntity = "MachineTypeEntity",
    JoinType = JoinType.Inner,  // ✅ Use Inner
    SourceField = "MachineTypeId"
}

// Machine MAY have an area (optional relationship)
new ReportJoinDto
{
    TargetEntity = "AreaEntity",
    JoinType = JoinType.Left,  // ✅ Use Left
    SourceField = "AreaId"
}
```

---

### 2. Filter Rules

#### Rule 2.1: Enum Values are Case-Sensitive
**❌ WRONG:**
```json
{
  "operator": "equals",  // Lowercase
  "logicalOperator": "and"  // Lowercase
}
```

**✅ CORRECT:**
```json
{
  "operator": "Equals",  // Capitalized
  "logicalOperator": "And"  // Capitalized
}
```

**Valid FilterOperator values**: `"Equals"`, `"NotEquals"`, `"GreaterThan"`, `"GreaterThanOrEqual"`, `"LessThan"`, `"LessThanOrEqual"`, `"Contains"`, `"StartsWith"`, `"EndsWith"`, `"In"`, `"NotIn"`

**Valid LogicalOperator values**: `"And"`, `"Or"`

#### Rule 2.2: Filter Value Types Must Match Field Type

**❌ WRONG - Type mismatch:**
```json
{
  "field": "CreateTime",  // DateTime field
  "operator": "Equals",
  "value": "January 1, 2024"  // Wrong format
}
```

**✅ CORRECT - Proper ISO 8601 format:**
```json
{
  "field": "CreateTime",
  "operator": "Equals",
  "value": "2024-01-01T00:00:00Z"
}
```

**Type Guidelines**:
- **DateTime**: Use ISO 8601 format (`"2024-01-01T00:00:00Z"`)
- **Numbers**: Use numeric values (`100`, not `"100"`)
- **Boolean**: Use `true` or `false` (not strings)
- **String**: Use string values
- **ObjectId**: Use string representation

#### Rule 2.3: Combine Filters with LogicalOperator

The `logicalOperator` property connects the current filter to the **next** filter:

```csharp
Filters = new List<ReportFilterDto>
{
    new()  // Filter 1
    {
        Field = "Status",
        Operator = FilterOperator.Equals,
        Value = "Active",
        LogicalOperator = LogicalOperator.And  // Connects to Filter 2 with AND
    },
    new()  // Filter 2
    {
        Field = "IsDeleted",
        Operator = FilterOperator.Equals,
        Value = false,
        LogicalOperator = LogicalOperator.Or  // Connects to Filter 3 with OR
    },
    new()  // Filter 3
    {
        Field = "IsDraft",
        Operator = FilterOperator.Equals,
        Value = false
        // No logicalOperator needed on last filter
    }
}
```

Result: `(Status = 'Active' AND IsDeleted = false) OR IsDraft = false`

---

### 3. Field Reference Rules

#### Rule 3.1: Field Names are Case-Sensitive
```json
{
  "field": "Name"  // ✅ Correct
}
```
```json
{
  "field": "name"  // ❌ Wrong - will fail validation
}
```

#### Rule 3.2: Reference Joined Fields with Alias

**❌ WRONG - Missing alias:**
```json
{
  "joins": [
    {
      "targetEntity": "MachineTypeEntity",
      "alias": "MachineType"
    }
  ],
  "fields": [
    { "field": "Name" }  // Which Name? Source or joined?
  ]
}
```

**✅ CORRECT - Use alias:**
```json
{
  "joins": [
    {
      "targetEntity": "MachineTypeEntity",
      "alias": "MachineType"
    }
  ],
  "fields": [
    { "field": "Name" },  // Source entity field
    { "field": "MachineType.Name", "alias": "TypeName" }  // Joined entity field
  ]
}
```

#### Rule 3.3: Use Aliases for Clarity

**❌ Unclear:**
```json
{
  "fields": [
    { "field": "MachineType.Name" }
  ]
}
```

**✅ Clear:**
```json
{
  "fields": [
    { "field": "MachineType.Name", "alias": "TypeName" }
  ]
}
```

---

### 4. Aggregation Rules

#### Rule 4.1: GroupBy Required for Aggregations
**❌ WRONG - Aggregation without groupBy:**
```json
{
  "fields": [
    { "field": "Quantity", "aggregation": "Sum" }
  ]
  // Missing groupBy!
}
```

**✅ CORRECT:**
```json
{
  "fields": [
    { "field": "ProductId" },
    { "field": "Quantity", "aggregation": "Sum", "alias": "TotalQuantity" }
  ],
  "groupBy": ["ProductId"]
}
```

#### Rule 4.2: Include Non-Aggregated Fields in GroupBy

**❌ WRONG:**
```json
{
  "fields": [
    { "field": "ProductId" },
    { "field": "CategoryId" },
    { "field": "Quantity", "aggregation": "Sum" }
  ],
  "groupBy": ["ProductId"]  // Missing CategoryId!
}
```

**✅ CORRECT:**
```json
{
  "fields": [
    { "field": "ProductId" },
    { "field": "CategoryId" },
    { "field": "Quantity", "aggregation": "Sum", "alias": "TotalQuantity" }
  ],
  "groupBy": ["ProductId", "CategoryId"]  // All non-aggregated fields
}
```

#### Rule 4.3: Valid Aggregation Functions

| Function | Description | Applicable Types |
|----------|-------------|------------------|
| `Count` | Count records | All types |
| `Sum` | Sum values | Numeric types |
| `Avg` | Average values | Numeric types |
| `Min` | Minimum value | Numeric, DateTime |
| `Max` | Maximum value | Numeric, DateTime |

---

### 5. Sorting Rules

#### Rule 5.1: Sort Direction Enum Values
**Valid values**: `"Ascending"`, `"Descending"` (case-sensitive)

**❌ WRONG:**
```json
{
  "direction": "asc"  // Not a valid enum value
}
```

**✅ CORRECT:**
```json
{
  "direction": "Ascending"
}
```

#### Rule 5.2: Sort on Aggregation Results
When using aggregations, you can sort by:
1. Grouped fields
2. Aggregation aliases

```json
{
  "fields": [
    { "field": "ProductId" },
    { "field": "Quantity", "aggregation": "Sum", "alias": "TotalQuantity" }
  ],
  "groupBy": ["ProductId"],
  "sorts": [
    { "field": "TotalQuantity", "direction": "Descending" }  // Sort by alias
  ]
}
```

---

### 6. Pagination Rules

#### Rule 6.1: Page Numbers Start at 1
```json
{
  "page": 1,  // First page is 1, not 0
  "pageSize": 50
}
```

#### Rule 6.2: Reasonable Page Sizes
- **Minimum**: 1
- **Maximum**: 1000
- **Recommended**: 50-100

**❌ Too large:**
```json
{
  "pageSize": 10000  // Will be rejected
}
```

**✅ Reasonable:**
```json
{
  "pageSize": 100
}
```

---

## Validation Workflow

### Always Validate Before Executing

```csharp
// Step 1: Build query
var query = new ReportQueryDto { /* ... */ };

// Step 2: Validate
var validation = await httpClient.PostAsJsonAsync("/api/reports/query/validate", query);
var result = await validation.Content.ReadFromJsonAsync<QueryValidationResultDto>();

// Step 3: Check errors
if (!result.IsValid)
{
    foreach (var error in result.Errors)
    {
        Console.WriteLine($"[{error.Code}] {error.Message}");
        Console.WriteLine($"  Field: {error.Field}");
    }
    return;
}

// Step 4: Execute
var data = await httpClient.PostAsJsonAsync("/api/reports/query/data", query);
```

---

## Common Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| `DUPLICATE_JOIN` | Same entity joined multiple times | Remove duplicate join definitions |
| `INVALID_ENTITY_NAME` | Entity name contains invalid characters | Use valid entity names from metadata |
| `INVALID_SOURCE_ENTITY` | Source entity not found | Check available entities via `/metadata` |
| `INVALID_JOIN_ENTITY` | Join entity not found | Check available entities via `/metadata` |
| `INVALID_FIELD_NAME` | Field name invalid or not found | Verify field exists in entity metadata |
| `INVALID_OPERATOR` | Operator not supported | Use valid FilterOperator enum values |
| `TOO_MANY_FILTERS` | More than 50 filters | Reduce number of filters or split query |
| `TOO_MANY_JOINS` | More than 20 joins | Reduce number of joins or split query |
| `FILTER_VALUE_TOO_LONG` | Filter value exceeds 10000 characters | Use shorter filter values |

---

## Best Practices Summary

### ✅ DO

1. **Always validate queries** before execution
2. **Use unique aliases** for joins
3. **Use proper enum capitalization** (e.g., `"Inner"`, not `"inner"`)
4. **Include all non-aggregated fields in groupBy**
5. **Use appropriate join types** (Inner for required, Left for optional)
6. **Add field aliases** for clarity
7. **Use ISO 8601 format** for dates
8. **Cache entity metadata** to reduce API calls
9. **Handle pagination** properly for large result sets
10. **Use preview endpoint** (`/query/preview`) for testing

### ❌ DON'T

1. **Don't duplicate joins** - each join must be unique
2. **Don't use lowercase enum values** - they are case-sensitive
3. **Don't mix aggregations without groupBy** - specify groupBy fields
4. **Don't exceed query limits** - max 50 filters, 20 joins, 10 groupBy fields
5. **Don't use huge page sizes** - keep under 1000
6. **Don't skip validation** - always validate complex queries
7. **Don't assume field names** - check metadata first
8. **Don't forget field aliases** when accessing joined data
9. **Don't use string comparison operators on dates** - use proper date operators
10. **Don't ignore error messages** - they provide specific guidance

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────┐
│ REPORT API QUICK REFERENCE                                  │
├─────────────────────────────────────────────────────────────┤
│ Enum Values (Case-Sensitive):                               │
│   JoinType: "Inner", "Left"                                 │
│   FilterOperator: "Equals", "NotEquals", "Contains", etc.   │
│   LogicalOperator: "And", "Or"                              │
│   SortDirection: "Ascending", "Descending"                  │
│                                                              │
│ Limits:                                                      │
│   Filters: Max 50                                           │
│   Joins: Max 20 (each must be unique!)                      │
│   GroupBy: Max 10 fields                                    │
│   PageSize: Max 1000                                        │
│                                                              │
│ Rules:                                                       │
│   ✓ No duplicate joins                                      │
│   ✓ Unique aliases for each join                            │
│   ✓ All non-aggregated fields must be in groupBy            │
│   ✓ Field names are case-sensitive                          │
│   ✓ Always validate before executing                        │
│                                                              │
│ Endpoints:                                                   │
│   GET  /api/reports/metadata                                │
│   POST /api/reports/query/validate                          │
│   POST /api/reports/query/preview                           │
│   POST /api/reports/query/data                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Troubleshooting Guide

### Problem: Query returns no results

**Possible causes**:
1. Duplicate joins - Check for identical join definitions
2. Wrong join type - Use Inner only if relationship is required
3. Filters too restrictive - Validate filter values
4. Wrong field names - Check case sensitivity

**Solution**:
```bash
# Validate your query
POST /api/reports/query/validate

# Use preview to test
POST /api/reports/query/preview
```

### Problem: "DUPLICATE_JOIN" error

**Cause**: Same entity joined multiple times with same alias or source field

**Solution**: Remove duplicate join or use different aliases if you genuinely need multiple joins to the same entity

### Problem: Enum validation errors

**Cause**: Using lowercase enum values (`"inner"` instead of `"Inner"`)

**Solution**: Use proper capitalization for all enum values

---

**Version**: 2.0  
**Last Updated**: 2026-01-17  
**Complements**: REPORT_API_CLIENT_GUIDE.md, REPORT_API_TYPESCRIPT_GUIDE.md
