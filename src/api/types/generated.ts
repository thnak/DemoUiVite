// ----------------------------------------------------------------------
// API Types
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Specifies the access level for resources in the system.
 */
export type AccessLevel = 'public' | 'restricted' | 'confidential';

/**
 * Represents access permission levels with associated localized text and RGB color attributes.
 */
export type AccessPermission = 'owner' | 'editor' | 'readOnly';

/**
 * Enum representing the type of value monitored by the adaptive rule (Ip or UserId).
 */
export type AdaptiveMonitoredValue = 'ip' | 'userId';

export type AdaptiveRuleConfigEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  policyName?: string | null;
  permitLimit?: number;
  windowInSeconds?: number;
  isEnabled?: boolean;
  monitoredValue?: AdaptiveMonitoredValue;
};

/**
 * Base class for paginated responses
 */
export type AdaptiveRuleConfigEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: AdaptiveRuleConfigEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type AdaptiveRuleConfigEntityResult = {
  value?: AdaptiveRuleConfigEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type AdminGlobalSettingEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  enableMaintenanceMode?: boolean;
  maintenanceModeMessage?: string | null;
  defaultPageSize?: number;
  maxUploadFileSizeMb?: number;
  backgroundTaskCronExpression?: string | null;
  systemEmail?: string | null;
  mailServer?: string | null;
  mailServerPort?: number;
  smtpUsername?: string | null;
  smtpPassword?: string | null;
  smtpEnableSsl?: boolean;
  sessionTimeoutMinutes?: number;
  maxFailedLoginAttempts?: number;
  accountLockoutMinutes?: number;
  minimumPasswordLength?: number;
  allowedIpRangesForAdminAccess?: string | null;
  renderMode?: RenderMode;
  enableOnlinePayments?: boolean;
  enableNewUserRegistration?: boolean;
  enablePushNotifications?: boolean;
  logLevel?: string | null;
  healthAlertsEmail?: string | null;
  apiServiceEndpointUrl?: string | null;
  apiServiceTimeoutSeconds?: number;
};

/**
 * Base class for paginated responses
 */
export type AdminGlobalSettingEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: AdminGlobalSettingEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type AdminGlobalSettingEntityResult = {
  value?: AdminGlobalSettingEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

/**
 * Specifies the available time intervals for data aggregation in the system.
 */
export type AggregationInterval =
  | 'notScheduled'
  | 'oneSecond'
  | 'fiveSeconds'
  | 'tenSeconds'
  | 'twentySeconds'
  | 'thirtySeconds'
  | 'oneMinute'
  | 'fiveMinutes'
  | 'fifteenMinutes';

export type ApiGatewayEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  name: string;
  upstreamHttpMethod: UpstreamHttpMethod;
  upstreamPathTemplate: string;
  routeType?: RouteType;
  downstreamUrl: string;
  pluginId: ObjectId;
  /** Represents a collection of field parameters and their types. */
  pluginConfiguration?: StringObjectKeyValuePair[] | null;
  authKey: string;
  isPayloadValidationEnabled?: boolean;
  payloadValidationSecret?: string | null;
  status?: RouteStatus;
};

/**
 * Base class for paginated responses
 */
export type ApiGatewayEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: ApiGatewayEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type ApiGatewayEntityResult = {
  value?: ApiGatewayEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type AssemblyHashInfoEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  fileName?: string | null;
  fileHash?: string | null;
  lastUpdated?: string;
};

/**
 * Base class for paginated responses
 */
