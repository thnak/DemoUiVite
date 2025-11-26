/**
 * API Code Generator
 *
 * This script reads the OpenAPI specification from docs/api/response.json
 * and generates TypeScript services, types, and React Query hooks.
 *
 * Usage:
 *   npx tsx scripts/generate-api.ts
 *   npm run generate:api
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

interface OpenAPISpec {
  openapi: string;
  info: { title: string; description?: string; version: string };
  paths: Record<string, PathItem>;
  components: {
    schemas: Record<string, SchemaObject>;
  };
  tags: Array<{ name: string; description?: string }>;
}

interface PathItem {
  get?: Operation;
  post?: Operation;
  put?: Operation;
  delete?: Operation;
  patch?: Operation;
}

interface Operation {
  tags?: string[];
  summary?: string;
  description?: string;
  operationId?: string;
  parameters?: Parameter[];
  requestBody?: RequestBody;
  responses: Record<string, ResponseObject>;
}

interface Parameter {
  name: string;
  in: 'path' | 'query' | 'header';
  required?: boolean;
  description?: string;
  schema: SchemaObject;
}

interface RequestBody {
  description?: string;
  required?: boolean;
  content: Record<string, { schema: SchemaObject }>;
}

interface ResponseObject {
  description: string;
  content?: Record<string, { schema: SchemaObject }>;
}

interface SchemaObject {
  type?: string;
  format?: string;
  enum?: string[];
  items?: SchemaObject;
  $ref?: string;
  properties?: Record<string, SchemaObject>;
  required?: string[];
  nullable?: boolean;
  description?: string;
  additionalProperties?: boolean | SchemaObject;
  allOf?: SchemaObject[];
  oneOf?: SchemaObject[];
  anyOf?: SchemaObject[];
}

interface GeneratedEndpoint {
  tag: string;
  operationId: string;
  method: string;
  path: string;
  summary?: string;
  description?: string;
  parameters: Parameter[];
  requestBody?: { type: string; required: boolean };
  responseType: string;
}

// ----------------------------------------------------------------------
// Utilities
// ----------------------------------------------------------------------

function toPascalCase(str: string): string {
  return str
    .replace(/[-_](.)/g, (_, char) => char.toUpperCase())
    .replace(/^./, (char) => char.toUpperCase());
}

function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

function getRefName(ref: string): string {
  return ref.split('/').pop() || '';
}

/**
 * Extract base type names from a type string (handles arrays and primitives)
 */
function extractTypeNames(typeStr: string): string[] {
  const types: string[] = [];
  // Remove array brackets and extract base type
  const baseType = typeStr.replace(/\[\]/g, '');
  // Skip primitive types and union types
  if (
    baseType !== 'string' &&
    baseType !== 'number' &&
    baseType !== 'boolean' &&
    baseType !== 'void' &&
    baseType !== 'unknown' &&
    baseType !== 'File' &&
    !baseType.includes('|') &&
    !baseType.includes('Record<') &&
    baseType.length > 0
  ) {
    types.push(baseType);
  }
  return types;
}

function resolveType(schema: SchemaObject, schemas: Record<string, SchemaObject>): string {
  if (schema.$ref) {
    return getRefName(schema.$ref);
  }

  if (schema.enum) {
    return schema.enum.map((e) => `'${e}'`).join(' | ');
  }

  switch (schema.type) {
    case 'string':
      if (schema.format === 'date-time') return 'string';
      if (schema.format === 'byte') return 'string';
      if (schema.format === 'binary') return 'File';
      return 'string';
    case 'integer':
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'array':
      if (schema.items) {
        return `${resolveType(schema.items, schemas)}[]`;
      }
      return 'unknown[]';
    case 'object':
      if (schema.additionalProperties) {
        if (typeof schema.additionalProperties === 'boolean') {
          return 'Record<string, unknown>';
        }
        return `Record<string, ${resolveType(schema.additionalProperties, schemas)}>`;
      }
      return 'Record<string, unknown>';
    default:
      return 'unknown';
  }
}

