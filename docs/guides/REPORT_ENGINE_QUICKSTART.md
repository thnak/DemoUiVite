# Report Engine Quick Start Guide

## Getting Started in 5 Minutes

This guide shows you how to quickly start using the VaultForge Report Engine to build queries and reports.

## Prerequisites

- VaultForge server running
- Access to the API endpoints
- Basic understanding of your domain entities

---

## Step 1: Discover What's Available (30 seconds)

### Check Supported Operations

```bash
curl http://localhost:5000/api/reports/capabilities
```

This tells you:
- What filter operators you can use
- What aggregation functions are available
- What join types are supported
- What the query limits are

**Example Response:**
```json
{
  "filterOperators": [
    { "operator": "Equals", "applicableTypes": ["String", "Int32"], ... },
    { "operator": "Contains", "applicableTypes": ["String"], ... }
  ],
  "aggregations": [
    { "function": "Sum", "applicableTypes": ["Int32", "Double"], ... }
  ],
  "joinTypes": [
    { "joinType": "Inner", "usesUnwind": true, ... }
  ]
}
```

### Get Available Entities

```bash
curl http://localhost:5000/api/reports/metadata
```

**Example Response:**
```json
{
  "value": [
    {
      "entityName": "MachineEntity",
      "displayName": "Machine",
      "category": "Production",
      "properties": [...]
    }
  ]
}
```

---

## Step 2: Build Your First Query (2 minutes)

### Simple Query: List All Machines

```bash
curl -X POST http://localhost:5000/api/reports/query/data \
  -H "Content-Type: application/json" \
  -d '{
    "sourceEntity": "MachineEntity",
    "fields": [
      { "field": "Name" },
      { "field": "Code" }
    ],
    "page": 1,
    "pageSize": 10
  }'
```

**What this does:**
- Queries the MachineEntity
- Returns Name and Code fields
- Returns first 10 results

---

## Step 3: Add Filters (1 minute)

### Query: Active Machines Only

```bash
curl -X POST http://localhost:5000/api/reports/query/data \
  -H "Content-Type: application/json" \
  -d '{
    "sourceEntity": "MachineEntity",
    "fields": [
      { "field": "Name" },
      { "field": "Code" }
    ],
    "filters": [
      {
        "field": "IsDeleted",
        "operator": "Equals",
        "value": false
      }
    ],
    "page": 1,
    "pageSize": 10
  }'
```

**What changed:**
- Added a filter for non-deleted records
- Only active machines are returned

---

## Step 4: Add a Join (1 minute)

### Query: Machines with Their Types

```bash
curl -X POST http://localhost:5000/api/reports/query/data \
  -H "Content-Type: application/json" \
  -d '{
    "sourceEntity": "MachineEntity",
    "fields": [
      { "field": "Name" },
      { "field": "MachineType.Name", "alias": "TypeName" }
    ],
    "joins": [
      {
        "targetEntity": "MachineTypeEntity",
        "joinType": "Inner",
        "sourceField": "MachineTypeId",
        "targetField": "Id",
        "alias": "MachineType"
      }
    ],
    "filters": [
      {
        "field": "IsDeleted",
        "operator": "Equals",
        "value": false
      }
    ],
    "page": 1,
    "pageSize": 10
  }'
```

**What changed:**
- Added an Inner join to MachineTypeEntity
- Now returns both Machine name and Type name
- Uses $unwind internally (automatic for Inner joins)

**Result Format:**
```json
{
  "data": [
    {
      "Name": "Machine 1",
      "TypeName": "CNC"
    },
    {
      "Name": "Machine 2",
      "TypeName": "Lathe"
    }
  ],
  "totalCount": 50,
  "page": 1,
  "pageSize": 10
}
```

---

## Common Patterns

### Pattern 1: Text Search

```json
{
  "filters": [
    {
      "field": "Name",
      "operator": "Contains",
      "value": "CNC"
    }
  ]
}
```

### Pattern 2: Date Range

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

### Pattern 3: Aggregation (Count by Type)

```json
{
  "sourceEntity": "MachineEntity",
  "fields": [
    { "field": "MachineTypeId" },
    { "field": "Id", "aggregation": "Count", "alias": "MachineCount" }
  ],
  "joins": [
    {
      "targetEntity": "MachineTypeEntity",
      "joinType": "Inner",
      "sourceField": "MachineTypeId",
      "targetField": "Id",
      "alias": "MachineType"
    }
  ],
  "groupBy": ["MachineTypeId"],
  "sorts": [
    { "field": "MachineCount", "direction": "Descending" }
  ]
}
```

