import axiosInstance from '../axios-instance';
import { FILES_ENDPOINTS } from './generated';

import type { FileInfo, FilesUploadResponse } from '../types';

// ----------------------------------------------------------------------
// Files Service
// Endpoints for file upload, download, get, and delete operations
// ----------------------------------------------------------------------

/**
 * Upload multiple files
 *
 * @param files - Array of File objects to upload
 * @returns Promise with array of file codes
 */
export async function uploadFiles(files: File[]): Promise<FilesUploadResponse> {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append('files', file);
  });

  const response = await axiosInstance.post<FilesUploadResponse>(
    FILES_ENDPOINTS.postapiFilesupload,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
}

/**
 * Download a file by its code
 *
 * @param fileCode - The unique code of the file to download
 * @returns Promise with file Blob
 */
export async function downloadFile(fileCode: string): Promise<Blob> {
  const response = await axiosInstance.get<Blob>(
    `/api/Files/download/${encodeURIComponent(fileCode)}`,
    {
      responseType: 'blob',
    }
  );
  return response.data;
}

/**
 * Get file information by its code
 *
 * @param fileCode - The unique code of the file
 * @returns Promise with file information
 */
export async function getFile(fileCode: string): Promise<FileInfo> {
  const response = await axiosInstance.get<FileInfo>(`/api/Files/get/${encodeURIComponent(fileCode)}`);
  return response.data;
}

/**
 * Delete a file by its code
 *
 * @param fileCode - The unique code of the file to delete
 * @returns Promise<void>
 */
export async function deleteFile(fileCode: string): Promise<void> {
  await axiosInstance.delete(`/api/Files/delete/${encodeURIComponent(fileCode)}`);
}