// ----------------------------------------------------------------------
// Generators
// ----------------------------------------------------------------------

function generateTypeDefinition(
  name: string,
  schema: SchemaObject,
  schemas: Record<string, SchemaObject>
): string {
  const lines: string[] = [];

  if (schema.description) {
    lines.push(`/**`);
    lines.push(` * ${schema.description}`);
    lines.push(` */`);
  }

  if (schema.enum) {
    const enumValues = schema.enum.map((e) => `'${e}'`).join(' | ');
    lines.push(`export type ${name} = ${enumValues};`);
    return lines.join('\n');
  }

  if (schema.type === 'object' || schema.properties) {
    lines.push(`export type ${name} = {`);

    if (schema.properties) {
      const requiredProps = schema.required || [];
      for (const [propName, propSchema] of Object.entries(schema.properties)) {
        const isRequired = requiredProps.includes(propName);
        const propType = resolveType(propSchema, schemas);
        const nullable = propSchema.nullable ? ' | null' : '';
        const optional = isRequired ? '' : '?';

        if (propSchema.description) {
          lines.push(`  /** ${propSchema.description} */`);
        }
        lines.push(`  ${propName}${optional}: ${propType}${nullable};`);
      }
    }

    lines.push(`};`);
    return lines.join('\n');
  }

  // Simple type alias
  const typeValue = resolveType(schema, schemas);
  lines.push(`export type ${name} = ${typeValue};`);
  return lines.join('\n');
}

function generateTypesFile(schemas: Record<string, SchemaObject>): string {
  const lines: string[] = [];

  lines.push(`// ----------------------------------------------------------------------`);
  lines.push(`// API Types`);
  lines.push(`// Auto-generated from docs/api/response.json`);
  lines.push(`// Do not edit manually - run 'npm run generate:api' to regenerate`);
  lines.push(`// ----------------------------------------------------------------------`);
  lines.push(``);

  // Generate types for each schema
  for (const [name, schema] of Object.entries(schemas)) {
    lines.push(generateTypeDefinition(name, schema, schemas));
    lines.push(``);
  }

  return lines.join('\n');
}