export type AssemblyHashInfoEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: AssemblyHashInfoEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type AssemblyHashInfoEntityResult = {
  value?: AssemblyHashInfoEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

/**
 * Represents the response containing authentication tokens and related metadata for a user.
 */
export type AuthTokenResponse = {
  /** The JWT access token issued to the user. */
  accessToken?: string | null;
  /** The refresh token used to obtain new access tokens. */
  refreshToken?: string | null;
  /** The UTC date and time when the access token expires. */
  expiresAt?: string;
  /** The type of the token, typically "Bearer". */
  tokenType?: string | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type AuthTokenResponseResult = {
  value?: AuthTokenResponse;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type BackupSettings = {
  backupScheduleCron?: string | null;
  backupRetentionDays?: number;
  rtoHours?: number;
  rpoHours?: number;
};

/**
 * Base widget config
 */
export type BaseWidgetConfig = {
  /** Gets or sets auto position */
  autoPosition?: boolean | null;
  /** Gets or sets x */
  x?: number | null;
  /** Gets or sets y */
  y?: number | null;
  /** Gets or sets w */
  w?: number | null;
  /** Gets or sets h */
  h?: number | null;
  /** Gets or sets max w */
  maxW?: number | null;
  /** Gets or sets min w */
  minW?: number | null;
  /** Gets or sets max h */
  maxH?: number | null;
  /** Gets or sets min h */
  minH?: number | null;
  /** Gets or sets locked */
  locked?: boolean | null;
  /** Gets or sets no resize */
  noResize?: boolean | null;
  /** Gets or sets no move */
  noMove?: boolean | null;
  /** Gets or sets resize handles */
  resizeHandles?: string | null;
};

export type BillingSettings = {
  billingContactEmail?: string | null;
  billingCycleDays?: number;
  trialPeriodDays?: number;
  featureQuotas?: Record<string, number> | null;
};

export type BomHeaderEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  parentProductId?: ObjectId;
  name?: string | null;
  version?: number;
  description?: string | null;
  isActive?: boolean;
  effectiveStartDate?: string | null;
  effectiveEndDate?: string | null;
};

/**
 * Base class for paginated responses
 */
export type BomHeaderEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: BomHeaderEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type BomHeaderEntityResult = {
  value?: BomHeaderEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type BomLineEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  bomHeaderId?: ObjectId;
  componentProductId?: ObjectId;
  quantityPerParent?: number;
  unitOfMeasure?: UnitOfMeasure;
  sequenceNumber?: number;
  notes?: string | null;
  scrapFactor?: number;
};

/**
 * Base class for paginated responses
 */
export type BomLineEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: BomLineEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type BomLineEntityResult = {
  value?: BomLineEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type BooleanResult = {
  /** Gets the value of the result. */
  value?: boolean;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type BrandEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
};

/**
 * Base class for paginated responses
 */
export type BrandEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: BrandEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type BrandEntityResult = {
  value?: BrandEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type BreakDefinition = {
  /** Giờ bắt đầu nghỉ (VD: 12:00:00) */
  startTime?: string;
  /** Giờ kết thúc nghỉ (VD: 13:00:00). Nếu nghỉ qua đêm, giá trị này sẽ nhỏ hơn StartTime */
  endTime?: string;
  /** Mô tả về khoảng nghỉ (VD: "Nghỉ trưa") */
  description?: string | null;
};

export type CalendarEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  code?: string | null;
  name?: string | null;
  type?: CalendarType;
  parentCalendarId?: ObjectId;
  shiftPatternId?: ObjectId;
  description?: string | null;
};

/**
 * Base class for paginated responses
 */
export type CalendarEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: CalendarEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type CalendarEntityResult = {
  value?: CalendarEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type CalendarExceptionEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  calendarId?: ObjectId;
  description?: string | null;
  startTime?: string;
  endTime?: string;
  isWorkingTime?: boolean;
  overrideShiftPatternId?: ObjectId;
};

/**
 * Base class for paginated responses
 */
export type CalendarExceptionEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: CalendarExceptionEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type CalendarExceptionEntityResult = {
  value?: CalendarExceptionEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

/**
 * Loại lịch
 */
export type CalendarType = 'general' | 'production' | 'office' | 'maintenance' | 'logistics';

export type CategoryEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
};

/**
 * Base class for paginated responses
 */
export type CategoryEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: CategoryEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type CategoryEntityResult = {
  value?: CategoryEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

/**
 * Data transfer object for changing lock screen password
 */
export type ChangeLockScreenPasswordDto = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

/**
 * Data transfer object for changing user password
 */
export type ChangePasswordDto = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

/**
 * Type of changes for an entity
 */
export type ChangesType =
  | 'create'
  | 'update'
  | 'delete'
  | 'restore'
  | 'permanentDelete'
  | 'export'
  | 'import';

export type ChildWidgetConfigEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  parentId?: ObjectId;
  scriptVariantId?: ObjectId;
  widgetId?: string | null;
  description?: string | null;
  componentType?: string | null;
  widgetOption?: WidgetConfig;
  /** Represents a collection of field parameters and their types. */
  variables?: StringObjectKeyValuePair[] | null;
  ifClauseType?: IfElseClauseType[] | null;
};

/**
 * Base class for paginated responses
 */
export type ChildWidgetConfigEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: ChildWidgetConfigEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type ChildWidgetConfigEntityResult = {
  value?: ChildWidgetConfigEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type CommentReaction = {
  emoji: string | null;
  userId: ObjectId;
  reactedAt?: string;
};

export type CreateNewTenantRequest = {
  id?: string | null;
  /** database name, which is also used as the tenant identifier. */
  identifier?: string | null;
  name?: string | null;
  databaseName?: string | null;
  replicaSetMembers?: string[] | null;
  port?: number;
  userName?: string | null;
  password?: string | null;
  maxConnectionPoolSize?: number;
};

export type CreateRequest = {
  name: string | null;
  description?: string | null;
  script?: string | null;
  maxWaitTime?: string;
  /** Represents a collection of field parameters and their types. */
  variables?: StringObjectKeyValuePair[] | null;
};

export type CustomerEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  code?: string | null;
  name?: string | null;
  address?: string | null;
  contactNumber?: string | null;
  email?: string | null;
  website?: string | null;
};

/**
 * Base class for paginated responses
 */
export type CustomerEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: CustomerEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type CustomerEntityResult = {
  value?: CustomerEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

/**
 * Dash board template dto
 */
export type DashBoardTemplateDto = {
  id?: string | null;
  name?: string | null;
  description?: string | null;
  uriQuery?: string | null;
  thumbnail?: string | null;
  icon?: string | null;
};

/**
 * Dashboard combine dto
 */
export type DashboardCombineDto = {
  dashBoardTemplateDto?: DashBoardTemplateDto;
  widgets?: WidgetConfigDto[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type DashboardCombineDtoResult = {
  value?: DashboardCombineDto;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type DashboardTemplateEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  code?: string | null;
  name?: string | null;
  description?: string | null;
  templateIcon?: string | null;
  templateThumbnail?: string | null;
  uriQuery?: string | null;
};

/**
 * Base class for paginated responses
 */
export type DashboardTemplateEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: DashboardTemplateEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

export type DashboardTemplateEntityPaginationQuery = {
  /** List of items in the current page */
  items?: DashboardTemplateEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type DashboardTemplateEntityResult = {
  value?: DashboardTemplateEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type DataProtectionKeyEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  friendlyName?: string | null;
  xml?: string | null;
};

/**
 * Base class for paginated responses
 */
export type DataProtectionKeyEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: DataProtectionKeyEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type DataProtectionKeyEntityResult = {
  value?: DataProtectionKeyEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

/**
 * Data source
 */
export type DataSource = {
  /** Gets or sets topic */
  topic?: string | null;
  /** Gets or sets description */
  description?: string | null;
  format?: DataSourceFormat;
  /** Gets or sets realtime */
  realtime?: boolean;
  /** Gets or sets wildcards */
  wildcards?: WildcardParam[] | null;
};

export type DataSourceFormat = 'jsonTable' | 'number' | 'string' | 'boolean';

export type DayOfWeek =
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday';

export type DefectEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  code?: string | null;
  name?: string | null;
  defectGroupId?: ObjectId;
  isActive?: boolean;
  colorHex?: string | null;
  requireExtraNoteFromOperator?: boolean;
  addScrapAndIncreaseTotalQuantity?: boolean;
  description?: string | null;
  translations?: Record<string, string> | null;
};

/**
 * Base class for paginated responses
 */
export type DefectEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: DefectEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type DefectEntityResult = {
  value?: DefectEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type DefectGroupEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  code?: string | null;
  name?: string | null;
  colorHex?: string | null;
  description?: string | null;
  translations?: Record<string, string> | null;
};

/**
 * Base class for paginated responses
 */
export type DefectGroupEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: DefectGroupEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type DefectGroupEntityResult = {
  value?: DefectGroupEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type DepartmentEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  code?: string | null;
  name?: string | null;
  description?: string | null;
  hexColor?: string | null;
  translations?: Record<string, string> | null;
};

/**
 * Base class for paginated responses
 */
export type DepartmentEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: DepartmentEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type DepartmentEntityResult = {
  value?: DepartmentEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

/**
 * Represents the reason for a disconnection event in the system.
 */
export type DisconnectReason =
  | 'normalDisconnection'
  | 'disconnectWithWillMessage'
  | 'unspecifiedError'
  | 'malformedPacket'
  | 'protocolError'
  | 'implementationSpecificError'
  | 'notAuthorized'
  | 'serverBusy'
  | 'serverShuttingDown'
  | 'keepAliveTimeout'
  | 'sessionTakenOver'
  | 'topicFilterInvalid'
  | 'topicNameInvalid'
  | 'receiveMaximumExceeded'
  | 'topicAliasInvalid'
  | 'packetTooLarge'
  | 'messageRateTooHigh'
  | 'quotaExceeded'
  | 'administrativeAction'
  | 'payloadFormatInvalid'
  | 'retainNotSupported'
  | 'qoSNotSupported'
  | 'useAnotherServer'
  | 'serverMoved'
  | 'sharedSubscriptionsNotSupported'
  | 'connectionRateExceeded'
  | 'maximumConnectTime'
  | 'subscriptionIdentifiersNotSupported'
  | 'wildcardSubscriptionsNotSupported';

export type DocumentEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  documentCode?: string | null;
  description?: string | null;
  documentName?: string | null;
  type?: DocumentType;
};

/**
 * Base class for paginated responses
 */
export type DocumentEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: DocumentEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type DocumentEntityResult = {
  value?: DocumentEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

/**
 * Represents the type of document in the system.
 */
export type DocumentType = 'unknown' | 'userGuide' | 'contract' | 'policy' | 'report' | 'other';

export type DowntimeGroupEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  code?: string | null;
  name?: string | null;
  description?: string | null;
  category?: DowntimeReasonCategories;
  isPlanned?: boolean;
  colorHex?: string | null;
  translations?: Record<string, string> | null;
};

/**
 * Base class for paginated responses
 */
export type DowntimeGroupEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: DowntimeGroupEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type DowntimeGroupEntityResult = {
  value?: DowntimeGroupEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type DowntimeInput = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
};

/**
 * Base class for paginated responses
 */
export type DowntimeInputBasePaginationResponse = {
  /** List of items in the current page */
  items?: DowntimeInput[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type DowntimeInputResult = {
  value?: DowntimeInput;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type DowntimeReasonCategories =
  | 'changeoverOrSetup'
  | 'plannedMaintenance'
  | 'breaks'
  | 'meetingsOrTraining'
  | 'materialIssues'
  | 'operatorIssues'
  | 'qualityIssues'
  | 'breakdown'
  | 'uncategorized';

export type DowntimeReasonEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  code?: string | null;
  name?: string | null;
  description?: string | null;
  groupId?: ObjectId;
  requiresApproval?: boolean;
  requiresNote?: boolean;
  requiresAttachment?: boolean;
  requiresComment?: boolean;
  colorHex?: string | null;
  translations?: Record<string, string> | null;
};

/**
 * Base class for paginated responses
 */
export type DowntimeReasonEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: DowntimeReasonEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type DowntimeReasonEntityResult = {
  value?: DowntimeReasonEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type EntityLogMetaData = {
  id?: ObjectId;
  changesType?: ChangesType;
};

/**
 * Chỉ định các loại lỗi có thể xảy ra trong ứng dụng.
 */
export type ErrorType =
  | 'none'
  | 'notFound'
  | 'duplicate'
  | 'cancelled'
  | 'validation'
  | 'database'
  | 'unknown'
  | 'permissionDenied'
  | 'javaScriptError'
  | 'internalError'
  | 'invalidArgument'
  | 'apiError'
  | 'unauthorized';

export type EscalationStep = {
  order?: number;
  channel?: string | null;
  recipient?: string | null;
  delayMinutes?: number;
};

export type FileClassify =
  | 'normal'
  | 'thumbnailFile'
  | 'thumbnailWebpFile'
  | 'm3U8File'
  | 'm3U8FileSegment'
  | 'iotImageFile';

export type FileInfoEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  aliasCode?: string | null;
  parentResource?: ObjectId;
  fileName?: string | null;
  tagId?: string | null;
  relativePath?: string | null;
  parentFolderId?: ObjectId;
  status?: FileStatus;
  previousStatus?: FileStatus;
  isPublic?: boolean;
};

/**
 * Base class for paginated responses
 */
export type FileInfoEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: FileInfoEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type FileInfoEntityResult = {
  value?: FileInfoEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type FileLocationHistoryEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  childId?: ObjectId;
  parentFolderId?: ObjectId;
  userEdit?: ObjectId;
};

/**
 * Base class for paginated responses
 */
export type FileLocationHistoryEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: FileLocationHistoryEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type FileLocationHistoryEntityResult = {
  value?: FileLocationHistoryEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type FileMetadataEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  duration?: string;
  width?: number | null;
  height?: number | null;
  bitrate?: number | null;
  codec?: string | null;
  thumbnailAbsolutePath?: string | null;
  createDate?: string;
};

/**
 * Base class for paginated responses
 */
export type FileMetadataEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: FileMetadataEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type FileMetadataEntityResult = {
  value?: FileMetadataEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type FilePermissionEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  rootFolderId?: ObjectId;
  relativePath?: string | null;
  userId?: ObjectId;
  grantedBy?: ObjectId;
  role?: AccessPermission;
  grantedAt?: string;
  isRevoked?: boolean;
  expiration?: string;
  password?: string | null;
};

/**
 * Base class for paginated responses
 */
export type FilePermissionEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: FilePermissionEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type FilePermissionEntityResult = {
  value?: FilePermissionEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type FilePublicLinkEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  fileId?: ObjectId;
  token?: string | null;
  expiration?: string | null;
  isRevoked?: boolean;
};

/**
 * Base class for paginated responses
 */
export type FilePublicLinkEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: FilePublicLinkEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type FilePublicLinkEntityResult = {
  value?: FilePublicLinkEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type FileRaidStatus = 'normal' | 'corrupted' | 'missing';

export type FileStatus = 'file' | 'hiddenFile' | 'deletedFile' | 'corruptedFile' | 'missingFile';

export type FileVersions = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  rootFolderId?: ObjectId;
  relativePath?: string | null;
  version?: number;
  metadataId?: string | null;
  classify?: FileClassify;
  checksum?: string | null;
  description?: string | null;
  note?: string | null;
  contentType?: string | null;
  fileSize?: number;
};

/**
 * Base class for paginated responses
 */
export type FileVersionsBasePaginationResponse = {
  /** List of items in the current page */
  items?: FileVersions[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type FileVersionsResult = {
  value?: FileVersions;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type FirmwareVersionEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  major?: number;
  minor?: number;
  patch?: number;
  build?: number | null;
  preReleaseTag?: string | null;
  originalString?: string | null;
  modelTypeId?: ObjectId;
  available?: boolean;
  checksum?: string | null;
  description?: string | null;
  filePath?: string | null;
  version?: string | null;
};

/**
 * Base class for paginated responses
 */
export type FirmwareVersionEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: FirmwareVersionEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type FirmwareVersionEntityResult = {
  value?: FirmwareVersionEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type FolderInfoEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  folderName?: string | null;
  ownerUserId?: ObjectId;
  password?: string | null;
  relativePath?: string | null;
  type?: FolderType;
  icon?: string | null;
  parentFolderId?: ObjectId;
  aliasCode?: string | null;
  folderSize?: number;
  isPublic?: boolean;
};

/**
 * Base class for paginated responses
 */
export type FolderInfoEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: FolderInfoEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type FolderInfoEntityResult = {
  value?: FolderInfoEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type FolderLocationHistoryEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  childId?: ObjectId;
  parentFolderId?: ObjectId;
  userEdit?: ObjectId;
};

/**
 * Base class for paginated responses
 */
export type FolderLocationHistoryEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: FolderLocationHistoryEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type FolderLocationHistoryEntityResult = {
  value?: FolderLocationHistoryEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type FolderPermissionEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  folderId?: ObjectId;
  userId?: ObjectId;
  grantedBy?: ObjectId;
  role?: AccessPermission;
  grantedAt?: string;
  isRevoked?: boolean;
  expiration?: string;
  inherits?: boolean;
};

/**
 * Base class for paginated responses
 */
export type FolderPermissionEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: FolderPermissionEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type FolderPermissionEntityResult = {
  value?: FolderPermissionEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type FolderType =
  | 'folder'
  | 'hiddenFolder'
  | 'deletedFolder'
  | 'systemFolder'
  | 'trashFolder'
  | 'rootFolder';

/**
 * Represents a request to generate a JWT access token for a user, including credentials and optional expiration.
 */
export type GenerateTokenRequest = {
  /** The username of the user requesting the token. */
  username?: string | null;
  /** The password of the user requesting the token. */
  password?: string | null;
  /** Optional: The desired expiration time for the token in minutes. If not specified, the default expiration is used. */
  expirationMinutes?: number | null;
  setRefreshTokenInCookie?: boolean;
};

export type GetAllFirmwareVersionsResponse = {
  id?: string | null;
  modelTypeId?: string | null;
  version?: string | null;
  description?: string | null;
  createdAt?: string;
};

export type GetAllFirmwareVersionsResponsePaginationQuery = {
  /** List of items in the current page */
  items?: GetAllFirmwareVersionsResponse[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

export type GetDeviceLogsResponse = {
  deviceId?: string | null;
  deviceName?: string | null;
  status?: IoTDeviceStatus;
  timeStamp?: string;
};

export type GetDeviceLogsResponsePaginationQuery = {
  /** List of items in the current page */
  items?: GetDeviceLogsResponse[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

export type GetRecordResponse = {
  sensorId?: ObjectId;
  sensorName?: string | null;
  deviceId?: ObjectId;
  deviceName?: string | null;
  createTime?: string;
  value?: number;
  type?: IoTSensorType;
  unitOfMeasurement?: string | null;
};

export type GetRecordResponsePaginationQuery = {
  /** List of items in the current page */
  items?: GetRecordResponse[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

export type GetSensorEntityByIdDto = {
  id?: ObjectId;
  /** Represents the date and time when the entity was created. */
  createTime?: string;
  /** Represents the date and time when the entity was last modified. */
  modifiedTime?: string;
  /** Gets or sets calibration time */
  sensorCode?: string | null;
  sensorName?: string | null;
  type?: IoTSensorType;
  deviceId?: ObjectId;
  pinNumber?: number;
  pinInputMode?: PinInputMode;
  pinInterruptMode?: PinInterruptMode;
  unitOfMeasurement?: string | null;
  accuracy?: number;
  calibrationTime?: string | null;
  /** Equals */
  rotate?: number;
  flipHorizontal?: boolean;
  flipVertical?: boolean;
  status?: IoTSensorStatus;
  deviceName?: string | null;
};

/**
 * Represents a simple if-else clause with a selected field and a target field.
 */
export type IfElseClause = {
  selectedField?: string | null;
  targetField?: string | null;
};

/**
 * Represents the base type for if-else clauses in the system.
 */
export type IfElseClauseType = {};

export type IntegrationSettings = {
  erpEndpoint?: string | null;
  erpApiKey?: string | null;
  webhooks?: WebhookEndpoint[] | null;
  plmEndpoint?: string | null;
};

export type InventorySettings = {
  valuationMethod?: InventoryValuationMethod;
  defaultWarehouseId?: string | null;
  enableBatchOrLotTracking?: boolean;
  defaultReorderLeadTimeDays?: number;
  defaultReorderPointsBySku?: Record<string, number> | null;
};

export type InventoryValuationMethod = 'fifo' | 'lifo' | 'weightedAverage';

/**
 * Io t device dto
 */
export type IoTDeviceDto = {
  id?: ObjectId;
  /** Represents the date and time when the entity was created. */
  createTime?: string;
  /** Represents the date and time when the entity was last modified. */
  modifiedTime?: string;
  /** Gets or sets last service time */
  deviceCode?: string | null;
  deviceModelId?: ObjectId;
  deviceName?: string | null;
  mqttPassword?: string | null;
  type?: IoTDeviceType;
  manufacturer?: ObjectId;
  installationDate?: string;
  lastServiceTime?: string | null;
  locationId?: ObjectId;
  firmwareVersion?: string | null;
  status?: IoTDeviceStatus;
  macAddress?: string | null;
  ipAddress?: string | null;
  imageUrl?: string | null;
  machineId?: ObjectId;
};

export type IoTDeviceEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  code?: string | null;
  deviceModelId?: ObjectId;
  name?: string | null;
  mqttPassword?: string | null;
  type?: IoTDeviceType;
  manufacturer?: ObjectId;
  installationDate?: string;
  lastServiceTime?: string | null;
  locationId?: ObjectId;
  firmwareVersion?: string | null;
  status?: IoTDeviceStatus;
  macAddress?: string | null;
  ipAddress?: string | null;
  imageUrl?: string | null;
  machineId?: ObjectId;
};

/**
 * Base class for paginated responses
 */
export type IoTDeviceEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: IoTDeviceEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

export type IoTDeviceEntityEntityLogEntity = {
  createTime?: string;
  metaData?: EntityLogMetaData;
  userId?: ObjectId;
  message?: string | null;
  entity: IoTDeviceEntity;
};

export type IoTDeviceEntityPaginationQuery = {
  /** List of items in the current page */
  items?: IoTDeviceEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type IoTDeviceEntityResult = {
  value?: IoTDeviceEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type IoTDeviceGroupEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  groupId?: string | null;
  groupName?: string | null;
  description?: string | null;
  location?: string | null;
  deploymentTime?: string;
  deployedBy?: string | null;
  status?: IoTDeviceGroupStatus;
  accessLevel?: AccessLevel;
  tags?: string[] | null;
  totalDevices?: number;
  onlineDevices?: number;
};

/**
 * Base class for paginated responses
 */
export type IoTDeviceGroupEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: IoTDeviceGroupEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type IoTDeviceGroupEntityResult = {
  value?: IoTDeviceGroupEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type IoTDeviceGroupStatus =
  | 'active'
  | 'inactive'
  | 'maintenance'
  | 'offline'
  | 'decommissioned';

export type IoTDeviceModelEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  code?: string | null;
  name?: string | null;
  description?: string | null;
  manufacturer?: ObjectId;
  modelNumber?: string | null;
  hardwareVersion?: string | null;
  supportedProtocols?: string[] | null;
  supportedFeatures?: string[] | null;
};

/**
 * Base class for paginated responses
 */
export type IoTDeviceModelEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: IoTDeviceModelEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type IoTDeviceModelEntityResult = {
  value?: IoTDeviceModelEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

/**
 * Status of an IoT Device
 */
export type IoTDeviceStatus =
  | 'active'
  | 'inactive'
  | 'maintenance'
  | 'offline'
  | 'online'
  | 'decommissioned'
  | 'idle'
  | 'banned'
  | 'updatingFirmware'
  | 'error';

export type IoTDeviceType =
  | 'gateway'
  | 'sensorNode'
  | 'edgeDevice'
  | 'actuator'
  | 'controller'
  | 'other';

export type IoTSensorEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  sensorCode?: string | null;
  sensorName?: string | null;
  type?: IoTSensorType;
  deviceId?: ObjectId;
  pinNumber?: number;
  pinInputMode?: PinInputMode;
  pinInterruptMode?: PinInterruptMode;
  unitOfMeasurement?: string | null;
  accuracy?: number;
  calibrationTime?: string | null;
  rotate?: number;
  flipHorizontal?: boolean;
  flipVertical?: boolean;
  status?: IoTSensorStatus;
};

/**
 * Base class for paginated responses
 */
export type IoTSensorEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: IoTSensorEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

export type IoTSensorEntityPaginationQuery = {
  /** List of items in the current page */
  items?: IoTSensorEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type IoTSensorEntityResult = {
  value?: IoTSensorEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type IoTSensorStatus =
  | 'operational'
  | 'maintenance'
  | 'offline'
  | 'faulty'
  | 'decommissioned';

/**
 * Io t sensor type
 */
export type IoTSensorType =
  | 'temperature'
  | 'humidity'
  | 'pressure'
  | 'light'
  | 'camera'
  | 'proximity'
  | 'accelerometer'
  | 'gyroscope'
  | 'magnetometer'
  | 'heartRate'
  | 'gps'
  | 'pingStatus'
  | 'counter'
  | 'analog'
  | 'press'
  | 'unknown';

export type IotRecordModel = {
  deviceId?: string | null;
  deviceName?: string | null;
  sensorId?: string | null;
  sensorName?: string | null;
  value?: number;
  timestamp?: string;
};

export type JobEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  workOrderId?: ObjectId;
  operationId?: ObjectId;
  outputProductId?: ObjectId;
  plannedQuantity?: number;
  status?: StationJobStatus;
  plannedStartDate?: string | null;
  plannedEndDate?: string | null;
  actualStartDate?: string | null;
  actualEndDate?: string | null;
  assignedOperatorId?: ObjectId;
  notes?: string | null;
};

/**
 * Base class for paginated responses
 */
export type JobEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: JobEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type JobEntityResult = {
  value?: JobEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type JtiTokenEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  jti?: string | null;
  expiryDate?: string;
  userId?: string | null;
  isActive?: boolean;
};

/**
 * Base class for paginated responses
 */
export type JtiTokenEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: JtiTokenEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type JtiTokenEntityResult = {
  value?: JtiTokenEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type LanguageKeyLangEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  key?: string | null;
  lang?: string | null;
  value?: string | null;
};

/**
 * Base class for paginated responses
 */
export type LanguageKeyLangEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: LanguageKeyLangEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type LanguageKeyLangEntityResult = {
  value?: LanguageKeyLangEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type LocalizationSettings = {
  defaultTimeZoneId?: string | null;
  defaultCulture?: string | null;
  defaultUnitSystem?: UnitSystem;
  dateFormat?: string | null;
  numberFormat?: string | null;
  localeOverrides?: Record<string, string> | null;
};

/**
 * Data Transfer Object for localizing application languages.
 */
export type LocalizeAppLangDto = {
  /** Gets or sets path */
  path?: string | null;
  /** Gets or sets name */
  name?: string | null;
  /** Gets or sets default culture */
  defaultCulture?: string | null;
  /** Gets or sets comment */
  comment?: string | null;
  /** Gets or sets de */
  de?: string | null;
  /** Gets or sets comment de */
  commentDe?: string | null;
  /** Gets or sets en */
  en?: string | null;
  /** Gets or sets comment en */
  commentEn?: string | null;
  /** Gets or sets es */
  es?: string | null;
  /** Gets or sets comment es */
  commentEs?: string | null;
  /** Gets or sets fr */
  fr?: string | null;
  /** Gets or sets comment fr */
  commentFr?: string | null;
  /** Gets or sets it */
  it?: string | null;
  /** Gets or sets comment it */
  commentIt?: string | null;
  /** Gets or sets ja */
  ja?: string | null;
  /** Gets or sets comment ja */
  commentJa?: string | null;
  /** Gets or sets ko */
  ko?: string | null;
  /** Gets or sets comment ko */
  commentKo?: string | null;
  /** Gets or sets nb */
  nb?: string | null;
  /** Gets or sets comment nb */
  commentNb?: string | null;
  /** Gets or sets nl */
  nl?: string | null;
  /** Gets or sets comment nl */
  commentNl?: string | null;
  /** Gets or sets pt */
  pt?: string | null;
  /** Gets or sets comment pt */
  commentPt?: string | null;
  /** Gets or sets ru */
  ru?: string | null;
  /** Gets or sets comment ru */
  commentRu?: string | null;
  /** Gets or sets sv */
  sv?: string | null;
  /** Gets or sets comment sv */
  commentSv?: string | null;
  /** Gets or sets th */
  th?: string | null;
  /** Gets or sets comment th */
  commentTh?: string | null;
  /** Gets or sets tr */
  tr?: string | null;
  /** Gets or sets comment tr */
  commentTr?: string | null;
  /** Gets or sets zh */
  zh?: string | null;
  /** Gets or sets comment zh */
  commentZh?: string | null;
  /** Gets or sets vi */
  vi?: string | null;
  /** Gets or sets comment vi */
  commentVi?: string | null;
};

/**
 * Base class for paginated responses
 */
export type LocalizeAppLangDtoBasePaginationResponse = {
  /** List of items in the current page */
  items?: LocalizeAppLangDto[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

export type LocationDimensions = {
  length?: number;
  width?: number;
  height?: number;
};

export type LocationEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  code?: string | null;
  name?: string | null;
  description?: string | null;
  address?: string | null;
  weightCapacity?: number;
  areaCapacity?: number;
  volumeCapacity?: number;
  position?: Position;
  dimensions?: LocationDimensions;
  status?: LocationStatus;
  type?: LocationType;
  allowOverCapacity?: boolean;
  allowNegativeStock?: boolean;
  allowMixedProducts?: boolean;
  allowMixedLots?: boolean;
  pickingSequence?: number;
  imageUrl?: string | null;
};

/**
 * Base class for paginated responses
 */
export type LocationEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: LocationEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type LocationEntityResult = {
  value?: LocationEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

/**
 * Trạng thái vị trí
 */
export type LocationStatus = 'active' | 'maintenance' | 'hold';

/**
 * Loại vị trí trong kho hoặc nhà xưởng
 */
export type LocationType =
  | 'aisle'
  | 'rack'
  | 'shelf'
  | 'bin'
  | 'floor'
  | 'receivingDock'
  | 'shippingDock'
  | 'station';

export type MachineEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  code?: string | null;
  name?: string | null;
  description?: string | null;
  machineTypeId?: ObjectId;
  departmentId?: ObjectId;
  locationId?: ObjectId;
  calculationMode?: OutputCalculationMode;
  ignoreZeroValueInParallelChannelMode?: boolean;
  calendarId?: ObjectId;
};

/**
 * Base class for paginated responses
 */
export type MachineEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: MachineEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type MachineEntityResult = {
  value?: MachineEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type MachineGroupEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  code?: string | null;
  name?: string | null;
  description?: string | null;
  groupType?: MachineGroupType;
};

/**
 * Base class for paginated responses
 */
export type MachineGroupEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: MachineGroupEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type MachineGroupEntityResult = {
  value?: MachineGroupEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type MachineGroupMachineMapping = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  machineGroupId?: ObjectId;
  machineId?: ObjectId;
};

/**
 * Base class for paginated responses
 */
export type MachineGroupMachineMappingBasePaginationResponse = {
  /** List of items in the current page */
  items?: MachineGroupMachineMapping[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type MachineGroupMachineMappingResult = {
  value?: MachineGroupMachineMapping;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type MachineGroupType = 'general' | 'byPosition' | 'byFunction';

export type MachineOutputMapping = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  machineId?: ObjectId;
  sensorId?: ObjectId;
  scalingFactor?: number;
};

/**
 * Base class for paginated responses
 */
export type MachineOutputMappingBasePaginationResponse = {
  /** List of items in the current page */
  items?: MachineOutputMapping[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type MachineOutputMappingResult = {
  value?: MachineOutputMapping;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type MachineSettings = {
  enableTelemetry?: boolean;
  telemetryEndpoint?: string | null;
  telemetryAuthToken?: string | null;
  heartbeatIntervalSeconds?: number;
  machineDownAlertSeconds?: number;
  preventiveMaintenanceDefaultDays?: number;
};

export type MachineTypeEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  code?: string | null;
  name?: string | null;
  description?: string | null;
  category?: WorkCenterResourceCategory;
};

/**
 * Base class for paginated responses
 */
export type MachineTypeEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: MachineTypeEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type MachineTypeEntityResult = {
  value?: MachineTypeEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type MaintenanceSettings = {
  templates?: MaintenanceTaskTemplate[] | null;
  enablePredictiveMaintenance?: boolean;
  defaultSparePartsStockDays?: number;
};

export type MaintenanceTaskTemplate = {
  key?: string | null;
  description?: string | null;
  triggerHours?: number;
};

export type ManufacturerEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  code?: string | null;
  name?: string | null;
  address?: string | null;
  contactNumber?: string | null;
  email?: string | null;
  website?: string | null;
};

/**
 * Base class for paginated responses
 */
export type ManufacturerEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: ManufacturerEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type ManufacturerEntityResult = {
  value?: ManufacturerEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type MemorySchemaEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  userId?: string | null;
  sessionId?: string | null;
  key?: string | null;
  memoryContent?: string | null;
  importance?: number;
  lastAccessed?: string;
};

/**
 * Base class for paginated responses
 */
export type MemorySchemaEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: MemorySchemaEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type MemorySchemaEntityResult = {
  value?: MemorySchemaEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type MongoBlob = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  bulketName?: string | null;
  version?: string | null;
  prefix?: string | null;
  name?: string | null;
  chunkIndex?: number;
  contentType?: string | null;
  data?: string | null;
  size?: number;
  description?: string | null;
  metadata?: string | null;
  additionalProperties?: Record<string, unknown> | null;
};

/**
 * Base class for paginated responses
 */
export type MongoBlobBasePaginationResponse = {
  /** List of items in the current page */
  items?: MongoBlob[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type MongoBlobResult = {
  value?: MongoBlob;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type MqttControllerDisconnectClientRequest = {
  clientId: string | null;
  reason?: DisconnectReason;
  reasonString?: string | null;
  disconnectReasonCode?: MqttDisconnectReasonCode;
};

export type MqttControllerGetClientsResponse = {
  id: string | null;
  bytesReceived?: number;
  bytesSent?: number;
  connectedTimestamp?: string;
  remoteEndPoint: string | null;
  lastNonKeepAlivePacketReceivedTimestamp?: string;
  lastPacketReceivedTimestamp?: string;
  lastPacketSentTimestamp?: string;
  protocolVersion: string | null;
  receivedApplicationMessagesCount?: number;
  receivedPacketsCount?: number;
  sentApplicationMessagesCount?: number;
  sentPacketsCount?: number;
};

export type MqttControllerGetClientsResponsePaginationQuery = {
  /** List of items in the current page */
  items?: MqttControllerGetClientsResponse[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

export type MqttControllerGetTemplateResponse = {
  topic?: string | null;
  description?: string | null;
};

export type MqttDisconnectReasonCode =
  | 'normalDisconnection'
  | 'disconnectWithWillMessage'
  | 'unspecifiedError'
  | 'malformedPacket'
  | 'protocolError'
  | 'implementationSpecificError'
  | 'notAuthorized'
  | 'serverBusy'
  | 'serverShuttingDown'
  | 'keepAliveTimeout'
  | 'sessionTakenOver'
  | 'topicFilterInvalid'
  | 'topicNameInvalid'
  | 'receiveMaximumExceeded'
  | 'topicAliasInvalid'
  | 'packetTooLarge'
  | 'messageRateTooHigh'
  | 'quotaExceeded'
  | 'administrativeAction'
  | 'payloadFormatInvalid'
  | 'retainNotSupported'
  | 'qoSNotSupported'
  | 'useAnotherServer'
  | 'serverMoved'
  | 'sharedSubscriptionsNotSupported'
  | 'connectionRateExceeded'
  | 'maximumConnectTime'
  | 'subscriptionIdentifiersNotSupported'
  | 'wildcardSubscriptionsNotSupported';

export type NotificationSettings = {
  useEmail?: boolean;
  emailFrom?: string | null;
  useSms?: boolean;
  smsProvider?: string | null;
  slackWebhookUrl?: string | null;
  escalationChain?: EscalationStep[] | null;
};

export type ObjectId = {
  timestamp?: number;
  creationTime?: string;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type ObjectResult = {
  /** Gets the value of the result. */
  value?: unknown | null;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type OneTimeLoginTokenEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  userId?: ObjectId;
  token?: string | null;
  expiresAt?: string;
  createdAt?: string;
  consumedAt?: string | null;
  requestIpAddress?: string | null;
  consumedIpAddress?: string | null;
  isExpired?: boolean;
  isConsumed?: boolean;
  isActive?: boolean;
};

/**
 * Base class for paginated responses
 */
export type OneTimeLoginTokenEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: OneTimeLoginTokenEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type OneTimeLoginTokenEntityResult = {
  value?: OneTimeLoginTokenEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type OperationEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  routingVersionId?: ObjectId;
  sequenceNumber?: number;
  code?: string | null;
  name?: string | null;
  description?: string | null;
  workCenterTypeId?: ObjectId;
  standardSetupTime?: string;
  standardRunTimePerUnit?: string;
  defaultEfficiencyFactor?: number;
  outputMappings?: OperationOutputMapping[] | null;
};

/**
 * Base class for paginated responses
 */
export type OperationEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: OperationEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type OperationEntityResult = {
  value?: OperationEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type OperationOutputMapping = {
  mappedIoTPointId?: string | null;
  componentProductCode?: string | null;
  quantityPerSignal?: number;
  disposition?: ProductionDisposition;
};

export type OperationParameterSettingEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  operationId?: ObjectId;
  parameterDefCode?: string | null;
  parameterName?: string | null;
  targetValue?: string | null;
  minValue?: string | null;
  maxValue?: string | null;
  unitOfMeasure?: UnitOfMeasure;
  monitoredByIoTPointId?: ObjectId;
  isMonitoredByIoT?: boolean;
  isRequired?: boolean;
  isActive?: boolean;
  description?: string | null;
};

/**
 * Base class for paginated responses
 */
export type OperationParameterSettingEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: OperationParameterSettingEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type OperationParameterSettingEntityResult = {
  value?: OperationParameterSettingEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type OperationVariantEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  workCenterId?: ObjectId;
};

/**
 * Base class for paginated responses
 */
export type OperationVariantEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: OperationVariantEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type OperationVariantEntityResult = {
  value?: OperationVariantEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type OperatorStationLogEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  stationId?: ObjectId;
  stationJobId?: ObjectId;
  clockInTime?: string;
  clockOutTime?: string | null;
  notes?: string | null;
};

/**
 * Base class for paginated responses
 */
export type OperatorStationLogEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: OperatorStationLogEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type OperatorStationLogEntityResult = {
  value?: OperatorStationLogEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type OrganizationSettings = {
  companyName?: string | null;
  address?: string | null;
  taxId?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  defaultSiteId?: string | null;
  sites?: SiteInfo[] | null;
};

/**
 * Specifies how the final output quantity of a machine is calculated.
 */
export type OutputCalculationMode = 'pairParallel' | 'weightedChannels';

export type PageEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  uri?: string | null;
  title?: string | null;
  description?: string | null;
  order?: number;
  durationMs?: number | null;
  forceLoad?: boolean;
  isActive?: boolean;
  tags?: string[] | null;
};

/**
 * Base class for paginated responses
 */
export type PageEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: PageEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type PageEntityResult = {
  value?: PageEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type ParaphraseMapEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  documentId?: ObjectId;
  description?: string;
};

/**
 * Base class for paginated responses
 */
export type ParaphraseMapEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: ParaphraseMapEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type ParaphraseMapEntityResult = {
  value?: ParaphraseMapEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type PasswordPolicy = {
  minimumLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireDigit?: boolean;
  requireSpecial?: boolean;
  passwordExpireDays?: number;
};

export type PerformanceSettings = {
  apiRateLimitPerMinute?: number;
  maxBatchSize?: number;
  jobConcurrency?: number;
  queueRetryCount?: number;
};

/**
 * Represents categories of permissions within the application.
 */
export type PermissionCategory = 'controller' | 'page';

export type PermissionEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  type?: PermissionType;
  category?: PermissionCategory;
  name?: string | null;
  description?: string | null;
};

/**
 * Base class for paginated responses
 */
export type PermissionEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: PermissionEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type PermissionEntityResult = {
  value?: PermissionEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

/**
 * Represents application claim types with associated localized text and RGB color attributes.
 */
export type PermissionType = 'permission' | 'department' | 'employeeId' | 'securityClearance';

export type PinInputMode =
  | 'unspecified'
  | 'input'
  | 'output'
  | 'pullUp'
  | 'inputPullUp'
  | 'pullDown'
  | 'inputPullDown'
  | 'openDrain'
  | 'outputOpenDrain'
  | 'analog';

export type PinInterruptMode =
  | 'disabled'
  | 'risingEdge'
  | 'fallingEdge'
  | 'edgeChange'
  | 'lowThreshold'
  | 'highThreshold'
  | 'lowWaveformEdge'
  | 'highWaveformEdge';

export type Position = {
  x?: number;
  y?: number;
  z?: number;
};

export type ProblemDetails = {
  type?: string | null;
  title?: string | null;
  status?: number | null;
  detail?: string | null;
  instance?: string | null;
};

/**
 * Product dimensions data
 */
export type ProductDimensions = {
  /** Length in specified unit */
  length?: number;
  /** Width in specified unit */
  width?: number;
  /** Height in specified unit */
  height?: number;
};

export type ProductEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  name?: string | null;
  code?: string | null;
  description?: string | null;
  unitOfMeasure?: UnitOfMeasure;
  productType?: ProductType;
  dimensions?: ProductDimensions;
  weight?: number;
  image?: string | null;
};

/**
 * Base class for paginated responses
 */
export type ProductEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: ProductEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type ProductEntityResult = {
  value?: ProductEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type ProductType =
  | 'finishedGood'
  | 'assembly'
  | 'component'
  | 'rawMaterial'
  | 'subAssembly'
  | 'service'
  | 'nonStockItem'
  | 'tooling'
  | 'consumable'
  | 'digital'
  | 'unknown';

/**
 * Enum để phân loại sản lượng
 */
export type ProductionDisposition = 'good' | 'scrap' | 'rework';

export type ProductionOrderEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  orderNumber?: string | null;
  productId?: ObjectId;
  priority?: number;
  plannedQuantity?: number;
  customerOrderReference?: string | null;
  notes?: string | null;
  plannedDate?: string;
  actualStartDate?: string | null;
  actualEndDate?: string | null;
  status?: ProductionStatus;
};

/**
 * Base class for paginated responses
 */
export type ProductionOrderEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: ProductionOrderEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type ProductionOrderEntityResult = {
  value?: ProductionOrderEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type ProductionSettings = {
  schedulingAlgorithm?: SchedulingAlgorithm;
  planningHorizonDays?: number;
  defaultScrapPercent?: number;
};

export type ProductionStatus =
  | 'inPlanning'
  | 'pending'
  | 'scheduled'
  | 'ready'
  | 'inProgress'
  | 'paused'
  | 'completed'
  | 'completedShort'
  | 'closed'
  | 'cancelled';

/**
 * Request to login using a QR code token
 */
export type QrLoginRequest = {
  /** The one-time use token from the QR code */
  token?: string | null;
};

/**
 * Response containing a one-time login token for QR code authentication
 */
export type QrLoginTokenResponse = {
  /** The one-time use token that can be encoded in a QR code */
  token?: string | null;
  /** The full URL that can be used to login with this token (optional, for client convenience) */
  loginUrl?: string | null;
  /** When the token expires (UTC) */
  expiresAt?: string;
  /** How long the token is valid for (in seconds) */
  expiresInSeconds?: number;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type QrLoginTokenResponseResult = {
  value?: QrLoginTokenResponse;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type QualityCheckPointEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  operationDefinitionCode?: string | null;
  checkName?: string | null;
  type?: QualityCheckType;
  measurementMethod?: string | null;
  frequency?: string | null;
  characteristicToMeasure?: string | null;
  targetValueQc?: string | null;
  lowerSpecificationLimit?: string | null;
  upperSpecificationLimit?: string | null;
  unitOfMeasureQc?: UnitOfMeasure;
  measuredByIoTPointId?: ObjectId;
  acceptanceCriteriaText?: string | null;
  referenceStandardId?: string | null;
};

/**
 * Base class for paginated responses
 */
export type QualityCheckPointEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: QualityCheckPointEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type QualityCheckPointEntityResult = {
  value?: QualityCheckPointEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type QualityCheckType = 'quantitative' | 'qualitative';

export type QualitySettings = {
  defaultInspectionSampleSize?: number;
  nonconformanceWorkflowKey?: string | null;
  acceptanceTolerancePercent?: number;
  testResultRetentionDays?: number;
};

/**
 * DTO for collection cleanup result
 */
export type QuartzCollectionCleanupResultDto = {
  /** Collection name that was deleted */
  collectionName?: string | null;
  /** Whether the deletion was successful */
  success?: boolean;
  /** Error message if deletion failed */
  errorMessage?: string | null;
};

/**
 * DTO representing a Quartz MongoDB collection information
 */
export type QuartzCollectionDto = {
  /** Collection name */
  collectionName?: string | null;
  /** Number of documents in the collection */
  documentCount?: number;
  /** Collection size in bytes */
  sizeInBytes?: number;
};

/**
 * DTO representing a Quartz.NET job information
 */
export type QuartzJobDto = {
  /** Job name */
  jobName?: string | null;
  /** Job group */
  jobGroup?: string | null;
  /** Job description */
  description?: string | null;
  /** Job type full name */
  jobType?: string | null;
  /** Current job state (NORMAL, PAUSED, COMPLETE, ERROR, BLOCKED, NONE) */
  state?: string | null;
  /** Associated triggers for this job */
  triggers?: QuartzTriggerDto[] | null;
  /** Last fire time (if available) */
  lastFireTime?: string | null;
  /** Next fire time (if available) */
  nextFireTime?: string | null;
  /** Whether the job is durable (survives when no triggers reference it) */
  isDurable?: boolean;
  /** Whether the job is currently executing */
  isCurrentlyExecuting?: boolean;
  /** Job data map keys */
  jobDataMap?: Record<string, string> | null;
};

/**
 * DTO for job summary statistics
 */
export type QuartzJobSummaryDto = {
  /** Total number of jobs */
  totalJobs?: number;
  /** Number of currently executing jobs */
  executingJobs?: number;
  /** Number of paused jobs */
  pausedJobs?: number;
  /** Number of blocked jobs */
  blockedJobs?: number;
  /** Number of jobs in error state */
  errorJobs?: number;
  /** Number of normal/scheduled jobs */
  normalJobs?: number;
  /** Total number of triggers */
  totalTriggers?: number;
  /** Number of jobs by group */
  jobsByGroup?: Record<string, number> | null;
  /** Scheduler name */
  schedulerName?: string | null;
  /** Scheduler instance ID */
  schedulerInstanceId?: string | null;
  /** Whether the scheduler is started */
  isStarted?: boolean;
  /** Whether the scheduler is in standby mode */
  isInStandbyMode?: boolean;
  /** Whether the scheduler is shutdown */
  isShutdown?: boolean;
  /** Number of jobs executed since scheduler start */
  jobsExecutedSinceStart?: number;
};

/**
 * DTO representing a Quartz.NET trigger information
 */
export type QuartzTriggerDto = {
  /** Trigger name */
  triggerName?: string | null;
  /** Trigger group */
  triggerGroup?: string | null;
  /** Trigger state (NORMAL, PAUSED, COMPLETE, ERROR, BLOCKED, NONE) */
  state?: string | null;
  /** Trigger type (SimpleTrigger, CronTrigger, etc.) */
  triggerType?: string | null;
  /** Start time */
  startTime?: string;
  /** End time (if set) */
  endTime?: string | null;
  /** Previous fire time */
  previousFireTime?: string | null;
  /** Next fire time */
  nextFireTime?: string | null;
  /** Priority */
  priority?: number;
  /** Cron expression (for CronTrigger) */
  cronExpression?: string | null;
  /** Repeat interval in milliseconds (for SimpleTrigger) */
  repeatInterval?: number | null;
  /** Times triggered */
  timesTriggered?: number;
};

export type RaidType = 'raid5' | 'raid6' | 'raid0' | 'raid1';

export type RefreshTokenEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  userId?: ObjectId;
  token?: string | null;
  expiresAt?: string;
  createdAt?: string;
  revokedAt?: string | null;
  replacedByToken?: string | null;
  isExpired?: boolean;
  isRevoked?: boolean;
  isActive?: boolean;
};

/**
 * Base class for paginated responses
 */
export type RefreshTokenEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: RefreshTokenEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type RefreshTokenEntityResult = {
  value?: RefreshTokenEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

/**
 * Represents a request to obtain a new JWT access token using a refresh token.
 */
export type RefreshTokenRequest = {
  /** The refresh token used to request a new access token. */
  refreshToken?: string | null;
};

/**
 * Represents the rendering mode of the application.
 */
export type RenderMode = 'letSystemDecide' | 'server' | 'webAssembly' | 'hybrid';

export type ReportingSettings = {
  defaultDashboardPerRole?: Record<string, string> | null;
  scheduledReportRecipients?: string[] | null;
  defaultExportFormat?: string | null;
};

/**
 * DTO for creating a new IoT device.
 */
export type RequestToCreateDto = {
  deviceDto: IoTDeviceDto;
};

export type RoleEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  name?: string | null;
  normalizedName?: string | null;
  description?: string | null;
};

/**
 * Base class for paginated responses
 */
export type RoleEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: RoleEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type RoleEntityResult = {
  value?: RoleEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type RolePermissionEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  roleId?: ObjectId;
  permissionId?: ObjectId;
};

/**
 * Base class for paginated responses
 */
export type RolePermissionEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: RolePermissionEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type RolePermissionEntityResult = {
  value?: RolePermissionEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

/**
 * Enum định nghĩa trạng thái hoạt động của một API route.
 */
export type RouteStatus = 'active' | 'inactive' | 'maintenance';

export type RouteType = 'execute' | 'forward';

export type RoutingEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  routingMasterId?: ObjectId;
  versionNumber?: number;
  versionNotes?: string | null;
  productId?: ObjectId;
  name?: string | null;
  description?: string | null;
  isActive?: boolean;
  effectiveStartDate?: string | null;
  effectiveEndDate?: string | null;
};

/**
 * Base class for paginated responses
 */
export type RoutingEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: RoutingEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type RoutingEntityResult = {
  value?: RoutingEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type SchedulingAlgorithm = 'finite' | 'infinite' | 'heuristic';

/**
 * Represents the classification of scripts in the system.
 */
export type ScriptClassify =
  | 'utility'
  | 'dataProcessing'
  | 'integration'
  | 'maintenance'
  | 'monitoring'
  | 'reporting'
  | 'custom';

export type ScriptDefinitionEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  name?: string | null;
  script?: string | null;
  pluginPath?: string | null;
  hash?: string | null;
  description?: string | null;
  maxAwaitTime?: string | null;
  returnFullQualifiedName?: string | null;
  returnQualifiedName?: string | null;
  requestToDefine?: boolean;
  version?: number;
};

/**
 * Base class for paginated responses
 */
export type ScriptDefinitionEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: ScriptDefinitionEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

export type ScriptDefinitionEntityPaginationQuery = {
  /** List of items in the current page */
  items?: ScriptDefinitionEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type ScriptDefinitionEntityResult = {
  value?: ScriptDefinitionEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type ScriptExecutionRequest = {
  sourceCode: string;
  parameters?: Record<string, unknown> | null;
};

export type ScriptVariantDto = {
  id?: ObjectId;
  /** Represents the date and time when the entity was created. */
  createTime?: string;
  /** Represents the date and time when the entity was last modified. */
  modifiedTime?: string;
  scriptDefineId?: ObjectId;
  name?: string | null;
  interval?: AggregationInterval;
  classify?: ScriptClassify;
  aggregationEnabled?: boolean;
  /** Represents a collection of field parameters and their types. */
  variables?: StringObjectKeyValuePair[] | null;
  keepAlive?: boolean;
};

export type ScriptVariantEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  scriptDefineId?: ObjectId;
  name?: string | null;
  interval?: AggregationInterval;
  classify?: ScriptClassify;
  aggregationEnabled?: boolean;
  /** Represents a collection of field parameters and their types. */
  variables?: StringObjectKeyValuePair[] | null;
  keepAlive?: boolean;
};

/**
 * Base class for paginated responses
 */
export type ScriptVariantEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: ScriptVariantEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

export type ScriptVariantEntityPaginationQuery = {
  /** List of items in the current page */
  items?: ScriptVariantEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type ScriptVariantEntityResult = {
  value?: ScriptVariantEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type SecuritySettings = {
  require2FaForAdmins?: boolean;
  sessionTimeoutMinutes?: number;
  passwordPolicy?: PasswordPolicy;
  enableAuditLog?: boolean;
  encryptDataAtRest?: boolean;
  ipAllowList?: string[] | null;
  ipBlockList?: string[] | null;
  ssoProvider?: string | null;
  ssoMetadataUrl?: string | null;
};

export type SelectScriptRequest = {
  /** Represents a collection of field parameters and their types. */
  variables?: StringObjectKeyValuePair[] | null;
  scriptId?: ObjectId;
};

export type SensorDeviceDto = {
  id?: ObjectId;
  /** Represents the date and time when the entity was created. */
  createTime?: string;
  /** Represents the date and time when the entity was last modified. */
  modifiedTime?: string;
  /** Gets or sets calibration time */
  sensorCode?: string | null;
  sensorName?: string | null;
  type?: IoTSensorType;
  deviceId?: ObjectId;
  pinNumber?: number;
  pinInputMode?: PinInputMode;
  pinInterruptMode?: PinInterruptMode;
  unitOfMeasurement?: string | null;
  accuracy?: number;
  calibrationTime?: string | null;
  /** Equals */
  rotate?: number;
  flipHorizontal?: boolean;
  flipVertical?: boolean;
  status?: IoTSensorStatus;
  deviceName?: string | null;
};

export type SensorDeviceDtoPaginationQuery = {
  /** List of items in the current page */
  items?: SensorDeviceDto[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

export type SensorDto = {
  id: ObjectId;
  sensorId?: string | null;
  deviceName?: string | null;
  sensorName?: string | null;
  type?: IoTSensorType;
};

export type SensorDtoPaginationQuery = {
  /** List of items in the current page */
  items?: SensorDto[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Định nghĩa ca làm việc cho một ngày cụ thể trong tuần.
Bao gồm giờ bắt đầu, giờ kết thúc và các khoảng nghỉ trong ca.
 */
export type ShiftDefinition = {
  applicableDay?: DayOfWeek;
  /** Giờ bắt đầu (VD: 08:00:00) */
  startTime?: string;
  /** Giờ kết thúc (VD: 17:00:00). Nếu ca qua đêm, giá trị này sẽ nhỏ hơn StartTime */
  endTime?: string;
  /** Danh sách các định nghĩa nghỉ trong ca */
  breakDefinitions?: BreakDefinition[] | null;
  /** Có phải ca làm thêm giờ hay không */
  isOverTimeShift?: boolean;
};

export type ShiftTemplateEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  code?: string | null;
  name?: string | null;
  shifts?: ShiftDefinition[] | null;
};

/**
 * Base class for paginated responses
 */
export type ShiftTemplateEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: ShiftTemplateEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type ShiftTemplateEntityResult = {
  value?: ShiftTemplateEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type SiteInfo = {
  id?: string;
  name?: string | null;
  timeZoneId?: string | null;
};

export type SlideShowEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  name?: string | null;
  description?: string | null;
  defaultDurationMs?: number;
  loop?: boolean;
  forceLoadPages?: boolean;
  isActive?: boolean;
  createdByUserId?: ObjectId;
  tags?: string[] | null;
  pageIds?: ObjectId[] | null;
  pages?: PageEntity[] | null;
  pageCount?: number;
  estimatedTotalDurationMs?: number;
};

/**
 * Base class for paginated responses
 */
export type SlideShowEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: SlideShowEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type SlideShowEntityResult = {
  value?: SlideShowEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type SortType = {
  sortBy?: string | null;
  descending?: boolean;
};

export type StationEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  code?: string | null;
  name?: string | null;
  description?: string | null;
  machineId?: ObjectId;
  locationId?: ObjectId;
  numberOfIdenticalUnits?: number;
  imageUrl?: string | null;
};

/**
 * Base class for paginated responses
 */
export type StationEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: StationEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type StationEntityResult = {
  value?: StationEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type StationGroupEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  code?: string | null;
  name?: string | null;
};

/**
 * Base class for paginated responses
 */
export type StationGroupEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: StationGroupEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type StationGroupEntityResult = {
  value?: StationGroupEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type StationGroupStationMapping = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  stationGroupId?: ObjectId;
  stationId?: ObjectId;
};

/**
 * Base class for paginated responses
 */
export type StationGroupStationMappingBasePaginationResponse = {
  /** List of items in the current page */
  items?: StationGroupStationMapping[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type StationGroupStationMappingResult = {
  value?: StationGroupStationMapping;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type StationJobStatus =
  | 'pending'
  | 'scheduled'
  | 'ready'
  | 'inProgress'
  | 'paused'
  | 'completed'
  | 'failed'
  | 'cancelled';

export type StopEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  code?: string | null;
  name?: string | null;
};

/**
 * Base class for paginated responses
 */
export type StopEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: StopEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type StopEntityResult = {
  value?: StopEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type StorageBlockEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  storageId?: ObjectId;
  absolutePath?: string | null;
  size?: number;
  status?: FileRaidStatus;
  index?: number;
};

/**
 * Base class for paginated responses
 */
export type StorageBlockEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: StorageBlockEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type StorageBlockEntityResult = {
  value?: StorageBlockEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type StorageRecordEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  fileVersionId?: ObjectId;
  stripSize?: number;
  raidType?: RaidType;
  checkSum?: string | null;
  size?: number;
};

/**
 * Base class for paginated responses
 */
export type StorageRecordEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: StorageRecordEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type StorageRecordEntityResult = {
  value?: StorageRecordEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type StringObjectKeyValuePair = {
  key?: string | null;
  value?: unknown | null;
};

export type SupplierEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
};

/**
 * Base class for paginated responses
 */
export type SupplierEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: SupplierEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type SupplierEntityResult = {
  value?: SupplierEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type SystemErrorReportCommentEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  errorReportId: ObjectId;
  userId: ObjectId;
  content: string | null;
  attachments?: string[] | null;
  reactions?: CommentReaction[] | null;
  isDeleted?: boolean;
  deletedAt?: string | null;
  deletedBy?: ObjectId;
  lastEditedAt?: string | null;
  isEdited?: boolean;
};

/**
 * Base class for paginated responses
 */
export type SystemErrorReportCommentEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: SystemErrorReportCommentEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type SystemErrorReportCommentEntityResult = {
  value?: SystemErrorReportCommentEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type SystemErrorReportDto = {
  id?: ObjectId;
  /** Represents the date and time when the entity was created. */
  createTime?: string;
  /** Represents the date and time when the entity was last modified. */
  modifiedTime?: string;
  errorType?: SystemErrorType;
  /** The main error message reported by the client */
  errorMessage?: string | null;
  /** Detailed error information */
  errorDetails?: string | null;
  /** Information about the client */
  clientInfo?: string | null;
  /** The user identifier */
  userId?: string | null;
  /** The time when the error occurred (UTC) */
  occurredAt?: string;
  /** The URL or route where the error happened */
  url?: string | null;
  /** The client application version */
  appVersion?: string | null;
  /** Any additional data or context */
  additionalData?: string | null;
  /** The rendering mode of the application when the error occurred */
  renderMode?: string | null;
  /** Developer's diagnosis or notes */
  diagnosis?: string | null;
  progressStatus?: SystemErrorReportStatus;
  /** List of image IDs or file paths */
  attachments?: string[] | null;
  /** The timestamp when the report was last updated */
  lastUpdatedAt?: string;
  /** Final conclusion or resolution summary */
  conclusion?: string | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type SystemErrorReportDtoListResult = {
  /** Gets the value of the result. */
  value?: SystemErrorReportDto[] | null;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type SystemErrorReportEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  errorType: SystemErrorType;
  errorMessage: string | null;
  errorDetails?: string | null;
  clientInfo?: string | null;
  userId?: ObjectId;
  occurredAt?: string;
  url?: string | null;
  appVersion?: string | null;
  additionalData?: string | null;
  renderMode?: string | null;
  diagnosis?: string | null;
  progressStatus?: SystemErrorReportStatus;
  relatedIssueIds?: ObjectId[] | null;
  attachments?: string[] | null;
  assignedTo?: ObjectId[] | null;
  watchedBy?: ObjectId[] | null;
  lastUpdatedAt?: string;
  conclusion?: string | null;
};

/**
 * Base class for paginated responses
 */
export type SystemErrorReportEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: SystemErrorReportEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type SystemErrorReportEntityResult = {
  value?: SystemErrorReportEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

/**
 * Represents the progress status of a system error report.
 */
export type SystemErrorReportStatus = 'new' | 'inProgress' | 'resolved' | 'closed' | 'rejected';

/**
 * System error type
 */
export type SystemErrorType =
  | 'unknown'
  | 'system'
  | 'validation'
  | 'network'
  | 'api'
  | 'authentication'
  | 'authorization'
  | 'clientLogic'
  | 'timeout'
  | 'resourceNotFound'
  | 'conflict'
  | 'dependency'
  | 'configuration'
  | 'userAction'
  | 'thirdParty'
  | 'warning'
  | 'info';

export type SystemSettingEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  startDayAt?: string;
  organization?: OrganizationSettings;
  security?: SecuritySettings;
  localization?: LocalizationSettings;
  inventory?: InventorySettings;
  production?: ProductionSettings;
  machines?: MachineSettings;
  quality?: QualitySettings;
  maintenance?: MaintenanceSettings;
  integrations?: IntegrationSettings;
  notifications?: NotificationSettings;
  reporting?: ReportingSettings;
  billing?: BillingSettings;
  backup?: BackupSettings;
  performance?: PerformanceSettings;
  additionalSettings?: Record<string, string> | null;
};

/**
 * Base class for paginated responses
 */
export type SystemSettingEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: SystemSettingEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type SystemSettingEntityResult = {
  value?: SystemSettingEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type TryRunMetricRequest = {
  script?: string | null;
  /** Represents a collection of field parameters and their types. */
  variables?: StringObjectKeyValuePair[] | null;
};

/**
 * Represents the unit of measure for quantities in the system.
 */
export type UnitOfMeasure =
  | 'none'
  | 'piece'
  | 'kilogram'
  | 'gram'
  | 'liter'
  | 'milliliter'
  | 'meter'
  | 'centimeter'
  | 'millimeter'
  | 'inch'
  | 'foot'
  | 'yard'
  | 'gallon'
  | 'pound'
  | 'ounce';

export type UnitSystem = 'metric' | 'imperial';

export type UpdateTenantRequest = {
  databaseName?: string | null;
  userName?: string | null;
  password?: string | null;
  maxConnectionPoolSize?: number;
  replicaSetMembers?: string[] | null;
  replicaSetName?: string | null;
  defaultPort?: number;
  cephServiceUrl?: string | null;
  cephUsername?: string | null;
  cephAccessKey?: string | null;
  cephSecretKey?: string | null;
  cephBucketName?: string | null;
  id?: string | null;
  identifier?: string | null;
  name?: string | null;
};

/**
 * Data transfer object for updating user information
 */
export type UpdateUserInfoDto = {
  fullName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  country?: string | null;
  gender?: string | null;
  birthDay?: string | null;
  nickname?: string | null;
};

/**
 * Represents the supported HTTP methods for upstream API gateway routing.
 */
export type UpstreamHttpMethod = 'get' | 'put' | 'delete' | 'post' | 'patch' | 'head';

export type UserDepartmentEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  userId?: ObjectId;
  departmentId?: ObjectId;
};

/**
 * Base class for paginated responses
 */
export type UserDepartmentEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: UserDepartmentEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type UserDepartmentEntityResult = {
  value?: UserDepartmentEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type UserEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  username?: string | null;
  fullname?: string | null;
  nickname?: string | null;
  normalizedUserName?: string | null;
  passwordHash?: string | null;
  email?: string | null;
  normalizedEmail?: string | null;
  emailConfirmed?: boolean;
  phoneNumber?: string | null;
  phoneNumberConfirmed?: string | null;
  avatar?: string | null;
  isDeleted?: boolean;
  birthDay?: string;
  banner?: string | null;
  country?: string | null;
  gender?: string | null;
  lockScreenPasswordHash?: string | null;
  securityStamp?: string | null;
  concurrencyStamp?: string | null;
  twoFactorEnabled?: boolean;
  lockoutEnd?: string | null;
  lockoutEnabled?: boolean;
  accessFailedCount?: number;
};

/**
 * Base class for paginated responses
 */
export type UserEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: UserEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type UserEntityResult = {
  value?: UserEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

/**
 * Data transfer object for user information including settings
 */
export type UserInfoDto = {
  fullName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  country?: string | null;
  gender?: string | null;
  birthDay?: string | null;
  culture?: string | null;
  renderMode?: RenderMode;
  twoFactorEnabled?: boolean;
  emailConfirmed?: boolean;
  nickname?: string | null;
  userName: string | null;
};

export type UserLogHistoryEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  userId?: ObjectId;
  isFailed?: boolean;
};

/**
 * Base class for paginated responses
 */
export type UserLogHistoryEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: UserLogHistoryEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type UserLogHistoryEntityResult = {
  value?: UserLogHistoryEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type UserLoginInfoPocoEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  userId?: ObjectId;
  loginProvider?: string | null;
  providerKey?: string | null;
  providerDisplayName?: string | null;
};

/**
 * Base class for paginated responses
 */
export type UserLoginInfoPocoEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: UserLoginInfoPocoEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type UserLoginInfoPocoEntityResult = {
  value?: UserLoginInfoPocoEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type UserPasskeyEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  userId?: ObjectId;
  credentialId?: string | null;
  publicKey?: string | null;
  name?: string | null;
  createdAt?: string;
  signCount?: number;
  transports?: string[] | null;
  isUserVerified?: boolean;
  isBackupEligible?: boolean;
  isBackedUp?: boolean;
  attestationObject?: string | null;
  clientDataJson?: string | null;
};

/**
 * Base class for paginated responses
 */
export type UserPasskeyEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: UserPasskeyEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type UserPasskeyEntityResult = {
  value?: UserPasskeyEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type UserPermissionEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  userId?: ObjectId;
  permissionId?: ObjectId;
};

/**
 * Base class for paginated responses
 */
export type UserPermissionEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: UserPermissionEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type UserPermissionEntityResult = {
  value?: UserPermissionEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type UserRoleEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  userId?: ObjectId;
  roleId?: ObjectId;
};

/**
 * Base class for paginated responses
 */
export type UserRoleEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: UserRoleEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type UserRoleEntityResult = {
  value?: UserRoleEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type UserSettingEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  userId?: ObjectId;
  theme?: string | null;
  isDarkMode?: boolean | null;
  culture?: string | null;
  renderMode?: RenderMode;
};

/**
 * Base class for paginated responses
 */
export type UserSettingEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: UserSettingEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type UserSettingEntityResult = {
  value?: UserSettingEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type WarehouseEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  code?: string | null;
  name?: string | null;
  description?: string | null;
  type?: WarehouseType;
  status?: WarehouseStatus;
};

/**
 * Base class for paginated responses
 */
export type WarehouseEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: WarehouseEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type WarehouseEntityResult = {
  value?: WarehouseEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type WarehouseStatus = 'active' | 'inactive' | 'underConstruction';

export type WarehouseType = 'rawMaterial' | 'workInProgress' | 'finishedGoods' | 'quarantine';

export type WebhookEndpoint = {
  url?: string | null;
  eventTypes?: string[] | null;
  secret?: string | null;
};

export type WebhookEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  code?: string | null;
  name: string;
  targetUrl: string;
  eventName: string;
  status?: WebhookStatus;
  secret?: string | null;
  pluginId: ObjectId;
  successCount?: number;
  failureCount?: number;
  averageResponseTimeMs?: number;
  lastAttemptAt?: string | null;
  lastSuccessAt?: string | null;
  lastErrorMessage?: string | null;
  isPayloadEncrypted?: boolean;
  publicKey?: string | null;
};

/**
 * Base class for paginated responses
 */
export type WebhookEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: WebhookEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type WebhookEntityResult = {
  value?: WebhookEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

/**
 * Enum định nghĩa các trạng thái của Webhook.
 */
export type WebhookStatus = 'active' | 'inactive' | 'pausedDueToErrors';

export type WidgetConfig = {
  autoPosition?: boolean | null;
  x?: number | null;
  y?: number | null;
  w?: number | null;
  h?: number | null;
  maxW?: number | null;
  minW?: number | null;
  maxH?: number | null;
  minH?: number | null;
  locked?: boolean | null;
  noResize?: boolean | null;
  noMove?: boolean | null;
  resizeHandles?: string | null;
};

export type WidgetConfigDto = {
  /** Gets or sets widget id */
  widgetId?: string | null;
  /** Gets or sets title */
  title?: string | null;
  /** Gets or sets description */
  description?: string | null;
  /** Gets or sets icon */
  icon?: string | null;
  scriptVariantId?: ObjectId;
  /** Gets or sets variables */
  variables?: StringObjectKeyValuePair[] | null;
  /** Gets or sets condition */
  condition?: IfElseClause[] | null;
  componentType?: string | null;
  widgetOptions?: BaseWidgetConfig;
};

export type WidgetConfigEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  dashboardId?: ObjectId;
  scriptVariantId?: ObjectId;
  widgetId?: string | null;
  description?: string | null;
  componentType?: string | null;
  widgetOption?: WidgetConfig;
  /** Represents a collection of field parameters and their types. */
  variables?: StringObjectKeyValuePair[] | null;
  ifClauseType?: IfElseClauseType[] | null;
};

/**
 * Base class for paginated responses
 */
export type WidgetConfigEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: WidgetConfigEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

export type WidgetConfigEntityPaginationQuery = {
  /** List of items in the current page */
  items?: WidgetConfigEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type WidgetConfigEntityResult = {
  value?: WidgetConfigEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type WildcardParam = {
  value?: string | null;
  name?: string | null;
};

export type WorkCellEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  code?: string | null;
  name?: string | null;
  description?: string | null;
  stationsInCell?: WorkCellStation[] | null;
};

/**
 * Base class for paginated responses
 */
export type WorkCellEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: WorkCellEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type WorkCellEntityResult = {
  value?: WorkCellEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type WorkCellStation = {
  stationId?: ObjectId;
  sequenceNumber?: number;
};

/**
 * Danh mục loại tài nguyên của trung tâm làm việc.
 */
export type WorkCenterResourceCategory = 'machine' | 'labor' | 'tool' | 'external' | 'virtual';

export type WorkDateCalendarStatisticEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  calendarId?: ObjectId;
  startTime?: string;
  endTime?: string;
  name?: string | null;
  isBreakTime?: boolean;
  isOverTimeShift?: boolean;
  isShiftTime?: boolean;
  description?: string | null;
};

/**
 * Base class for paginated responses
 */
export type WorkDateCalendarStatisticEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: WorkDateCalendarStatisticEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type WorkDateCalendarStatisticEntityResult = {
  value?: WorkDateCalendarStatisticEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type WorkOrderEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  workOrderNumber?: string | null;
  productionOrderId?: ObjectId;
  productId?: ObjectId;
  routingVersionId?: ObjectId;
  plannedQuantity?: number;
  plannedStartDate?: string;
  plannedEndDate?: string;
  actualStartDate?: string | null;
  actualEndDate?: string | null;
  status?: ProductionStatus;
  isAssemblyWo?: boolean;
};

/**
 * Base class for paginated responses
 */
export type WorkOrderEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: WorkOrderEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type WorkOrderEntityResult = {
  value?: WorkOrderEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};

export type WorkingParameterEntity = {
  id?: ObjectId;
  createTime?: string;
  modifiedTime?: string;
  rules?: IfElseClause[] | null;
};

/**
 * Base class for paginated responses
 */
export type WorkingParameterEntityBasePaginationResponse = {
  /** List of items in the current page */
  items?: WorkingParameterEntity[] | null;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Current page number (0-based) */
  pageNumber?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of pages */
  totalPages?: number;
  /** List of fields that can be used for sorting */
  sortableFields?: string[] | null;
};

/**
 * Represents the result of an operation, containing a value, success status, message, and error type.
 */
export type WorkingParameterEntityResult = {
  value?: WorkingParameterEntity;
  /** Gets a value indicating whether the operation was successful. */
  isSuccess?: boolean;
  /** Gets the message describing the result. */
  message?: string | null;
  errorType?: ErrorType;
};
