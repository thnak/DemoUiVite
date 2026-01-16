/**
 * Translation Web Worker
 * 
 * Handles all translation storage, fetching, and caching in a background thread.
 * Uses IndexedDB for persistent storage and implements ETag-based conditional fetching.
 */

import type {
  EntityType,
  WorkerMessage,
  WorkerMessageType,
  GetTranslationRequest,
  TranslationResponse,
  SyncProgress,
  TranslationConfig,
} from './types';

import { translationKeyToString, convertTranslationDtoToMap } from './types';
import {
  getEntityETag,
  setEntityETag,
  getTranslation,
  setTranslations,
} from './storage';

// ----------------------------------------------------------------------

/**
 * Worker configuration
 */
let config: TranslationConfig = {
  pollingInterval: 30 * 60 * 1000, // 30 minutes
  autoSync: true,
  baseUrl: '',
};

/**
 * Timer for background polling
 */
let pollingTimer: ReturnType<typeof setInterval> | null = null;

/**
 * Entity types that support translations
 */
const SUPPORTED_ENTITIES: EntityType[] = [
  'area',
  'calendar',
  'defectReason',
  'defectReasonGroup',
  'department',
  'informationDecoratorBase',
  'machineType',
  'machine',
  'productCategory',
  'product',
  'shift',
  'shiftTemplate',
  'stopMachineReason',
  'stopMachineReasonGroup',
  'timeBlockName',
  'unit',
  'unitConversion',
  'unitGroup',
  'workOrder',
];

/**
 * Entity endpoint mapping
 */
const ENTITY_ENDPOINTS: Record<EntityType, string> = {
  area: '/api/area/translations',
  calendar: '/api/calendar/translations',
  defectReason: '/api/defectreason/translations',
  defectReasonGroup: '/api/defectreasongroup/translations',
  department: '/api/department/translations',
  informationDecoratorBase: '/api/informationdecoratorbase/translations',
  machineType: '/api/machinetype/translations',
  machine: '/api/machine/translations',
  productCategory: '/api/productcategory/translations',
  product: '/api/product/translations',
  shift: '/api/shift/translations',
  shiftTemplate: '/api/shifttemplate/translations',
  stopMachineReason: '/api/stopmachinereason/translations',
  stopMachineReasonGroup: '/api/stopmachinereasongroup/translations',
  timeBlockName: '/api/timeblockname/translations',
  unit: '/api/unit/translations',
  unitConversion: '/api/unitconversion/translations',
  unitGroup: '/api/unitgroup/translations',
  workOrder: '/api/workorder/translations',
};

// ----------------------------------------------------------------------

/**
 * Post message back to main thread
 */
function postResponse(type: WorkerMessageType, payload?: any, requestId?: string) {
  const message: WorkerMessage = { type, payload, id: requestId };
  self.postMessage(message);
}

/**
 * Fetch translations for an entity with ETag support
 */
async function fetchEntityTranslations(
  entity: EntityType
): Promise<{ translations: any[] | null; etag: string | null }> {
  try {
    const endpoint = ENTITY_ENDPOINTS[entity];
    if (!endpoint) {
      console.error(`No endpoint defined for entity: ${entity}`);
      return { translations: null, etag: null };
    }

    const url = `${config.baseUrl}${endpoint}`;
    
    // Get stored ETag
    const metadata = await getEntityETag(entity);
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (metadata?.etag) {
      headers['If-None-Match'] = metadata.etag;
    }

    const response = await fetch(url, { headers });

    // 304 Not Modified - use cached data
    if (response.status === 304) {
      console.log(`[Worker] Entity ${entity} not modified (304)`);
      return { translations: null, etag: metadata?.etag || null };
    }

    // 200 OK - new data available
    if (response.ok) {
      const translations = await response.json();
      const newETag = response.headers.get('ETag');
      
      console.log(`[Worker] Fetched ${translations.length} translations for ${entity}`);
      return { translations, etag: newETag };
    }

    console.error(`[Worker] Failed to fetch ${entity}: ${response.status}`);
    return { translations: null, etag: null };
  } catch (error) {
    console.error(`[Worker] Error fetching ${entity}:`, error);
    return { translations: null, etag: null };
  }
}

/**
 * Process and store entity translations
 */