function generateServiceFile(tag: string, endpoints: GeneratedEndpoint[], schemas: Record<string, SchemaObject>): string {
  const lines: string[] = [];
  const serviceName = toCamelCase(tag);
  const ServiceName = toPascalCase(tag);

  // Collect unique types from request body, response, and query parameters
  const typesToImport = new Set<string>();
  for (const endpoint of endpoints) {
    if (endpoint.requestBody?.type) {
      for (const typeName of extractTypeNames(endpoint.requestBody.type)) {
        typesToImport.add(typeName);
      }
    }
    if (endpoint.responseType) {
      for (const typeName of extractTypeNames(endpoint.responseType)) {
        typesToImport.add(typeName);
      }
    }
    // Also collect types from query parameters
    for (const param of endpoint.parameters.filter((p) => p.in === 'query')) {
      const paramType = resolveType(param.schema, schemas);
      for (const typeName of extractTypeNames(paramType)) {
        typesToImport.add(typeName);
      }
    }
  }

  lines.push(`import axiosInstance from '../../axios-instance';`);
  lines.push(``);

  if (typesToImport.size > 0) {
    lines.push(`import type {`);
    for (const type of Array.from(typesToImport).sort()) {
      lines.push(`  ${type},`);
    }
    lines.push(`} from '../../types/generated';`);
    lines.push(``);
  }

  lines.push(`// ----------------------------------------------------------------------`);
  lines.push(`// ${ServiceName} Service`);
  lines.push(`// Auto-generated from docs/api/response.json`);
  lines.push(`// Do not edit manually - run 'npm run generate:api' to regenerate`);
  lines.push(`// ----------------------------------------------------------------------`);
  lines.push(``);

  // Generate endpoints object
  lines.push(`/**`);
  lines.push(` * ${ServiceName} API endpoints`);
  lines.push(` */`);
  lines.push(`export const ${ServiceName.toUpperCase()}_ENDPOINTS = {`);
  for (const endpoint of endpoints) {
    const endpointName = toCamelCase(endpoint.operationId);
    lines.push(`  ${endpointName}: '${endpoint.path}',`);
  }
  lines.push(`} as const;`);
  lines.push(``);

  // Generate service functions
  for (const endpoint of endpoints) {
    const functionName = toCamelCase(endpoint.operationId);
    const pathParams = endpoint.parameters.filter((p) => p.in === 'path');
    const queryParams = endpoint.parameters.filter((p) => p.in === 'query');

    // Build function parameters - required params first, then optional
    const params: string[] = [];

    // Path params are always required
    for (const param of pathParams) {
      const paramType = resolveType(param.schema, {});
      params.push(`${param.name}: ${paramType}`);
    }

    // Request body (typically required) comes before optional query params
    if (endpoint.requestBody) {
      params.push(`data: ${endpoint.requestBody.type}`);
    }

    // Query params are typically optional
    if (queryParams.length > 0) {
      const queryParamTypes = queryParams
        .map((p) => {
          const paramType = resolveType(p.schema, {});
          return `${p.name}${p.required ? '' : '?'}: ${paramType}`;
        })
        .join('; ');
      params.push(`params?: { ${queryParamTypes} }`);
    }

    const paramsStr = params.join(', ');
    const returnType = endpoint.responseType === 'void' ? 'void' : endpoint.responseType;

    // JSDoc
    lines.push(`/**`);
    if (endpoint.summary) {
      lines.push(` * ${endpoint.summary}`);
    }
    if (endpoint.description && endpoint.description !== endpoint.summary) {
      lines.push(` *`);
      lines.push(` * ${endpoint.description}`);
    }
    for (const param of [...pathParams, ...queryParams]) {
      if (param.description) {
        lines.push(` * @param ${param.name} - ${param.description}`);
      }
    }
    if (endpoint.requestBody) {
      lines.push(` * @param data - Request body`);
    }
    lines.push(` * @returns Promise<${returnType}>`);
    lines.push(` */`);

    // Build URL with path params
    let urlExpr = `${ServiceName.toUpperCase()}_ENDPOINTS.${toCamelCase(endpoint.operationId)}`;
    if (pathParams.length > 0) {
      urlExpr = `\`${endpoint.path.replace(/\{(\w+)\}/g, '${$1}')}\``;
    }

    // Function implementation
    lines.push(`export async function ${functionName}(${paramsStr}): Promise<${returnType}> {`);

    const method = endpoint.method.toLowerCase();
    const hasData = endpoint.requestBody;
    const hasQueryParams = queryParams.length > 0;

    // For GET and DELETE, body must be passed as config.data
    const isGetOrDelete = method === 'get' || method === 'delete';

    if (returnType === 'void') {
      if (isGetOrDelete) {
        // GET/DELETE with body uses config object
        if (hasData && hasQueryParams) {
          lines.push(`  await axiosInstance.${method}(${urlExpr}, { data, params });`);
        } else if (hasData) {
          lines.push(`  await axiosInstance.${method}(${urlExpr}, { data });`);
        } else if (hasQueryParams) {
          lines.push(`  await axiosInstance.${method}(${urlExpr}, { params });`);
        } else {
          lines.push(`  await axiosInstance.${method}(${urlExpr});`);
        }
      } else {
        // POST/PUT/PATCH with body as second argument
        if (hasData && hasQueryParams) {
          lines.push(`  await axiosInstance.${method}(${urlExpr}, data, { params });`);
        } else if (hasData) {
          lines.push(`  await axiosInstance.${method}(${urlExpr}, data);`);
        } else if (hasQueryParams) {
          lines.push(`  await axiosInstance.${method}(${urlExpr}, null, { params });`);
        } else {
          lines.push(`  await axiosInstance.${method}(${urlExpr});`);
        }
      }
    } else {
      if (isGetOrDelete) {
        // GET/DELETE with body uses config object
        if (hasData && hasQueryParams) {
          lines.push(`  const response = await axiosInstance.${method}<${returnType}>(${urlExpr}, { data, params });`);
        } else if (hasData) {
          lines.push(`  const response = await axiosInstance.${method}<${returnType}>(${urlExpr}, { data });`);
        } else if (hasQueryParams) {
          lines.push(`  const response = await axiosInstance.${method}<${returnType}>(${urlExpr}, { params });`);
        } else {
          lines.push(`  const response = await axiosInstance.${method}<${returnType}>(${urlExpr});`);
        }
      } else {
        if (hasData && hasQueryParams) {
          lines.push(`  const response = await axiosInstance.${method}<${returnType}>(${urlExpr}, data, { params });`);
        } else if (hasData) {
          lines.push(`  const response = await axiosInstance.${method}<${returnType}>(${urlExpr}, data);`);
        } else if (hasQueryParams) {
          lines.push(`  const response = await axiosInstance.${method}<${returnType}>(${urlExpr}, null, { params });`);
        } else {
          lines.push(`  const response = await axiosInstance.${method}<${returnType}>(${urlExpr});`);
        }
      }
      lines.push(`  return response.data;`);
    }

    lines.push(`}`);
    lines.push(``);
  }

  return lines.join('\n');
}

