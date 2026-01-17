# Report API TypeScript/JavaScript Client Guide

## Overview

This guide explains how to use the VaultForge Report API from TypeScript and JavaScript applications. It covers entity discovery, understanding relationships, building queries with joins, and executing reports.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Understanding Entity Relationships](#understanding-entity-relationships)
3. [Discovering Entities and Their Connections](#discovering-entities-and-their-connections)
4. [Building Queries with Joins](#building-queries-with-joins)
5. [TypeScript Types](#typescript-types)
6. [Complete Examples](#complete-examples)
7. [Best Practices](#best-practices)

---

## Quick Start

### Installation

```bash
npm install axios  # or your preferred HTTP client
```

### Basic Setup

```typescript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/reports';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});
```

### First Query

```typescript
const query = {
  sourceEntity: 'MachineEntity',
  fields: [
    { field: 'Name' },
    { field: 'Code' }
  ],
  page: 1,
  pageSize: 10
};

const response = await apiClient.post('/query/data', query);
console.log(response.data);
```

---

## Understanding Entity Relationships

### What Are Relationships?

In VaultForge, entities are connected through **foreign key relationships**. Understanding these relationships is crucial for building effective reports that combine data from multiple entities.

### Types of Relationships

#### 1. **Many-to-One (Most Common)**

One entity references another entity by storing its ID.

**Example**: A `MachineEntity` belongs to one `MachineTypeEntity`

```typescript
// MachineEntity has:
{
  Id: "machine-123",
  Name: "CNC Machine 1",
  MachineTypeId: "type-456"  // Foreign key to MachineTypeEntity
}

// MachineTypeEntity has:
{
  Id: "type-456",
  Name: "CNC"
}
```

**Visual Representation**:
```
MachineEntity (many) ──MachineTypeId──> MachineTypeEntity (one)
```

#### 2. **One-to-Many**

The inverse of Many-to-One. One entity can be referenced by many other entities.

**Example**: One `MachineTypeEntity` can have many `MachineEntity` records

```
MachineTypeEntity (one) <──MachineTypeId── MachineEntity (many)
```

---

## Discovering Entities and Their Connections

### Step 1: Get All Available Entities

```typescript
async function getAllEntities() {
  const response = await apiClient.get('/metadata');
  return response.data;
}

// Response structure
interface EntityMetadata {
  entityName: string;
  displayName: string;
  description?: string;
  category: string;
  collectionName: string;
  properties: PropertyMetadata[];
  relationships: RelationshipMetadata[];
}
```

### Step 2: Discover Entity Relationships

```typescript
async function getEntityRelationships(entityName: string) {
  const response = await apiClient.get(`/metadata/${entityName}`);
  const metadata = response.data;
  
  // relationships array tells you how this entity connects to others
  return metadata.relationships;
}

// Example output for MachineEntity
[
  {
    sourceEntity: "MachineEntity",
    targetEntity: "MachineTypeEntity",
    foreignKeyProperty: "MachineTypeId",
    targetKeyProperty: "Id",
    relationshipType: "ManyToOne"
  },
  {
    sourceEntity: "MachineEntity",
    targetEntity: "AreaEntity",
    foreignKeyProperty: "AreaId",
    targetKeyProperty: "Id",
    relationshipType: "ManyToOne"
  }
]
```

### Step 3: Understanding Property Types

Look for properties that indicate relationships:

```typescript
interface PropertyMetadata {
  propertyName: string;
  typeName: string;           // "ObjectId" indicates a foreign key
  clrTypeName: string;
  isId: boolean;
  isForeignKey: boolean;      // True for relationship properties
  relatedEntity?: string;     // Name of the related entity
  // ... other properties
}

// Example: Finding foreign key properties
const metadata = await getEntityMetadata('MachineEntity');
const foreignKeys = metadata.properties.filter(p => p.isForeignKey);

foreignKeys.forEach(fk => {
  console.log(`${fk.propertyName} -> ${fk.relatedEntity}`);
});

// Output:
// MachineTypeId -> MachineTypeEntity
// AreaId -> AreaEntity
```

### Visual: How to Read Relationship Information

```typescript
// For MachineEntity metadata:
{
  entityName: "MachineEntity",
  properties: [
    {
      propertyName: "MachineTypeId",
      typeName: "ObjectId",
      isForeignKey: true,
      relatedEntity: "MachineTypeEntity"  // ← This tells you where it connects!
    }
  ],
  relationships: [
    {
      foreignKeyProperty: "MachineTypeId",  // ← In this entity
      targetEntity: "MachineTypeEntity",     // ← Connect to this entity
      targetKeyProperty: "Id"                // ← Using this field
    }
  ]
}
```

---

## Building Queries with Joins

### Understanding Join Syntax

When joining entities, you need to specify:
1. **targetEntity**: Which entity to join with
2. **joinType**: "Inner" or "Left"
3. **sourceField**: Foreign key in the source entity
4. **targetField**: Primary key in the target entity (usually "Id")
5. **alias**: Name to use when referencing joined data

### Join Type Decision Tree

```
Do you want ALL records from the source entity?
├─ Yes → Use "Left" join
│         Result: Joined data is an ARRAY (may be empty)
│         Access: entity.JoinedData[0].Field
│
└─ No  → Use "Inner" join
          Result: Joined data is an OBJECT
          Access: entity.JoinedData.Field
          Note: Only returns records with matches
```

### Example 1: Simple Join (Many-to-One)

**Scenario**: Get machines with their type names

```typescript
const query = {
  sourceEntity: 'MachineEntity',
  fields: [
    { field: 'Name' },
    { field: 'Code' },
    { field: 'MachineType.Name', alias: 'TypeName' }  // Access joined field
  ],
  joins: [
    {
      targetEntity: 'MachineTypeEntity',
      joinType: 'Inner',              // Only machines with a valid type
      sourceField: 'MachineTypeId',   // Foreign key in MachineEntity
      targetField: 'Id',              // Primary key in MachineTypeEntity
      alias: 'MachineType'            // Use this prefix in field names
    }
  ],
  page: 1,
  pageSize: 50
};

// Result:
[
  {
    Name: "CNC Machine 1",
    Code: "M001",
    TypeName: "CNC"
  }
]
```

### Example 2: Multiple Joins (Following Relationships)

**Scenario**: Get machines with their type AND area

```typescript
// First, discover what MachineEntity connects to:
const machineMetadata = await getEntityMetadata('MachineEntity');
console.log(machineMetadata.relationships);

// Output shows:
// - MachineTypeId -> MachineTypeEntity
// - AreaId -> AreaEntity

// Build query with both joins:
const query = {
  sourceEntity: 'MachineEntity',
  fields: [
    { field: 'Name' },
    { field: 'MachineType.Name', alias: 'TypeName' },
    { field: 'Area.Name', alias: 'AreaName' }
  ],
  joins: [
    {
      targetEntity: 'MachineTypeEntity',
      joinType: 'Inner',
      sourceField: 'MachineTypeId',
      targetField: 'Id',
      alias: 'MachineType'
    },
    {
      targetEntity: 'AreaEntity',
      joinType: 'Left',           // Some machines may not have an area
      sourceField: 'AreaId',
      targetField: 'Id',
      alias: 'Area'
    }
  ]
};

// Result:
[
  {
    Name: "CNC Machine 1",
    TypeName: "CNC",
    AreaName: "Production Floor"  // From Area join
  }
]
```

### Example 3: Chained Joins (Three-Level)

**Scenario**: Get production runs with product info and category

```typescript
// Step 1: Discover the chain
// ProductionRunEntity -> ProductEntity -> CategoryEntity

// ProductionRunEntity relationships:
// - ProductId -> ProductEntity

// ProductEntity relationships:
// - CategoryId -> CategoryEntity

// Query structure:
const query = {
  sourceEntity: 'ProductionRunEntity',
  fields: [
    { field: 'Quantity' },
    { field: 'Product.Name', alias: 'ProductName' },
    { field: 'Product.Category.Name', alias: 'CategoryName' }
  ],
  joins: [
    // First join: ProductionRun -> Product
    {
      targetEntity: 'ProductEntity',
      joinType: 'Inner',
      sourceField: 'ProductId',
      targetField: 'Id',
      alias: 'Product'
    }
    // Note: Cannot directly join to Category from ProductionRun
    // You would need to access it through Product in a separate query
    // or use the server-side relationship traversal if available
  ]
};
```

**Important**: The Report API currently supports direct joins only. For multi-level traversal, you typically join to the immediate related entity and access nested properties.

---

## TypeScript Types

### Core Types

```typescript
// Enum types (serialized as strings in JSON)
type FilterOperator = 
  | 'Equals' 
  | 'NotEquals' 
  | 'GreaterThan' 
  | 'GreaterThanOrEqual'
  | 'LessThan' 
  | 'LessThanOrEqual' 
  | 'Contains' 
  | 'StartsWith' 
  | 'EndsWith'
  | 'In' 
  | 'NotIn';

type LogicalOperator = 'And' | 'Or';
type JoinType = 'Inner' | 'Left';
type SortDirection = 'Ascending' | 'Descending';

// Query DTOs
interface ReportFilterDto {
  field: string;
  operator: FilterOperator;
  value: any;
  logicalOperator?: LogicalOperator;
}

interface ReportJoinDto {
  targetEntity: string;
  joinType: JoinType;
  sourceField: string;
  targetField: string;
  alias?: string;
}

interface ReportFieldDto {
  field: string;
  alias?: string;
  aggregation?: string;  // 'Sum', 'Avg', 'Count', 'Min', 'Max'
}

interface ReportSortDto {
  field: string;
  direction: SortDirection;
}

interface ReportQueryDto {
  sourceEntity: string;
  fields: ReportFieldDto[];
  filters?: ReportFilterDto[];
  joins?: ReportJoinDto[];
  sorts?: ReportSortDto[];
  groupBy?: string[];
  page?: number;
  pageSize?: number;
  limit?: number;
}

// Metadata types
interface EntityMetadataDto {
  entityName: string;
  displayName: string;
  description?: string;
  category: string;
  collectionName: string;
  clrTypeName: string;
  isAvailable: boolean;
  properties: PropertyMetadataDto[];
  relationships: RelationshipMetadataDto[];
}

interface PropertyMetadataDto {
  propertyName: string;
  displayName?: string;
  description?: string;
  typeName: string;
  clrTypeName: string;
  isId: boolean;
  isRequired: boolean;
  isForeignKey: boolean;
  relatedEntity?: string;
  filterable: boolean;
  sortable: boolean;
  groupable: boolean;
  aggregatable: boolean;
  format?: string;
  category?: string;
  displayOrder: number;
  hiddenByDefault: boolean;
  sampleValues?: string;
  unit?: string;
}

interface RelationshipMetadataDto {
  sourceEntity: string;
  targetEntity: string;
  foreignKeyProperty: string;
  targetKeyProperty: string;
  relationshipType: string;  // "ManyToOne", "OneToMany", etc.
  displayName?: string;
  description?: string;
  isRequired: boolean;
}

// Result types
interface ReportResultDto {
  data: any[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
```

---

## Complete Examples

### Example 1: Discovering Entity Relationships

```typescript
class ReportApiClient {
  private baseURL: string;
  
  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  // Get all entities and their categories
  async discoverEntities(): Promise<Map<string, EntityMetadataDto[]>> {
    const response = await axios.get(`${this.baseURL}/metadata`);
    const entities: EntityMetadataDto[] = response.data;
    
    // Group by category for easier navigation
    const byCategory = new Map<string, EntityMetadataDto[]>();
    entities.forEach(entity => {
      const category = entity.category || 'General';
      if (!byCategory.has(category)) {
        byCategory.set(category, []);
      }
      byCategory.get(category)!.push(entity);
    });
    
    return byCategory;
  }

  // Find all entities that an entity can join to
  async findJoinableEntities(entityName: string): Promise<RelationshipMetadataDto[]> {
    const response = await axios.get(`${this.baseURL}/metadata/${entityName}`);
    const metadata: EntityMetadataDto = response.data;
    return metadata.relationships;
  }

  // Build a visual map of relationships
  async visualizeRelationships(entityName: string): Promise<string> {
    const relationships = await this.findJoinableEntities(entityName);
    
    let diagram = `${entityName} can join to:\n`;
    relationships.forEach(rel => {
      diagram += `  ├─ ${rel.foreignKeyProperty} → ${rel.targetEntity}\n`;
      diagram += `  │  Type: ${rel.relationshipType}\n`;
      diagram += `  │  Required: ${rel.isRequired}\n`;
      diagram += `  │\n`;
    });
    
    return diagram;
  }
}

// Usage
const client = new ReportApiClient('http://localhost:5000/api/reports');

// Discover all entities
const entitiesByCategory = await client.discoverEntities();
console.log('Available categories:', Array.from(entitiesByCategory.keys()));

// See what MachineEntity can connect to
const diagram = await client.visualizeRelationships('MachineEntity');
console.log(diagram);

// Output:
// MachineEntity can join to:
//   ├─ MachineTypeId → MachineTypeEntity
//   │  Type: ManyToOne
//   │  Required: true
//   │
//   ├─ AreaId → AreaEntity
//   │  Type: ManyToOne
//   │  Required: false
//   │
```

### Example 2: Building a Query with Auto-Discovery

```typescript
class SmartQueryBuilder {
  private client: ReportApiClient;
  
  constructor(client: ReportApiClient) {
    this.client = client;
  }

  // Automatically build joins based on entity relationships
  async buildQueryWithRelationships(
    sourceEntity: string,
    relatedEntities: string[]
  ): Promise<ReportQueryDto> {
    // Get the source entity metadata
    const sourceMetadata = await this.getEntityMetadata(sourceEntity);
    
    // Build joins for each related entity
    const joins: ReportJoinDto[] = [];
    const fields: ReportFieldDto[] = [
      { field: 'Id' },
      { field: 'Name' }
    ];
    
    for (const targetEntity of relatedEntities) {
      // Find the relationship
      const relationship = sourceMetadata.relationships.find(
        r => r.targetEntity === targetEntity
      );
      
      if (!relationship) {
        throw new Error(`No relationship found between ${sourceEntity} and ${targetEntity}`);
      }
      
      // Create join
      const alias = this.generateAlias(targetEntity);
      joins.push({
        targetEntity: targetEntity,
        joinType: relationship.isRequired ? 'Inner' : 'Left',
        sourceField: relationship.foreignKeyProperty,
        targetField: relationship.targetKeyProperty,
        alias: alias
      });
      
      // Add field from joined entity
      fields.push({
        field: `${alias}.Name`,
        alias: `${alias}Name`
      });
    }
    
    return {
      sourceEntity,
      fields,
      joins,
      page: 1,
      pageSize: 50
    };
  }

  private async getEntityMetadata(entityName: string): Promise<EntityMetadataDto> {
    const response = await axios.get(`${this.client.baseURL}/metadata/${entityName}`);
    return response.data;
  }

  private generateAlias(entityName: string): string {
    // Remove "Entity" suffix and make lowercase
    return entityName.replace('Entity', '');
  }
}

// Usage
const builder = new SmartQueryBuilder(client);

// Automatically build a query that joins Machine with MachineType and Area
const query = await builder.buildQueryWithRelationships(
  'MachineEntity',
  ['MachineTypeEntity', 'AreaEntity']
);

console.log(JSON.stringify(query, null, 2));

// Execute the query
const response = await axios.post(
  'http://localhost:5000/api/reports/query/data',
  query
);
console.log(response.data);
```

### Example 3: Production Report with Aggregations

```typescript
async function buildProductionSummaryReport() {
  const query: ReportQueryDto = {
    sourceEntity: 'ProductionRunEntity',
    fields: [
      { field: 'Product.Name', alias: 'ProductName' },
      { field: 'Machine.Name', alias: 'MachineName' },
      { field: 'Quantity', aggregation: 'Sum', alias: 'TotalQuantity' },
      { field: 'Id', aggregation: 'Count', alias: 'RunCount' }
    ],
    joins: [
      {
        targetEntity: 'ProductEntity',
        joinType: 'Inner',
        sourceField: 'ProductId',
        targetField: 'Id',
        alias: 'Product'
      },
      {
        targetEntity: 'MachineEntity',
        joinType: 'Inner',
        sourceField: 'MachineId',
        targetField: 'Id',
        alias: 'Machine'
      }
    ],
    filters: [
      {
        field: 'CreateTime',
        operator: 'GreaterThanOrEqual',
        value: '2024-01-01T00:00:00Z',
        logicalOperator: 'And'
      },
      {
        field: 'Status',
        operator: 'Equals',
        value: 'Completed'
      }
    ],
    groupBy: ['ProductId', 'Product.Name', 'MachineId', 'Machine.Name'],
    sorts: [
      {
        field: 'TotalQuantity',
        direction: 'Descending'
      }
    ],
    page: 1,
    pageSize: 100
  };

  const response = await axios.post(
    'http://localhost:5000/api/reports/query/data',
    query
  );

  return response.data;
}
```

---

## Best Practices

### 1. Always Discover Relationships First

```typescript
// ❌ Bad: Guessing the relationship
const query = {
  joins: [
    {
      targetEntity: 'CategoryEntity',
      sourceField: 'Category',  // Wrong field name
      targetField: 'Id'
    }
  ]
};

// ✅ Good: Discover relationships programmatically
const metadata = await getEntityMetadata('ProductEntity');
const categoryRelationship = metadata.relationships.find(
  r => r.targetEntity === 'CategoryEntity'
);

const query = {
  joins: [
    {
      targetEntity: categoryRelationship.targetEntity,
      sourceField: categoryRelationship.foreignKeyProperty,  // Correct
      targetField: categoryRelationship.targetKeyProperty
    }
  ]
};
```

### 2. Use Proper Join Types

```typescript
// Inner join: Only records with matches (required relationships)
{
  joinType: 'Inner',  // MachineTypeId is required
  sourceField: 'MachineTypeId'
}

// Left join: All records (optional relationships)
{
  joinType: 'Left',   // AreaId is optional
  sourceField: 'AreaId'
}
```

### 3. Handle Pagination

```typescript
async function getAllResults<T>(query: ReportQueryDto): Promise<T[]> {
  const allData: T[] = [];
  let currentPage = 1;
  let hasMore = true;

  while (hasMore) {
    query.page = currentPage;
    query.pageSize = 100;

    const response = await axios.post('/query/data', query);
    const result: ReportResultDto = response.data;

    allData.push(...result.data);
    hasMore = result.hasNextPage;
    currentPage++;
  }

  return allData;
}
```

### 4. Validate Queries

```typescript
async function validateAndExecute(query: ReportQueryDto) {
  // Validate first
  const validation = await axios.post('/query/validate', query);
  
  if (!validation.data.isValid) {
    console.error('Query validation failed:');
    validation.data.errors.forEach((error: any) => {
      console.error(`- ${error.message}`);
    });
    throw new Error('Invalid query');
  }

  // Execute if valid
  return await axios.post('/query/data', query);
}
```

### 5. Cache Metadata

```typescript
class MetadataCache {
  private cache = new Map<string, EntityMetadataDto>();
  
  async getEntity(entityName: string): Promise<EntityMetadataDto> {
    if (this.cache.has(entityName)) {
      return this.cache.get(entityName)!;
    }
    
    const response = await axios.get(`/metadata/${entityName}`);
    this.cache.set(entityName, response.data);
    return response.data;
  }
  
  async getAllEntities(): Promise<EntityMetadataDto[]> {
    if (this.cache.has('__all__')) {
      return Array.from(this.cache.values());
    }
    
    const response = await axios.get('/metadata');
    response.data.forEach((entity: EntityMetadataDto) => {
      this.cache.set(entity.entityName, entity);
    });
    this.cache.set('__all__', response.data);
    return response.data;
  }
}
```

---

## API Endpoints Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/reports/metadata` | GET | Get all available entities |
| `/api/reports/metadata/{entityName}` | GET | Get specific entity metadata including relationships |
| `/api/reports/metadata/{entityName}/relationships` | GET | Get relationships for specific entity |
| `/api/reports/query/validate` | POST | Validate query before execution |
| `/api/reports/query/preview` | POST | Execute query with 20 record limit |
| `/api/reports/query/data` | POST | Execute query and get results |
| `/api/reports/capabilities` | GET | Get supported operators and join types |

---

## Common Patterns

### Pattern 1: Entity Discovery UI

```typescript
async function buildEntityExplorer() {
  const entities = await getAllEntities();
  
  // Group by category
  const categories = new Map<string, EntityMetadataDto[]>();
  entities.forEach(entity => {
    const cat = entity.category;
    if (!categories.has(cat)) {
      categories.set(cat, []);
    }
    categories.get(cat)!.push(entity);
  });
  
  // Display hierarchically
  for (const [category, categoryEntities] of categories) {
    console.log(`📁 ${category}`);
    categoryEntities.forEach(entity => {
      console.log(`  📄 ${entity.displayName}`);
      entity.relationships.forEach(rel => {
        console.log(`    🔗 Can join to ${rel.targetEntity}`);
      });
    });
  }
}
```

### Pattern 2: Relationship Graph

```typescript
interface GraphNode {
  entity: string;
  connections: string[];
}

async function buildRelationshipGraph(entityName: string): Promise<GraphNode> {
  const metadata = await getEntityMetadata(entityName);
  
  return {
    entity: entityName,
    connections: metadata.relationships.map(r => r.targetEntity)
  };
}

// Build a multi-level graph
async function buildDeepGraph(
  entityName: string, 
  depth: number = 2
): Promise<Map<string, string[]>> {
  const graph = new Map<string, string[]>();
  const visited = new Set<string>();
  
  async function traverse(entity: string, currentDepth: number) {
    if (currentDepth > depth || visited.has(entity)) return;
    
    visited.add(entity);
    const metadata = await getEntityMetadata(entity);
    const connections = metadata.relationships.map(r => r.targetEntity);
    graph.set(entity, connections);
    
    for (const connection of connections) {
      await traverse(connection, currentDepth + 1);
    }
  }
  
  await traverse(entityName, 0);
  return graph;
}
```

---

## Troubleshooting

### Issue: "Entity not found"

```typescript
// Check available entities
const entities = await axios.get('/api/reports/metadata');
console.log('Available entities:', entities.data.map((e: any) => e.entityName));
```

### Issue: "Field not found in joined entity"

```typescript
// Verify joined entity structure
const metadata = await axios.get('/api/reports/metadata/MachineTypeEntity');
console.log('Available fields:', metadata.data.properties.map((p: any) => p.propertyName));
```

### Issue: "Cannot join entities"

```typescript
// Check if relationship exists
const sourceMetadata = await axios.get('/api/reports/metadata/MachineEntity');
const hasRelationship = sourceMetadata.data.relationships.some(
  (r: any) => r.targetEntity === 'MachineTypeEntity'
);
console.log('Has relationship:', hasRelationship);
```

---

## Summary

**Key Takeaways**:

1. **Always discover relationships first** using `/metadata/{entityName}`
2. **Use the relationships array** to know which entities can be joined
3. **Choose the right join type**: Inner for required, Left for optional
4. **Access joined fields** using the alias: `alias.FieldName`
5. **Foreign keys** (properties with `isForeignKey: true`) indicate where joins are possible

**Workflow**:
1. Get all entities → Find the one you need
2. Get entity metadata → See its relationships
3. Build joins → Use relationship information
4. Execute query → Get combined data

---

**Version**: 1.0  
**Last Updated**: 2026-01-17  
**For**: TypeScript/JavaScript Clients
