# Report Engine Query Syntax and Supported Operations

## Overview

This document provides comprehensive documentation of the VaultForge Report Engine's query syntax, supported operations, and MongoDB pipeline operations including `$lookup` and `$unwind`.

## Table of Contents

1. [Query Structure](#query-structure)
2. [Supported Filter Operators](#supported-filter-operators)
3. [Supported Aggregations](#supported-aggregations)
4. [Join Operations and $unwind](#join-operations-and-unwind)
5. [Pipeline Operation Order](#pipeline-operation-order)
6. [Query Syntax Rules](#query-syntax-rules)
7. [Operation Limits](#operation-limits)
8. [MongoDB Pipeline Translation](#mongodb-pipeline-translation)

---

## Query Structure

A complete report query consists of the following components:

```json
{
  "sourceEntity": "EntityName",      // Required: Entity to query
  "fields": [...],                   // Optional: Fields to select
  "filters": [...],                  // Optional: Filter conditions
  "joins": [...],                    // Optional: Relationships to join
  "sorts": [...],                    // Optional: Sort orders
  "groupBy": [...],                  // Optional: Group by fields
  "page": 1,                         // Optional: Page number (default: 1)
  "pageSize": 50,                    // Optional: Page size (default: 50)
  "limit": null                      // Optional: Max results (overrides pagination)
}
```

### Query Component Details

#### 1. Fields (`ReportFieldDto[]`)

```json
{
  "field": "FieldName",              // Field path (e.g., "Name" or "MachineType.Name")
  "alias": "CustomName",             // Optional: Alias for the field in results
  "aggregation": "Sum"               // Optional: Aggregation function (Sum, Avg, Count, Min, Max)
}
```

**Field Path Syntax:**
- **Simple field**: `"Name"` - Direct property of source entity
- **Joined field**: `"MachineType.Name"` - Property from joined entity (requires matching join)
- **Nested field**: `"Address.City"` - Nested object property

**Aggregation Functions:**
- Must be used with `groupBy`
- See [Supported Aggregations](#supported-aggregations) for details

#### 2. Filters (`ReportFilterDto[]`)

```json
{
  "field": "FieldName",              // Field to filter on
  "operator": "Equals",              // Comparison operator
  "value": "FilterValue",            // Value to compare against
  "logicalOperator": "And"           // Logical connector: "And" or "Or" (default: "And")
}
```

**Filter Execution:**
- Filters are applied sequentially with the specified logical operator
- First filter always uses "And" implicitly
- Subsequent filters use their `logicalOperator` to combine with previous conditions
- Translated to MongoDB `$match` stage

#### 3. Joins (`ReportJoinDto[]`)

```json
{
  "targetEntity": "EntityName",      // Entity to join
  "joinType": "Inner",               // Join type: "Inner" or "Left"
  "sourceField": "ForeignKeyField",  // Foreign key in source entity
  "targetField": "Id",               // Referenced field in target (usually "Id")
  "alias": "CustomAlias"             // Optional: Alias for joined entity
}
```

**Join Types:**
- **Inner**: Only includes records with matching foreign key (uses `$unwind`)
- **Left**: Includes all source records, null for non-matches (no `$unwind`)

#### 4. Sorts (`ReportSortDto[]`)

```json
{
  "field": "FieldName",              // Field to sort by
  "direction": "Ascending"           // Direction: "Ascending" or "Descending"
}
```

**Sort Rules:**
- Multiple sorts applied in order specified
- Can sort by source or joined fields
- Translated to MongoDB `$sort` stage

#### 5. Group By (`string[]`)

```json
"groupBy": ["Field1", "Field2"]
```

**Grouping Rules:**
- All non-aggregated fields in `fields` must be in `groupBy`
- Can group by source or joined fields
- Translated to MongoDB `$group` stage

---

## Supported Filter Operators

| Operator | Description | Example Value | MongoDB Translation |
|----------|-------------|---------------|---------------------|
| **Equals** | Exact match | `"value"` or `123` | `{ field: { $eq: value } }` |
| **NotEquals** | Not equal to | `"value"` or `123` | `{ field: { $ne: value } }` |
| **GreaterThan** | Greater than | `100` or `"2024-01-01"` | `{ field: { $gt: value } }` |
| **GreaterThanOrEqual** | Greater than or equal | `100` | `{ field: { $gte: value } }` |
| **LessThan** | Less than | `100` | `{ field: { $lt: value } }` |
| **LessThanOrEqual** | Less than or equal | `100` | `{ field: { $lte: value } }` |
| **Contains** | String contains (case-insensitive) | `"search"` | `{ field: { $regex: /search/i } }` |
| **StartsWith** | String starts with (case-insensitive) | `"prefix"` | `{ field: { $regex: /^prefix/i } }` |
| **EndsWith** | String ends with (case-insensitive) | `"suffix"` | `{ field: { $regex: /suffix$/i } }` |
| **In** | Value in list (planned) | `["val1", "val2"]` | `{ field: { $in: [values] } }` |
| **NotIn** | Value not in list (planned) | `["val1", "val2"]` | `{ field: { $nin: [values] } }` |

### Operator Usage Examples

#### Numeric Comparison
```json
{
  "field": "Price",
  "operator": "GreaterThanOrEqual",
  "value": 100.50
}
```

#### Date Range
```json
{
  "filters": [
    {
      "field": "CreateTime",
      "operator": "GreaterThanOrEqual",
      "value": "2024-01-01T00:00:00Z",
      "logicalOperator": "And"
    },
    {
      "field": "CreateTime",
      "operator": "LessThan",
      "value": "2024-12-31T23:59:59Z"
    }
  ]
}
```

#### Text Search
```json
{
  "field": "Name",
  "operator": "Contains",
  "value": "machine"
}
```

#### Boolean Check
```json
{
  "field": "IsDeleted",
  "operator": "Equals",
  "value": false
}
```

---

## Supported Aggregations

| Function | Description | Applicable Types | MongoDB Translation |
|----------|-------------|------------------|---------------------|
| **Count** | Count records | All types | `{ $sum: 1 }` |
| **Sum** | Sum of values | Numeric types | `{ $sum: "$field" }` |
| **Avg** | Average of values | Numeric types | `{ $avg: "$field" }` |
| **Min** | Minimum value | Numeric, Date | `{ $min: "$field" }` |
| **Max** | Maximum value | Numeric, Date | `{ $max: "$field" }` |

### Aggregation Usage Example

```json
{
  "sourceEntity": "MachineEntity",
  "fields": [
    { "field": "AreaId" },
    { "field": "Id", "aggregation": "Count", "alias": "MachineCount" },
    { "field": "Price", "aggregation": "Sum", "alias": "TotalPrice" },
    { "field": "Price", "aggregation": "Avg", "alias": "AvgPrice" }
  ],
  "groupBy": ["AreaId"]
}
```

**Translated to:**
```javascript
{
  $group: {
    _id: { AreaId: "$AreaId" },
    MachineCount: { $sum: 1 },
    TotalPrice: { $sum: "$Price" },
    AvgPrice: { $avg: "$Price" }
  }
}
```

---

## Join Operations and $unwind

### Understanding $lookup and $unwind

The Report Engine uses MongoDB's `$lookup` operator to perform joins. The behavior differs based on join type:

#### Inner Join (with $unwind)

**Query:**
```json
{
  "joins": [
    {
      "targetEntity": "MachineTypeEntity",
      "joinType": "Inner",
      "sourceField": "MachineTypeId",
      "targetField": "Id",
      "alias": "MachineType"
    }
  ]
}
```

**MongoDB Pipeline:**
```javascript
[
  {
    $lookup: {
      from: "MachineTypes",
      localField: "MachineTypeId",
      foreignField: "Id",
      as: "MachineType"
    }
  },
  {
    $unwind: "$MachineType"  // Converts array to object
  }
]
```

**Why $unwind?**
- `$lookup` always returns an array, even for single matches
- For **Inner joins** (many-to-one relationships), we expect a single related object
- `$unwind` "unwraps" the array to make `MachineType` an object instead of `[MachineType]`
- This allows accessing fields as `MachineType.Name` instead of `MachineType[0].Name`
- **$unwind removes documents where the array is empty** (enforcing Inner join semantics)

#### Left Join (without $unwind)

**Query:**
```json
{
  "joins": [
    {
      "targetEntity": "MachineTypeEntity",
      "joinType": "Left",
      "sourceField": "MachineTypeId",
      "targetField": "Id",
      "alias": "MachineType"
    }
  ]
}
```

**MongoDB Pipeline:**
```javascript
[
  {
    $lookup: {
      from: "MachineTypes",
      localField: "MachineTypeId",
      foreignField: "Id",
      as: "MachineType"
    }
  }
  // No $unwind - MachineType remains an array
]
```

**Why NO $unwind?**
- For **Left joins**, we want to keep all source records
- If there's no match, `MachineType` will be an empty array `[]`
- Using `$unwind` would remove these records (making it an Inner join)
- Field access uses array index: `MachineType[0].Name`

### Join Type Decision Tree

```
Is this a many-to-one relationship?
├─ Yes, and I want ALL source records
│  └─ Use "Left" join (no $unwind)
│     - Result: MachineType is array (may be empty)
│
└─ Yes, and I want ONLY records with matches
   └─ Use "Inner" join (with $unwind)
      - Result: MachineType is object (never null)
```

### Multiple Joins Example

```json
{
  "sourceEntity": "MachineEntity",
  "fields": [
    { "field": "Name" },
    { "field": "MachineType.Name", "alias": "TypeName" },
    { "field": "Area.Name", "alias": "AreaName" }
  ],
  "joins": [
    {
      "targetEntity": "MachineTypeEntity",
      "joinType": "Inner",
      "sourceField": "MachineTypeId",
      "targetField": "Id",
      "alias": "MachineType"
    },
    {
      "targetEntity": "AreaEntity",
      "joinType": "Left",
      "sourceField": "AreaId",
      "targetField": "Id",
      "alias": "Area"
    }
  ]
}
```

**Generated Pipeline:**
```javascript
[
  // Inner join - unwinds MachineType
  { $lookup: { from: "MachineTypes", localField: "MachineTypeId", foreignField: "Id", as: "MachineType" } },
  { $unwind: "$MachineType" },
  
  // Left join - keeps Area as array
  { $lookup: { from: "Areas", localField: "AreaId", foreignField: "Id", as: "Area" } }
]
```

### $unwind Behavior Summary

| Scenario | Behavior |
|----------|----------|
| **Match found** | Converts `[object]` to `object` |
| **No match (Inner join)** | **Removes the document** from results |
| **No match (Left join)** | Keeps document with `[]` (no unwind applied) |
| **Multiple matches** | Creates separate document for each match |

---

## Pipeline Operation Order

The Report Engine constructs the MongoDB aggregation pipeline in the following order:

```
1. $match     (filters) ─────────► Applied FIRST for performance
2. $lookup    (joins)
3. $unwind    (for Inner joins)
4. $group     (groupBy + aggregations)
5. $sort      (sorts)
6. $count     (for total count - separate pipeline)
7. $skip      (pagination)
8. $limit     (pagination)
9. $project   (field selection)
```

### Why This Order?

1. **$match first** - Filter early to reduce data processed by subsequent stages
2. **$lookup after $match** - Only join data for records that passed filters
3. **$unwind after $lookup** - Unwind joined arrays for Inner joins
4. **$group after joins** - Can group by fields from joined entities
5. **$sort after $group** - Sort aggregated results
6. **Pagination last** - Apply after all transformations
7. **$project last** - Select only needed fields after all processing

### Example Pipeline

**Query:**
```json
{
  "sourceEntity": "MachineEntity",
  "fields": [
    { "field": "MachineType.Name" },
    { "field": "Id", "aggregation": "Count", "alias": "Count" }
  ],
  "filters": [
    { "field": "IsDeleted", "operator": "Equals", "value": false }
  ],
  "joins": [
    {
      "targetEntity": "MachineTypeEntity",
      "joinType": "Inner",
      "sourceField": "MachineTypeId",
      "targetField": "Id"
    }
  ],
  "groupBy": ["MachineTypeId", "MachineType.Name"],
  "sorts": [{ "field": "Count", "direction": "Descending" }],
  "page": 1,
  "pageSize": 10
}
```

**Generated Pipeline:**
```javascript
[
  // 1. Filter first
  { $match: { IsDeleted: false } },
  
  // 2. Join
  { $lookup: { from: "MachineTypes", localField: "MachineTypeId", foreignField: "Id", as: "machineTypeentity" } },
  
  // 3. Unwind (Inner join)
  { $unwind: "$machineTypeentity" },
  
  // 4. Group with aggregation
  {
    $group: {
      _id: { MachineTypeId: "$MachineTypeId", Name: "$machineTypeentity.Name" },
      Count: { $sum: 1 }
    }
  },
  
  // 5. Sort
  { $sort: { Count: -1 } },
  
  // 6. Pagination
  { $skip: 0 },
  { $limit: 10 },
  
  // 7. Project fields
  {
    $project: {
      _id: 0,
      "MachineType.Name": "$_id.Name",
      Count: 1
    }
  }
]
```

---

## Query Syntax Rules

### 1. Field Naming Rules

**Valid field names:**
- Alphanumeric characters: `a-zA-Z0-9`
- Underscore: `_`
- Dot notation for nested fields: `.`

**Invalid characters:**
- Special characters: `$`, `@`, `#`, `%`, etc.
- Leading dots: `.field`
- Double dots: `field..name`
- Trailing dots: `field.`

### 2. Entity Naming Rules

**Valid entity names:**
- Must be a valid C# identifier
- PascalCase recommended (e.g., `MachineEntity`)
- Must match an existing entity inheriting from `BaseEntity`

### 3. Operator Rules

**String operators** (`Contains`, `StartsWith`, `EndsWith`):
- Only applicable to string fields
- Case-insensitive by default
- Translated to regex in MongoDB

**Numeric operators** (`GreaterThan`, `LessThan`, etc.):
- Applicable to numeric types: int, long, double, decimal
- Applicable to dates: DateTime, DateTimeOffset

**Equals/NotEquals**:
- Applicable to all types
- Supports null values

### 4. Aggregation Rules

**Required:**
- Must specify `groupBy` when using aggregations
- All non-aggregated fields must be in `groupBy`

**Example:**
```json
{
  "fields": [
    { "field": "CategoryId" },           // Must be in groupBy
    { "field": "Category.Name" },        // Must be in groupBy
    { "field": "Price", "aggregation": "Sum" }  // Aggregated
  ],
  "groupBy": ["CategoryId", "Category.Name"]
}
```

### 5. Join Rules

**Source field:**
- Must exist in the source entity
- Typically an `ObjectId` field ending with "Id"

**Target field:**
- Must exist in the target entity
- Usually "Id" (the primary key)

**Alias:**
- If not specified, defaults to lowercase target entity name
- Used to reference joined fields: `{alias}.{fieldName}`

### 6. Pagination Rules

- **Page**: Must be ≥ 1 (defaults to 1)
- **PageSize**: Must be 1-1000 (defaults to 50)
- **Limit**: Overrides pagination if specified

---

## Operation Limits

To prevent abuse and ensure system stability, the following limits are enforced:

| Operation | Maximum | Reason |
|-----------|---------|--------|
| **Filters** | 50 | Prevent overly complex queries |
| **Joins** | 20 | Limit query complexity and memory usage |
| **Group By Fields** | 10 | Prevent excessive grouping overhead |
| **Sort Fields** | 100 | Prevent excessive sorting overhead |
| **Page Size** | 1000 | Prevent memory exhaustion |
| **Field Selection** | No limit | Fields are projections only |

### Complexity Validation

The validation endpoint checks these limits **before** query execution:

```bash
POST /api/reports/query/validate
```

**Validation errors:**
- `TOO_MANY_FILTERS`: Exceeds 50 filters
- `TOO_MANY_JOINS`: Exceeds 20 joins
- `TOO_MANY_GROUPS`: Exceeds 10 group by fields
- `TOO_MANY_SORTS`: Exceeds 100 sort fields
- `INVALID_PAGE_SIZE`: Page size not in 1-1000 range

---

## MongoDB Pipeline Translation

### Complete Translation Example

**Input Query:**
```json
{
  "sourceEntity": "WorkOrderEntity",
  "fields": [
    { "field": "Product.Name", "alias": "ProductName" },
    { "field": "Quantity", "aggregation": "Sum", "alias": "TotalQty" }
  ],
  "filters": [
    { "field": "Status", "operator": "Equals", "value": "Completed" },
    { "field": "Quantity", "operator": "GreaterThan", "value": 0 }
  ],
  "joins": [
    {
      "targetEntity": "ProductEntity",
      "joinType": "Inner",
      "sourceField": "ProductId",
      "targetField": "Id",
      "alias": "Product"
    }
  ],
  "groupBy": ["ProductId", "Product.Name"],
  "sorts": [{ "field": "TotalQty", "direction": "Descending" }],
  "page": 1,
  "pageSize": 20
}
```

**Output Pipeline:**
```javascript
[
  // Stage 1: Filter
  {
    $match: {
      $and: [
        { Status: { $eq: "Completed" } },
        { Quantity: { $gt: 0 } }
      ]
    }
  },
  
  // Stage 2: Lookup (Join)
  {
    $lookup: {
      from: "Products",
      localField: "ProductId",
      foreignField: "Id",
      as: "Product"
    }
  },
  
  // Stage 3: Unwind (Inner Join)
  {
    $unwind: "$Product"
  },
  
  // Stage 4: Group with Aggregation
  {
    $group: {
      _id: {
        ProductId: "$ProductId",
        ProductName: "$Product.Name"
      },
      TotalQty: { $sum: "$Quantity" }
    }
  },
  
  // Stage 5: Sort
  {
    $sort: { TotalQty: -1 }
  },
  
  // Stage 6: Pagination - Skip
  {
    $skip: 0
  },
  
  // Stage 7: Pagination - Limit
  {
    $limit: 20
  },
  
  // Stage 8: Project
  {
    $project: {
      _id: 0,
      ProductName: "$_id.ProductName",
      TotalQty: 1
    }
  }
]
```

---

## Best Practices

### 1. Optimize Filter Placement
✅ **Good**: Filter early to reduce data
```json
{
  "filters": [{ "field": "IsDeleted", "operator": "Equals", "value": false }],
  "joins": [...]
}
```

❌ **Bad**: Joining all data then filtering
```json
{
  "joins": [...],
  "filters": [...]  // Engine still applies filters first
}
```

### 2. Use Appropriate Join Types
✅ **Good**: Use Inner for required relationships
```json
{
  "joinType": "Inner"  // Only machines WITH a type
}
```

❌ **Bad**: Left join when not needed
```json
{
  "joinType": "Left"  // Includes machines with null type
}
```

### 3. Limit Field Selection
✅ **Good**: Select only needed fields
```json
{
  "fields": [
    { "field": "Name" },
    { "field": "Code" }
  ]
}
```

❌ **Bad**: No field selection (returns all)
```json
{
  "fields": []  // Returns entire documents
}
```

### 4. Use Pagination
✅ **Good**: Reasonable page size
```json
{
  "page": 1,
  "pageSize": 50
}
```

❌ **Bad**: Large page sizes
```json
{
  "pageSize": 10000  // May cause memory issues
}
```

---

## Security Considerations

### Input Validation

All inputs are validated to prevent injection attacks:

1. **Entity names**: Must be valid C# identifiers
2. **Field names**: Alphanumeric, underscore, and dot only
3. **Operators**: Must match supported operators exactly
4. **Values**: Type-checked against field types

### Query Complexity Limits

- Maximum filters, joins, groups enforced
- Prevents DoS attacks through complex queries
- Page size capped at 1000 records

### Authentication Required

All report endpoints should be protected:
- Add `[Authorize]` attribute in production
- Implement row-level security in filters
- Validate user permissions for entities

---

## Troubleshooting

### Issue: "Field not found" error

**Cause**: Field name doesn't exist or incorrect case
**Solution**: Check entity metadata for exact field names

### Issue: Inner join returns fewer records than expected

**Cause**: `$unwind` removes records without matches
**Solution**: Use `Left` join type if you need all source records

### Issue: Joined fields return arrays instead of objects

**Cause**: Left join doesn't use `$unwind`
**Solution**: Either use Inner join or access as `Field[0].Property`

### Issue: Query is slow

**Causes**:
- Missing MongoDB indexes
- Too many joins
- Large result sets

**Solutions**:
- Add indexes on filtered/sorted fields
- Reduce number of joins
- Use pagination
- Filter early in the query

---

## Related Documentation

- [REPORT_ENGINE.md](./REPORT_ENGINE.md) - Main feature documentation
- [REPORT_ENGINE_EXAMPLES.md](./REPORT_ENGINE_EXAMPLES.md) - Query examples
- [REPORT_ENGINE_SECURITY.md](./REPORT_ENGINE_SECURITY.md) - Security guide

---

**Version**: 1.0  
**Last Updated**: 2024-12-16  
**Author**: VaultForge Report Engine Team