function generateHooksFile(tag: string, endpoints: GeneratedEndpoint[], schemas: Record<string, SchemaObject>): string {
  const lines: string[] = [];
  const ServiceName = toPascalCase(tag);
  const serviceName = toCamelCase(tag);

  // Collect types and functions to import
  const typesToImport = new Set<string>();
  const functionsToImport: string[] = [];

  for (const endpoint of endpoints) {
    functionsToImport.push(toCamelCase(endpoint.operationId));
    if (endpoint.requestBody?.type) {
      for (const typeName of extractTypeNames(endpoint.requestBody.type)) {
        typesToImport.add(typeName);
      }
    }
    if (endpoint.responseType) {
      for (const typeName of extractTypeNames(endpoint.responseType)) {
        typesToImport.add(typeName);
      }
    }
    // Also collect types from query parameters
    for (const param of endpoint.parameters.filter((p) => p.in === 'query')) {
      const paramType = resolveType(param.schema, schemas);
      for (const typeName of extractTypeNames(paramType)) {
        typesToImport.add(typeName);
      }
    }
  }

  // Separate queries (GET without body) from mutations (POST, PUT, DELETE, PATCH, or GET with body)
  // GET endpoints with a request body are unusual and should be treated as mutations
  const queryEndpoints = endpoints.filter((e) => e.method.toLowerCase() === 'get' && !e.requestBody);
  const mutationEndpoints = endpoints.filter((e) => e.method.toLowerCase() !== 'get' || e.requestBody);

  lines.push(`import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';`);
  lines.push(``);
  lines.push(`import { useQuery, useMutation } from '@tanstack/react-query';`);
  lines.push(``);
  lines.push(`import {`);
  for (const fn of functionsToImport.sort()) {
    lines.push(`  ${fn},`);
  }
  lines.push(`} from '../../services/generated/${toKebabCase(tag)}';`);
  lines.push(``);

  if (typesToImport.size > 0) {
    lines.push(`import type {`);
    for (const type of Array.from(typesToImport).sort()) {
      lines.push(`  ${type},`);
    }
    lines.push(`} from '../../types/generated';`);
    lines.push(``);
  }

  lines.push(`// ----------------------------------------------------------------------`);
  lines.push(`// ${ServiceName} Hooks`);
  lines.push(`// Auto-generated from docs/api/response.json`);
  lines.push(`// Do not edit manually - run 'npm run generate:api' to regenerate`);
  lines.push(`// ----------------------------------------------------------------------`);
  lines.push(``);

  // Query Keys
  lines.push(`/**`);
  lines.push(` * Query keys for ${ServiceName}`);
  lines.push(` */`);
  lines.push(`export const ${serviceName}Keys = {`);
  lines.push(`  all: ['${serviceName}'] as const,`);
  for (const endpoint of queryEndpoints) {
    const keyName = toCamelCase(endpoint.operationId);
    const pathParams = endpoint.parameters.filter((p) => p.in === 'path');
    if (pathParams.length > 0) {
      const paramTypes = pathParams.map((p) => `${p.name}: ${resolveType(p.schema, {})}`).join(', ');
      lines.push(`  ${keyName}: (${paramTypes}) => ['${serviceName}', '${keyName}', ${pathParams.map((p) => p.name).join(', ')}] as const,`);
    } else {
      lines.push(`  ${keyName}: ['${serviceName}', '${keyName}'] as const,`);
    }
  }
  lines.push(`};`);
  lines.push(``);

  // Generate query hooks
  for (const endpoint of queryEndpoints) {
    const hookName = `use${toPascalCase(endpoint.operationId)}`;
    const functionName = toCamelCase(endpoint.operationId);
    const pathParams = endpoint.parameters.filter((p) => p.in === 'path');
    const queryParams = endpoint.parameters.filter((p) => p.in === 'query');
    const returnType = endpoint.responseType === 'void' ? 'void' : endpoint.responseType;

    // Build parameters
    const hookParams: string[] = [];
    for (const param of pathParams) {
      const paramType = resolveType(param.schema, {});
      hookParams.push(`${param.name}: ${paramType}`);
    }
    if (queryParams.length > 0) {
      const queryParamTypes = queryParams
        .map((p) => {
          const paramType = resolveType(p.schema, {});
          return `${p.name}${p.required ? '' : '?'}: ${paramType}`;
        })
        .join('; ');
      hookParams.push(`params?: { ${queryParamTypes} }`);
    }
    hookParams.push(
      `options?: Omit<UseQueryOptions<${returnType}, Error>, 'queryKey' | 'queryFn'>`
    );

    // Build query key
    let queryKey: string;
    if (pathParams.length > 0) {
      queryKey = `${serviceName}Keys.${functionName}(${pathParams.map((p) => p.name).join(', ')})`;
    } else {
      queryKey = `${serviceName}Keys.${functionName}`;
    }

    // Build query function call
    const callParams: string[] = [...pathParams.map((p) => p.name)];
    if (queryParams.length > 0) {
      callParams.push('params');
    }

    lines.push(`/**`);
    if (endpoint.summary) {
      lines.push(` * ${endpoint.summary}`);
    }
    lines.push(` */`);
    lines.push(`export function ${hookName}(`);
    for (let i = 0; i < hookParams.length; i++) {
      lines.push(`  ${hookParams[i]}${i < hookParams.length - 1 ? ',' : ''}`);
    }
    lines.push(`) {`);
    lines.push(`  return useQuery({`);
    lines.push(`    queryKey: ${queryKey},`);
    lines.push(`    queryFn: () => ${functionName}(${callParams.join(', ')}),`);
    lines.push(`    ...options,`);
    lines.push(`  });`);
    lines.push(`}`);
    lines.push(``);
  }

  // Generate mutation hooks
  for (const endpoint of mutationEndpoints) {
    const hookName = `use${toPascalCase(endpoint.operationId)}`;
    const functionName = toCamelCase(endpoint.operationId);
    const pathParams = endpoint.parameters.filter((p) => p.in === 'path');
    const queryParams = endpoint.parameters.filter((p) => p.in === 'query');
    const returnType = endpoint.responseType === 'void' ? 'void' : endpoint.responseType;

    // Build mutation variables type - maintain same order as function params
    const variableTypes: string[] = [];
    for (const param of pathParams) {
      variableTypes.push(`${param.name}: ${resolveType(param.schema, {})}`);
    }
    // Data comes before optional query params (same as service function)
    if (endpoint.requestBody) {
      variableTypes.push(`data: ${endpoint.requestBody.type}`);
    }
    if (queryParams.length > 0) {
      const queryParamTypes = queryParams
        .map((p) => {
          const paramType = resolveType(p.schema, {});
          return `${p.name}${p.required ? '' : '?'}: ${paramType}`;
        })
        .join('; ');
      variableTypes.push(`params?: { ${queryParamTypes} }`);
    }

    const variablesType =
      variableTypes.length > 0 ? `{ ${variableTypes.join('; ')} }` : 'void';

    lines.push(`/**`);
    if (endpoint.summary) {
      lines.push(` * ${endpoint.summary}`);
    }
    lines.push(` */`);
    lines.push(`export function ${hookName}(`);
    lines.push(`  options?: Omit<UseMutationOptions<${returnType}, Error, ${variablesType}>, 'mutationFn'>`);
    lines.push(`) {`);
    lines.push(`  return useMutation({`);

    if (variablesType === 'void') {
      lines.push(`    mutationFn: ${functionName},`);
    } else {
      const fnParams: string[] = [];
      for (const param of pathParams) {
        fnParams.push(`variables.${param.name}`);
      }
      // Data comes before optional query params (same as service function)
      if (endpoint.requestBody) {
        fnParams.push('variables.data');
      }
      if (queryParams.length > 0) {
        fnParams.push('variables.params');
      }
      lines.push(`    mutationFn: (variables: ${variablesType}) => ${functionName}(${fnParams.join(', ')}),`);
    }

    lines.push(`    ...options,`);
    lines.push(`  });`);
    lines.push(`}`);
    lines.push(``);
  }

  return lines.join('\n');
}