---

## Validation Before Execution

Always validate complex queries first:

```bash
curl -X POST http://localhost:5000/api/reports/query/validate \
  -H "Content-Type: application/json" \
  -d '{
    "sourceEntity": "MachineEntity",
    "fields": [...],
    "filters": [...],
    "joins": [...]
  }'
```

**Response shows:**
```json
{
  "isValid": true,
  "errors": [],
  "warnings": []
}
```

Or if there are issues:
```json
{
  "isValid": false,
  "errors": [
    {
      "code": "INVALID_FIELD",
      "message": "Field 'InvalidField' not found",
      "field": "InvalidField"
    }
  ]
}
```

---

## Tips for Success

### 1. Start Simple
Begin with a simple query and add complexity incrementally:
1. Source entity only
2. Add filters
3. Add joins
4. Add aggregations
5. Add sorting

### 2. Use Preview
Test queries with preview endpoint (limits to 20 results):

```bash
POST /api/reports/query/preview
```

### 3. Check Field Suggestions
Get possible values for filter fields:

```bash
GET /api/reports/query/suggest/MachineEntity/Status?limit=50
```

Returns:
```json
{
  "field": "Status",
  "values": ["Active", "Inactive", "Maintenance"],
  "totalCount": 3,
  "isLimited": false
}
```

### 4. Understand Join Types

**Use Inner Join when:**
- ✅ You only want records WITH a match
- ✅ Field access: `MachineType.Name`
- ✅ Engine uses $unwind automatically

**Use Left Join when:**
- ✅ You want ALL source records
- ✅ Field access: `MachineType[0].Name`
- ✅ No $unwind (keeps array)

### 5. Watch Query Limits

Stay within these limits:
- Max 50 filters
- Max 20 joins
- Max 10 group by fields
- Max 1000 page size

---

## Troubleshooting

### Error: "Entity not found"
**Solution**: Check available entities with `GET /api/reports/metadata`

### Error: "Field not found"
**Solution**: Check entity metadata: `GET /api/reports/metadata/{entityName}`

### Error: "Too many filters"
**Solution**: Reduce filters to ≤50 or split query

### Error: "Invalid operator"
**Solution**: Check supported operators: `GET /api/reports/capabilities`

### Slow Query
**Solutions**:
1. Add MongoDB indexes on filtered fields
2. Reduce number of joins
3. Use smaller page sizes
4. Add more specific filters

---

## Next Steps

### Learn More
- **[REPORT_ENGINE_QUERY_SYNTAX.md](./REPORT_ENGINE_QUERY_SYNTAX.md)** - Complete syntax reference
- **[REPORT_ENGINE_PLANNING_GUIDE.md](./REPORT_ENGINE_PLANNING_GUIDE.md)** - Query planning strategies
- **[REPORT_ENGINE_EXAMPLES.md](./REPORT_ENGINE_EXAMPLES.md)** - More complex examples

### Advanced Topics
1. Multiple joins with chaining
2. Complex aggregations
3. Performance optimization
4. Custom operator combinations

---

## Quick Reference Card

### Essential Endpoints
```
GET  /api/reports/capabilities           # Discover operations
GET  /api/reports/metadata                # List entities
POST /api/reports/query/validate         # Validate query
POST /api/reports/query/preview          # Test query (limited)
POST /api/reports/query/data             # Execute query
```

### Basic Query Structure
```json
{
  "sourceEntity": "EntityName",
  "fields": [{ "field": "FieldName" }],
  "filters": [{ "field": "Field", "operator": "Equals", "value": "value" }],
  "joins": [{ "targetEntity": "Entity", "joinType": "Inner", ... }],
  "sorts": [{ "field": "Field", "direction": "Ascending" }],
  "page": 1,
  "pageSize": 50
}
```

### Common Operators
- **Equals** - Exact match
- **Contains** - Text search (case-insensitive)
- **GreaterThan** / **LessThan** - Numeric/date comparison
- **StartsWith** / **EndsWith** - Text prefix/suffix

### Common Aggregations
- **Count** - Count records
- **Sum** - Total values
- **Avg** - Average values
- **Min** / **Max** - Range values

---

**Version**: 1.0  
**Last Updated**: 2024-12-16  
**Author**: VaultForge Report Engine Team