async function processEntityTranslations(
  entity: EntityType,
  translations: any[]
): Promise<number> {
  try {
    let storedCount = 0;

    // Group translations by entity ID
    const byEntityId = new Map<string, any[]>();
    
    translations.forEach((item) => {
      const entityId = item.id?.$oid || item.id || 'unknown';
      if (!byEntityId.has(entityId)) {
        byEntityId.set(entityId, []);
      }
      byEntityId.get(entityId)!.push(item);
    });

    // Process each entity's translations
    for (const [entityId, entityTranslations] of byEntityId) {
      const translationMap = convertTranslationDtoToMap(entity, entityId, entityTranslations);
      await setTranslations(translationMap);
      storedCount += translationMap.size;
    }

    return storedCount;
  } catch (error) {
    console.error(`[Worker] Error processing translations for ${entity}:`, error);
    return 0;
  }
}

/**
 * Sync a single entity
 */
async function syncEntity(entity: EntityType): Promise<SyncProgress> {
  const progress: SyncProgress = {
    entity,
    status: 'syncing',
    progress: 0,
  };

  postResponse('SYNC_PROGRESS', progress);

  try {
    progress.progress = 30;
    postResponse('SYNC_PROGRESS', progress);

    const { translations, etag } = await fetchEntityTranslations(entity);

    if (translations) {
      progress.progress = 60;
      postResponse('SYNC_PROGRESS', progress);

      const count = await processEntityTranslations(entity, translations);
      
      // Update ETag
      if (etag) {
        await setEntityETag(entity, etag);
      }

      progress.status = 'complete';
      progress.progress = 100;
      progress.total = count;
      postResponse('SYNC_PROGRESS', progress);

      // Notify data updated
      postResponse('DATA_UPDATED', { entity });
    } else {
      // No new data (304) or error
      progress.status = 'complete';
      progress.progress = 100;
      postResponse('SYNC_PROGRESS', progress);
    }

    return progress;
  } catch (error) {
    progress.status = 'error';
    progress.error = error instanceof Error ? error.message : 'Unknown error';
    postResponse('SYNC_PROGRESS', progress);
    postResponse('SYNC_ERROR', { entity, error: progress.error });
    return progress;
  }
}

/**
 * Sync all entities
 */
async function syncAll(): Promise<void> {
  console.log('[Worker] Starting sync all entities');
  
  for (const entity of SUPPORTED_ENTITIES) {
    await syncEntity(entity);
  }

  console.log('[Worker] Sync all complete');
  postResponse('SYNC_COMPLETE');
}

/**
 * Get translation from cache
 */
async function handleGetTranslation(request: GetTranslationRequest, requestId?: string) {
  try {
    const key = translationKeyToString({
      entity: request.entity,
      entityId: request.entityId,
      lang: request.lang,
    });

    const content = await getTranslation(key);

    const response: TranslationResponse = {
      entity: request.entity,
      entityId: request.entityId,
      lang: request.lang,
      content,
      fromCache: content !== null,
    };

    postResponse('TRANSLATION_RESPONSE', response, requestId);
  } catch (error) {
    console.error('[Worker] Error getting translation:', error);
    postResponse('TRANSLATION_RESPONSE', {
      ...request,
      content: null,
      fromCache: false,
    }, requestId);
  }
}

/**
 * Start background polling
 */
function startPolling() {
  if (pollingTimer) {
    clearInterval(pollingTimer);
  }

  if (config.autoSync && config.pollingInterval > 0) {
    pollingTimer = setInterval(() => {
      console.log('[Worker] Background sync triggered');
      syncAll();
    }, config.pollingInterval);
    
    console.log(`[Worker] Polling started: ${config.pollingInterval}ms interval`);
  }
}

/**
 * Stop background polling
 */
function stopPolling() {
  if (pollingTimer) {
    clearInterval(pollingTimer);
    pollingTimer = null;
    console.log('[Worker] Polling stopped');
  }
}

/**
 * Initialize worker
 */
function initialize(initConfig?: Partial<TranslationConfig>) {
  console.log('[Worker] Initializing translation worker');
  
  if (initConfig) {
    config = { ...config, ...initConfig };
  }

  startPolling();
  postResponse('INIT_COMPLETE', { config });
}

// ----------------------------------------------------------------------

/**
 * Message handler
 */
self.addEventListener('message', async (event: MessageEvent<WorkerMessage>) => {
  const { type, payload, id } = event.data;

  switch (type) {
    case 'INIT':
      initialize(payload);
      break;

    case 'GET_TRANSLATION':
      await handleGetTranslation(payload as GetTranslationRequest, id);
      break;

    case 'SYNC_ENTITY':
      await syncEntity(payload.entity);
      break;

    case 'SYNC_ALL':
      await syncAll();
      break;

    case 'SET_CONFIG':
      config = { ...config, ...payload };
      stopPolling();
      startPolling();
      break;

    default:
      console.warn('[Worker] Unknown message type:', type);
  }
});

// Log worker loaded
console.log('[Worker] Translation worker loaded');