function generateIndexFiles(tags: string[]): { services: string; hooks: string; types: string } {
  const servicesIndex = tags
    .map((tag) => `export * from './generated/${toKebabCase(tag)}';`)
    .join('\n');

  const hooksIndex = tags
    .map((tag) => `export * from './generated/use-${toKebabCase(tag)}';`)
    .join('\n');

  const typesIndex = `export * from './generated';\n`;

  return { services: servicesIndex, hooks: hooksIndex, types: typesIndex };
}

// ----------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------

async function main() {
  console.log('🚀 API Code Generator');
  console.log('=====================\n');

  // Read OpenAPI spec
  const specPath = path.resolve(__dirname, '../docs/api/response.json');
  console.log(`📖 Reading OpenAPI spec from: ${specPath}`);

  if (!fs.existsSync(specPath)) {
    console.error('❌ OpenAPI spec not found at:', specPath);
    process.exit(1);
  }

  const specContent = fs.readFileSync(specPath, 'utf-8');
  const spec: OpenAPISpec = JSON.parse(specContent);

  console.log(`   Title: ${spec.info.title}`);
  console.log(`   Version: ${spec.info.version}`);
  console.log(`   Tags: ${spec.tags.length}`);
  console.log(`   Paths: ${Object.keys(spec.paths).length}`);
  console.log(`   Schemas: ${Object.keys(spec.components.schemas).length}\n`);

  // Parse endpoints by tag
  const endpointsByTag: Record<string, GeneratedEndpoint[]> = {};

  for (const [pathUrl, pathItem] of Object.entries(spec.paths)) {
    for (const [method, operation] of Object.entries(pathItem)) {
      if (!operation || typeof operation !== 'object') continue;

      const op = operation as Operation;
      const tag = op.tags?.[0] || 'Default';
      const operationId = op.operationId || `${method}${pathUrl.replace(/[^a-zA-Z0-9]/g, '')}`;

      // Determine response type
      let responseType = 'void';
      const successResponse = op.responses['200'] || op.responses['201'];
      if (successResponse?.content?.['application/json']?.schema) {
        responseType = resolveType(successResponse.content['application/json'].schema, spec.components.schemas);
      }

      // Determine request body type
      let requestBody: { type: string; required: boolean } | undefined;
      if (op.requestBody?.content?.['application/json']?.schema) {
        requestBody = {
          type: resolveType(op.requestBody.content['application/json'].schema, spec.components.schemas),
          required: op.requestBody.required || false,
        };
      }

      const endpoint: GeneratedEndpoint = {
        tag,
        operationId,
        method: method.toUpperCase(),
        path: pathUrl,
        summary: op.summary,
        description: op.description,
        parameters: op.parameters || [],
        requestBody,
        responseType,
      };

      if (!endpointsByTag[tag]) {
        endpointsByTag[tag] = [];
      }
      endpointsByTag[tag].push(endpoint);
    }
  }

  // Generate for all tags from the OpenAPI spec, excluding 'Auth' which has a manually maintained service
  const excludedTags = ['Auth'];
  const filteredTags = Object.keys(endpointsByTag)
    .filter((tag) => !excludedTags.includes(tag))
    .sort();

  console.log(`📝 Generating code for ${filteredTags.length} tags:\n`);

  // Create output directories
  const outputBase = path.resolve(__dirname, '../src/api');
  const generatedServicesDir = path.join(outputBase, 'services/generated');
  const generatedHooksDir = path.join(outputBase, 'hooks/generated');
  const generatedTypesDir = path.join(outputBase, 'types');

  fs.mkdirSync(generatedServicesDir, { recursive: true });
  fs.mkdirSync(generatedHooksDir, { recursive: true });
  fs.mkdirSync(generatedTypesDir, { recursive: true });

  // Generate types file
  console.log('📦 Generating types...');
  const typesContent = generateTypesFile(spec.components.schemas);
  fs.writeFileSync(path.join(generatedTypesDir, 'generated.ts'), typesContent);
  console.log(`   ✅ types/generated.ts (${Object.keys(spec.components.schemas).length} types)\n`);

  // Generate service and hook files for each tag
  for (const tag of filteredTags) {
    const endpoints = endpointsByTag[tag];
    console.log(`   📂 ${tag} (${endpoints.length} endpoints)`);

    // Generate service file
    const serviceContent = generateServiceFile(tag, endpoints, spec.components.schemas);
    const serviceFileName = `${toKebabCase(tag)}.ts`;
    fs.writeFileSync(path.join(generatedServicesDir, serviceFileName), serviceContent);

    // Generate hooks file
    const hooksContent = generateHooksFile(tag, endpoints, spec.components.schemas);
    const hooksFileName = `use-${toKebabCase(tag)}.ts`;
    fs.writeFileSync(path.join(generatedHooksDir, hooksFileName), hooksContent);
  }

  // Generate index files for generated code
  console.log('\n📄 Generating index files...');

  const servicesIndexContent = filteredTags
    .map((tag) => `export * from './${toKebabCase(tag)}';`)
    .join('\n') + '\n';
  fs.writeFileSync(path.join(generatedServicesDir, 'index.ts'), servicesIndexContent);

  const hooksIndexContent = filteredTags
    .map((tag) => `export * from './use-${toKebabCase(tag)}';`)
    .join('\n') + '\n';
  fs.writeFileSync(path.join(generatedHooksDir, 'index.ts'), hooksIndexContent);

  console.log('   ✅ services/generated/index.ts');
  console.log('   ✅ hooks/generated/index.ts');

  console.log('\n✨ Code generation complete!\n');
  console.log('Next steps:');
  console.log('  1. Run `npm run lint:fix` to fix any formatting issues');
  console.log('  2. Import generated services/hooks from src/api');
  console.log('  3. See docs/guides/api-usage.md for usage examples\n');
}

main().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
