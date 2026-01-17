# Report API Client Guide

## Overview

This guide explains how to use the VaultForge Report API to draft and build reports programmatically. The Report API provides a type-safe, enum-based interface for querying data with filtering, joining, aggregating, and sorting capabilities.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Understanding Enums](#understanding-enums)
3. [Building Report Queries](#building-report-queries)
4. [Filter Operations](#filter-operations)
5. [Join Operations](#join-operations)
6. [Aggregations](#aggregations)
7. [Complete Examples](#complete-examples)
8. [Best Practices](#best-practices)

---

## Quick Start

### Basic Query Structure

```csharp
using VaultForce.Shared.Dto.Reports;
using VaultForce.Shared.Enums.Reports;

var query = new ReportQueryDto
{
    SourceEntity = "MachineEntity",
    Fields = new List<ReportFieldDto>
    {
        new() { Field = "Name" },
        new() { Field = "Code" }
    },
    Page = 1,
    PageSize = 10
};

// Execute via API client
var result = await httpClient.PostAsJsonAsync("/api/reports/query/data", query);
```

### JSON Representation

```json
{
  "sourceEntity": "MachineEntity",
  "fields": [
    { "field": "Name" },
    { "field": "Code" }
  ],
  "filters": [],
  "joins": [],
  "sorts": [],
  "groupBy": [],
  "page": 1,
  "pageSize": 10
}
```

---

## Understanding Enums

### Why Enums?

The Report API now uses enums instead of strings for type safety and better IDE support. This prevents typos and provides intellisense/autocomplete.

### Available Enums

#### 1. FilterOperator

Defines comparison operations for filtering data.

```csharp
public enum FilterOperator
{
    Equals,              // Exact match
    NotEquals,           // Not equal
    GreaterThan,         // Greater than (>)
    GreaterThanOrEqual,  // Greater than or equal (>=)
    LessThan,            // Less than (<)
    LessThanOrEqual,     // Less than or equal (<=)
    Contains,            // Case-insensitive substring search
    StartsWith,          // Case-insensitive prefix search
    EndsWith,            // Case-insensitive suffix search
    In,                  // Value in list
    NotIn                // Value not in list
}
```

#### 2. LogicalOperator

Defines how to combine multiple filter conditions.

```csharp
public enum LogicalOperator
{
    And,  // Both conditions must be true
    Or    // At least one condition must be true
}
```

#### 3. JoinType

Defines how to join related entities.

```csharp
public enum JoinType
{
    Inner,  // Only records with matches in both entities
    Left    // All records from source, joined entity as array
}
```

#### 4. SortDirection

Defines sort order.

```csharp
public enum SortDirection
{
    Ascending,   // A-Z, 0-9, oldest to newest
    Descending   // Z-A, 9-0, newest to oldest
}
```

### JSON Serialization

Enums are automatically serialized as strings in JSON:

```json
{
  "operator": "Equals",
  "logicalOperator": "And",
  "joinType": "Inner",
  "direction": "Ascending"
}
```

---

## Building Report Queries

### 1. Discover Available Entities

```csharp
// Get all available entities
var entities = await httpClient.GetFromJsonAsync<List<EntityMetadataDto>>("/api/reports/metadata");

foreach (var entity in entities)
{
    Console.WriteLine($"{entity.EntityName}: {entity.DisplayName}");
    foreach (var property in entity.Properties)
    {
        Console.WriteLine($"  - {property.PropertyName} ({property.TypeName})");
    }
}
```

### 2. Check Query Capabilities

```csharp
// Get supported operations
var capabilities = await httpClient.GetFromJsonAsync<QueryCapabilitiesDto>("/api/reports/capabilities");

// Available operators
foreach (var op in capabilities.FilterOperators)
{
    Console.WriteLine($"{op.Operator}: {op.Description}");
}

// Supported join types
foreach (var join in capabilities.JoinTypes)
{
    Console.WriteLine($"{join.JoinType}: {join.Description}");
}
```

### 3. Validate Query Before Execution

```csharp
var query = new ReportQueryDto { /* ... */ };

// Validate first
var validation = await httpClient.PostAsJsonAsync("/api/reports/query/validate", query);
var result = await validation.Content.ReadFromJsonAsync<QueryValidationResultDto>();

if (!result.IsValid)
{
    foreach (var error in result.Errors)
    {
        Console.WriteLine($"Error: {error.Message}");
    }
    return;
}

// Execute if valid
var data = await httpClient.PostAsJsonAsync("/api/reports/query/data", query);
```

---

## Filter Operations

### Basic Filtering

```csharp
using VaultForce.Shared.Enums.Reports;

var query = new ReportQueryDto
{
    SourceEntity = "MachineEntity",
    Fields = new List<ReportFieldDto>
    {
        new() { Field = "Name" },
        new() { Field = "Status" }
    },
    Filters = new List<ReportFilterDto>
    {
        new()
        {
            Field = "IsDeleted",
            Operator = FilterOperator.Equals,
            Value = false
        }
    }
};
```

### Multiple Filters with AND

```csharp
Filters = new List<ReportFilterDto>
{
    new()
    {
        Field = "IsDeleted",
        Operator = FilterOperator.Equals,
        Value = false,
        LogicalOperator = LogicalOperator.And  // Combine with next filter using AND
    },
    new()
    {
        Field = "Status",
        Operator = FilterOperator.Equals,
        Value = "Active"
    }
}
```

### Multiple Filters with OR

```csharp
Filters = new List<ReportFilterDto>
{
    new()
    {
        Field = "Status",
        Operator = FilterOperator.Equals,
        Value = "Active",
        LogicalOperator = LogicalOperator.Or  // Combine with next filter using OR
    },
    new()
    {
        Field = "Status",
        Operator = FilterOperator.Equals,
        Value = "Maintenance"
    }
}
```

### Text Search

```csharp
// Contains (case-insensitive)
new ReportFilterDto
{
    Field = "Name",
    Operator = FilterOperator.Contains,
    Value = "CNC"
}

// Starts with
new ReportFilterDto
{
    Field = "Code",
    Operator = FilterOperator.StartsWith,
    Value = "M-"
}

// Ends with
new ReportFilterDto
{
    Field = "Name",
    Operator = FilterOperator.EndsWith,
    Value = "Mill"
}
```

### Numeric and Date Comparisons

```csharp
// Greater than
new ReportFilterDto
{
    Field = "Capacity",
    Operator = FilterOperator.GreaterThan,
    Value = 100
}

// Date range
Filters = new List<ReportFilterDto>
{
    new()
    {
        Field = "CreateTime",
        Operator = FilterOperator.GreaterThanOrEqual,
        Value = DateTime.Parse("2024-01-01"),
        LogicalOperator = LogicalOperator.And
    },
    new()
    {
        Field = "CreateTime",
        Operator = FilterOperator.LessThan,
        Value = DateTime.Parse("2024-12-31")
    }
}
```

### List Filters (In/NotIn)

```csharp
// Value in list
new ReportFilterDto
{
    Field = "Status",
    Operator = FilterOperator.In,
    Value = new[] { "Active", "Maintenance", "Testing" }
}

// Value not in list
new ReportFilterDto
{
    Field = "Type",
    Operator = FilterOperator.NotIn,
    Value = new[] { "Obsolete", "Decommissioned" }
}
```

---

## Join Operations

### Inner Join

Returns only records with matches in both entities. Uses `$unwind` internally.

```csharp
var query = new ReportQueryDto
{
    SourceEntity = "MachineEntity",
    Fields = new List<ReportFieldDto>
    {
        new() { Field = "Name" },
        new() { Field = "MachineType.Name", Alias = "TypeName" }
    },
    Joins = new List<ReportJoinDto>
    {
        new()
        {
            TargetEntity = "MachineTypeEntity",
            JoinType = JoinType.Inner,
            SourceField = "MachineTypeId",
            TargetField = "Id",
            Alias = "MachineType"
        }
    }
};
```

**Result Structure:**
```json
{
  "Name": "Machine 1",
  "TypeName": "CNC"
}
```

### Left Join

Returns all source records. Joined entity is an array (may be empty).

```csharp
Joins = new List<ReportJoinDto>
{
    new()
    {
        TargetEntity = "AreaEntity",
        JoinType = JoinType.Left,
        SourceField = "AreaId",
        TargetField = "Id",
        Alias = "Area"
    }
}
```

**Result Structure:**
```json
{
  "Name": "Machine 1",
  "Area": [{ "Name": "Production Floor" }]  // Array - use Area[0].Name
}
```

### Multiple Joins

```csharp
Joins = new List<ReportJoinDto>
{
    // Inner join to MachineType (required)
    new()
    {
        TargetEntity = "MachineTypeEntity",
        JoinType = JoinType.Inner,
        SourceField = "MachineTypeId",
        TargetField = "Id",
        Alias = "MachineType"
    },
    // Left join to Area (optional)
    new()
    {
        TargetEntity = "AreaEntity",
        JoinType = JoinType.Left,
        SourceField = "AreaId",
        TargetField = "Id",
        Alias = "Area"
    }
}
```

---

## Aggregations

### Count Records

```csharp
var query = new ReportQueryDto
{
    SourceEntity = "MachineEntity",
    Fields = new List<ReportFieldDto>
    {
        new() { Field = "MachineTypeId" },
        new() { Field = "Id", Aggregation = "Count", Alias = "MachineCount" }
    },
    GroupBy = new List<string> { "MachineTypeId" }
};
```

### Sum Values

```csharp
var query = new ReportQueryDto
{
    SourceEntity = "ProductEntity",
    Fields = new List<ReportFieldDto>
    {
        new() { Field = "CategoryId" },
        new() { Field = "Quantity", Aggregation = "Sum", Alias = "TotalQuantity" }
    },
    GroupBy = new List<string> { "CategoryId" }
};
```

### Average Values

```csharp
new ReportFieldDto
{
    Field = "Price",
    Aggregation = "Avg",
    Alias = "AveragePrice"
}
```

### Min/Max Values

```csharp
Fields = new List<ReportFieldDto>
{
    new() { Field = "CategoryId" },
    new() { Field = "Price", Aggregation = "Min", Alias = "MinPrice" },
    new() { Field = "Price", Aggregation = "Max", Alias = "MaxPrice" }
}
```

### Sorting Aggregated Results

```csharp
Sorts = new List<ReportSortDto>
{
    new()
    {
        Field = "TotalQuantity",
        Direction = SortDirection.Descending
    }
}
```

---

## Complete Examples

### Example 1: Active Machines by Type

```csharp
using VaultForce.Shared.Dto.Reports;
using VaultForce.Shared.Enums.Reports;

var query = new ReportQueryDto
{
    SourceEntity = "MachineEntity",
    Fields = new List<ReportFieldDto>
    {
        new() { Field = "Name" },
        new() { Field = "Code" },
        new() { Field = "MachineType.Name", Alias = "TypeName" },
        new() { Field = "Area.Name", Alias = "AreaName" }
    },
    Filters = new List<ReportFilterDto>
    {
        new()
        {
            Field = "IsDeleted",
            Operator = FilterOperator.Equals,
            Value = false,
            LogicalOperator = LogicalOperator.And
        },
        new()
        {
            Field = "Status",
            Operator = FilterOperator.Equals,
            Value = "Active"
        }
    },
    Joins = new List<ReportJoinDto>
    {
        new()
        {
            TargetEntity = "MachineTypeEntity",
            JoinType = JoinType.Inner,
            SourceField = "MachineTypeId",
            TargetField = "Id",
            Alias = "MachineType"
        },
        new()
        {
            TargetEntity = "AreaEntity",
            JoinType = JoinType.Left,
            SourceField = "AreaId",
            TargetField = "Id",
            Alias = "Area"
        }
    },
    Sorts = new List<ReportSortDto>
    {
        new()
        {
            Field = "Name",
            Direction = SortDirection.Ascending
        }
    },
    Page = 1,
    PageSize = 50
};

var result = await httpClient.PostAsJsonAsync("/api/reports/query/data", query);
```

### Example 2: Production Summary by Month

```csharp
var query = new ReportQueryDto
{
    SourceEntity = "ProductionRunEntity",
    Fields = new List<ReportFieldDto>
    {
        new() { Field = "Month" },
        new() { Field = "Product.Name", Alias = "ProductName" },
        new() { Field = "Quantity", Aggregation = "Sum", Alias = "TotalQuantity" },
        new() { Field = "Id", Aggregation = "Count", Alias = "RunCount" }
    },
    Filters = new List<ReportFilterDto>
    {
        new()
        {
            Field = "CreateTime",
            Operator = FilterOperator.GreaterThanOrEqual,
            Value = DateTime.Parse("2024-01-01"),
            LogicalOperator = LogicalOperator.And
        },
        new()
        {
            Field = "Status",
            Operator = FilterOperator.Equals,
            Value = "Completed"
        }
    },
    Joins = new List<ReportJoinDto>
    {
        new()
        {
            TargetEntity = "ProductEntity",
            JoinType = JoinType.Inner,
            SourceField = "ProductId",
            TargetField = "Id",
            Alias = "Product"
        }
    },
    GroupBy = new List<string> { "Month", "ProductId", "Product.Name" },
    Sorts = new List<ReportSortDto>
    {
        new()
        {
            Field = "Month",
            Direction = SortDirection.Descending
        },
        new()
        {
            Field = "TotalQuantity",
            Direction = SortDirection.Descending
        }
    },
    Page = 1,
    PageSize = 100
};
```

### Example 3: Text Search with Pagination

```csharp
var query = new ReportQueryDto
{
    SourceEntity = "DocumentEntity",
    Fields = new List<ReportFieldDto>
    {
        new() { Field = "Title" },
        new() { Field = "DocumentType" },
        new() { Field = "CreateTime" },
        new() { Field = "Author.DisplayName", Alias = "AuthorName" }
    },
    Filters = new List<ReportFilterDto>
    {
        new()
        {
            Field = "Title",
            Operator = FilterOperator.Contains,
            Value = "specification",
            LogicalOperator = LogicalOperator.Or
        },
        new()
        {
            Field = "Content",
            Operator = FilterOperator.Contains,
            Value = "specification"
        }
    },
    Joins = new List<ReportJoinDto>
    {
        new()
        {
            TargetEntity = "UserEntity",
            JoinType = JoinType.Inner,
            SourceField = "AuthorId",
            TargetField = "Id",
            Alias = "Author"
        }
    },
    Sorts = new List<ReportSortDto>
    {
        new()
        {
            Field = "CreateTime",
            Direction = SortDirection.Descending
        }
    },
    Page = 1,
    PageSize = 20
};
```

---

## Best Practices

### 1. Always Validate Complex Queries

```csharp
// Validate before executing
var validation = await httpClient.PostAsJsonAsync("/api/reports/query/validate", query);
var validationResult = await validation.Content.ReadFromJsonAsync<QueryValidationResultDto>();

if (!validationResult.IsValid)
{
    throw new InvalidOperationException($"Query validation failed: {string.Join(", ", validationResult.Errors.Select(e => e.Message))}");
}
```

### 2. Use Preview for Testing

```csharp
// Preview limits results to 20 records for testing
var preview = await httpClient.PostAsJsonAsync("/api/reports/query/preview", query);
```

### 3. Handle Pagination Properly

```csharp
int currentPage = 1;
bool hasMoreData = true;

while (hasMoreData)
{
    query.Page = currentPage;
    query.PageSize = 50;
    
    var result = await httpClient.PostAsJsonAsync("/api/reports/query/data", query);
    var reportResult = await result.Content.ReadFromJsonAsync<ReportResultDto>();
    
    // Process data
    ProcessData(reportResult.Data);
    
    // Check if more pages
    hasMoreData = (currentPage * query.PageSize) < reportResult.TotalCount;
    currentPage++;
}
```

### 4. Use Appropriate Join Types

**Use Inner Join when:**
- The relationship is required (many-to-one)
- You only want records with valid relationships
- Field access: `MachineType.Name`

**Use Left Join when:**
- The relationship is optional
- You need ALL source records
- Field access: `Area[0].Name` or handle empty arrays

### 5. Optimize Performance

```csharp
// 1. Filter early (reduces data before joins)
Filters = new List<ReportFilterDto>
{
    new()
    {
        Field = "CreateTime",
        Operator = FilterOperator.GreaterThan,
        Value = DateTime.Now.AddDays(-30)
    }
};

// 2. Select only needed fields
Fields = new List<ReportFieldDto>
{
    new() { Field = "Id" },
    new() { Field = "Name" }
    // Don't include fields you don't need
};

// 3. Use reasonable page sizes
PageSize = 50  // Not 1000
```

### 6. Handle Errors Gracefully

```csharp
try
{
    var result = await httpClient.PostAsJsonAsync("/api/reports/query/data", query);
    
    if (!result.IsSuccessStatusCode)
    {
        var error = await result.Content.ReadAsStringAsync();
        Console.WriteLine($"Query failed: {error}");
        return;
    }
    
    var data = await result.Content.ReadFromJsonAsync<ReportResultDto>();
    // Process data
}
catch (HttpRequestException ex)
{
    Console.WriteLine($"Network error: {ex.Message}");
}
catch (JsonException ex)
{
    Console.WriteLine($"JSON parsing error: {ex.Message}");
}
```

---

## API Endpoints Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/reports/capabilities` | GET | Get supported operations and limits |
| `/api/reports/metadata` | GET | List all available entities |
| `/api/reports/metadata/{entityName}` | GET | Get metadata for specific entity |
| `/api/reports/query/validate` | POST | Validate query before execution |
| `/api/reports/query/preview` | POST | Execute query with 20 record limit |
| `/api/reports/query/data` | POST | Execute query and get full results |
| `/api/reports/query/suggest/{entity}/{field}` | GET | Get field value suggestions |

---

## Migration from String-Based API

If you're migrating from the old string-based API:

### Before (String-based)

```csharp
new ReportFilterDto
{
    Field = "Status",
    Operator = "Equals",  // String - prone to typos
    Value = "Active",
    LogicalOperator = "And"  // String
}
```

### After (Enum-based)

```csharp
new ReportFilterDto
{
    Field = "Status",
    Operator = FilterOperator.Equals,  // Enum - type-safe
    Value = "Active",
    LogicalOperator = LogicalOperator.And  // Enum
}
```

### Benefits

- ✅ Compile-time type checking
- ✅ IntelliSense/autocomplete support
- ✅ Refactoring safety
- ✅ No typos (e.g., "Euqals" → compile error)
- ✅ Better API documentation

---

## Troubleshooting

### Issue: "Operator 'xxx' is not valid"
**Solution**: Use the enum value directly, not a string. The validator now accepts only enum values.

### Issue: "Entity not found"
**Solution**: Check available entities with GET `/api/reports/metadata`

### Issue: "Field not found"
**Solution**: Check entity metadata with GET `/api/reports/metadata/{entityName}`

### Issue: "Too many filters"
**Solution**: Reduce filters to ≤50 or split into multiple queries

### Issue: Join field access not working
**Solution**: 
- **Inner join**: Use `JoinedEntity.FieldName`
- **Left join**: Use `JoinedEntity[0].FieldName` and handle empty arrays

---

## Support

For additional help:
- Check `/api/reports/capabilities` for supported operations
- Review existing documentation in `/docs/REPORT_ENGINE_*.md`
- Contact the development team

---

**Version**: 2.0  
**Last Updated**: 2025-01-17  
**API Version**: Enum-based (v2.0)
