// ----------------------------------------------------------------------
// Files API Types
// Types for file upload, download, and management operations
// ----------------------------------------------------------------------

/**
 * Response from file upload endpoint
 * Contains array of file codes for uploaded files
 */
export type FilesUploadResponse = {
  /** Array of unique codes for the uploaded files */
  fileCodes?: string[];
  /** Indicates whether the upload was successful */
  isSuccess?: boolean;
  /** Message describing the result */
  message?: string | null;
};

/**
 * File information returned from get endpoint
 */
export type FileInfo = {
  /** Unique code of the file */
  fileCode?: string;
  /** Original name of the file */
  fileName?: string;
  /** MIME type of the file */
  contentType?: string;
  /** Size of the file in bytes */
  size?: number;
  /** Upload timestamp */
  uploadedAt?: string;
};
