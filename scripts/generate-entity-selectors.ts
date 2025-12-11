/**
 * Entity Autocomplete Selector Generator
 *
 * This script reads the OpenAPI specification from docs/api/response.json
 * and generates reusable autocomplete selector components for entities with search endpoints.
 *
 * Usage:
 *   npx tsx scripts/generate-entity-selectors.ts
 *   npm run generate:selectors
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
}

interface EntitySearchInfo {
  entityName: string;
  tag: string;
  operationId: string;
  entityType: string;
  resultArrayType: string;
  hookName: string;
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

function resolveType(schema: SchemaObject): string {
  if (schema.$ref) {
    return getRefName(schema.$ref);
  }
  return 'unknown';
}

// ----------------------------------------------------------------------
// Generator
// ----------------------------------------------------------------------

function generateSelectorComponent(info: EntitySearchInfo): string {
  const lines: string[] = [];
  const componentName = `${info.entityName}Selector`;
  const propsInterface = `${componentName}Props`;

  lines.push(`import type { ${info.entityType} } from 'src/api/types/generated';`);
  lines.push(``);
  lines.push(`import { useCallback, useMemo, useState } from 'react';`);
  lines.push(``);
  lines.push(`import { debounce } from 'es-toolkit';`);
  lines.push(``);
  lines.push(`import TextField from '@mui/material/TextField';`);
  lines.push(`import Autocomplete from '@mui/material/Autocomplete';`);
  lines.push(`import CircularProgress from '@mui/material/CircularProgress';`);
  lines.push(``);
  lines.push(`import { use${toPascalCase(info.hookName)} } from 'src/api/hooks/generated/use-${toKebabCase(info.tag)}';`);
  lines.push(``);
  lines.push(`// ----------------------------------------------------------------------`);
  lines.push(``);
  lines.push(`export interface ${propsInterface} {`);
  lines.push(`  value?: string | null;`);
  lines.push(`  onChange?: (${toCamelCase(info.entityName)}Id: string | null) => void;`);
  lines.push(`  disabled?: boolean;`);
  lines.push(`  label?: string;`);
  lines.push(`  error?: boolean;`);
  lines.push(`  helperText?: string;`);
  lines.push(`  required?: boolean;`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`export function ${componentName}({`);
  lines.push(`  value,`);
  lines.push(`  onChange,`);
  lines.push(`  disabled = false,`);
  lines.push(`  label = '${info.entityName}',`);
  lines.push(`  error = false,`);
  lines.push(`  helperText,`);
  lines.push(`  required = false,`);
  lines.push(`}: ${propsInterface}) {`);
  lines.push(`  const [inputValue, setInputValue] = useState('');`);
  lines.push(`  const [debouncedInputValue, setDebouncedInputValue] = useState('');`);
  lines.push(`  const [selected${info.entityName}, setSelected${info.entityName}] = useState<${info.entityType} | null>(null);`);
  lines.push(``);
  lines.push(`  // Debounce search input with 500ms delay`);
  lines.push(`  const debouncedSetSearch = useMemo(`);
  lines.push(`    () => debounce((searchValue: string) => {`);
  lines.push(`      setDebouncedInputValue(searchValue);`);
  lines.push(`    }, 500),`);
  lines.push(`    []`);
  lines.push(`  );`);
  lines.push(``);
  lines.push(`  const { data: searchResults, isFetching } = use${toPascalCase(info.hookName)}(`);
  lines.push(`    {`);
  lines.push(`      searchText: debouncedInputValue || undefined,`);
  lines.push(`      maxResults: 10,`);
  lines.push(`    }`);
  lines.push(`  );`);
  lines.push(``);
  lines.push(`  const items = searchResults?.data || [];`);
  lines.push(``);
  lines.push(`  const handleChange = useCallback(`);
  lines.push(`    (_event: any, newValue: ${info.entityType} | null) => {`);
  lines.push(`      setSelected${info.entityName}(newValue);`);
  lines.push(`      onChange?.(newValue?.id ? String(newValue.id) : null);`);
  lines.push(`    },`);
  lines.push(`    [onChange]`);
  lines.push(`  );`);
  lines.push(``);
  lines.push(`  const handleInputChange = useCallback(`);
  lines.push(`    (_event: any, newInputValue: string) => {`);
  lines.push(`      setInputValue(newInputValue);`);
  lines.push(`      debouncedSetSearch(newInputValue);`);
  lines.push(`    },`);
  lines.push(`    [debouncedSetSearch]`);
  lines.push(`  );`);
  lines.push(``);
  lines.push(`  return (`);
  lines.push(`    <Autocomplete`);
  lines.push(`      value={selected${info.entityName}}`);
  lines.push(`      onChange={handleChange}`);
  lines.push(`      inputValue={inputValue}`);
  lines.push(`      onInputChange={handleInputChange}`);
  lines.push(`      options={items}`);
  lines.push(`      getOptionLabel={(option) => {`);
  lines.push(`        if (typeof option === 'string') return option;`);
  lines.push(`        // Try common property names across different entity types`);
  lines.push(`        const entity = option as any;`);
  lines.push(`        return entity.name || entity.code || entity.sensorName || entity.sensorCode || entity.title || String(entity.id) || '';`);
  lines.push(`      }}`);
  lines.push(`      isOptionEqualToValue={(option, val) => option.id === val.id}`);
  lines.push(`      loading={isFetching}`);
  lines.push(`      disabled={disabled}`);
  lines.push(`      renderInput={(params) => (`);
  lines.push(`        <TextField`);
  lines.push(`          {...params}`);
  lines.push(`          label={label}`);
  lines.push(`          required={required}`);
  lines.push(`          error={error}`);
  lines.push(`          helperText={helperText}`);
  lines.push(`          slotProps={{`);
  lines.push(`            input: {`);
  lines.push(`              ...params.InputProps,`);
  lines.push(`              endAdornment: (`);
  lines.push(`                <>`);
  lines.push(`                  {isFetching ? <CircularProgress color="inherit" size={20} /> : null}`);
  lines.push(`                  {params.InputProps.endAdornment}`);
  lines.push(`                </>`);
  lines.push(`              ),`);
  lines.push(`            }`);
  lines.push(`          }}`);
  lines.push(`        />`);
  lines.push(`      )}`);
  lines.push(`    />`);
  lines.push(`  );`);
  lines.push(`}`);
  lines.push(``);

  return lines.join('\n');
}

function generateIndexFile(entities: EntitySearchInfo[]): string {
  const lines: string[] = [];

  lines.push(`// ----------------------------------------------------------------------`);
  lines.push(`// Entity Selectors - Auto-generated`);
  lines.push(`// Do not edit manually - run 'npm run generate:selectors' to regenerate`);
  lines.push(`// ----------------------------------------------------------------------`);
  lines.push(``);

  // Sort entities alphabetically by kebab-case name for consistent ordering
  const sortedEntities = [...entities].sort((a, b) => 
    toKebabCase(a.entityName).localeCompare(toKebabCase(b.entityName))
  );

  for (const entity of sortedEntities) {
    const kebabName = toKebabCase(entity.entityName);
    lines.push(`export * from './${kebabName}-selector';`);
  }
  lines.push(``);

  return lines.join('\n');
}

// ----------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------

async function main() {
  console.log('🚀 Entity Autocomplete Selector Generator');
  console.log('==========================================\n');

  // Read OpenAPI spec
  const specPath = path.resolve(__dirname, '../docs/api/response.json');
  console.log(`📖 Reading OpenAPI spec from: ${specPath}`);

  if (!fs.existsSync(specPath)) {
    console.error('❌ OpenAPI spec not found at:', specPath);
    process.exit(1);
  }

  const specContent = fs.readFileSync(specPath, 'utf-8');
  const spec: OpenAPISpec = JSON.parse(specContent);

  // Find all entities with search endpoints
  const searchEntities: EntitySearchInfo[] = [];

  for (const [pathUrl, pathItem] of Object.entries(spec.paths)) {
    // Check if path matches /api/*/search pattern
    const searchMatch = pathUrl.match(/^\/api\/(\w+)\/search$/);
    if (searchMatch && pathItem.get) {
      const tag = pathItem.get.tags?.[0];
      const operationId = pathItem.get.operationId;

      if (!tag || !operationId) continue;

      // Get response type
      const successResponse = pathItem.get.responses['200'];
      if (successResponse?.content?.['application/json']?.schema) {
        const responseSchema = successResponse.content['application/json'].schema;
        const responseType = resolveType(responseSchema);

        // Infer entity type from response type (e.g., AreaEntityResultArray -> AreaEntity)
        const entityType = responseType.replace('ResultArray', '');

        searchEntities.push({
          entityName: tag,
          tag,
          operationId,
          entityType,
          resultArrayType: responseType,
          hookName: toCamelCase(operationId),
        });
      }
    }
  }

  console.log(`   Found ${searchEntities.length} entities with search endpoints\n`);

  if (searchEntities.length === 0) {
    console.log('⚠️  No search endpoints found. Exiting.');
    return;
  }

  // Create output directory
  const outputDir = path.resolve(__dirname, '../src/components/selectors');
  fs.mkdirSync(outputDir, { recursive: true });

  // Generate selector components
  console.log('📝 Generating selector components:\n');

  for (const entity of searchEntities) {
    const componentContent = generateSelectorComponent(entity);
    const fileName = `${toKebabCase(entity.entityName)}-selector.tsx`;
    const filePath = path.join(outputDir, fileName);

    fs.writeFileSync(filePath, componentContent);
    console.log(`   ✅ ${fileName}`);
  }

  // Generate index file
  const indexContent = generateIndexFile(searchEntities);
  fs.writeFileSync(path.join(outputDir, 'index.ts'), indexContent);
  console.log(`   ✅ index.ts\n`);

  console.log('✨ Selector generation complete!\n');
  console.log(`Generated ${searchEntities.length} selector components in: src/components/selectors\n`);
  console.log('Entities:');
  for (const entity of searchEntities) {
    console.log(`  - ${entity.entityName}Selector`);
  }
  console.log('\nNext steps:');
  console.log('  1. Import selectors from src/components/selectors');
  console.log('  2. Use them in your forms and pages');
  console.log('  3. Example: import { AreaSelector } from "src/components/selectors";\n');
}

main().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
