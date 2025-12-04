import type { UseMutationOptions } from '@tanstack/react-query';

import { useMutation } from '@tanstack/react-query';

import { deleteFile, uploadFiles, downloadFile } from '../services/files';

import type { FilesUploadResponse } from '../types/files';

// ----------------------------------------------------------------------
// Files Hooks - TanStack Query hooks for file operations
// ----------------------------------------------------------------------

/**
 * Hook to upload multiple files
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUploadFiles({
 *   onSuccess: (data) => {
 *     if (data.isSuccess && data.fileCodes) {
 *       console.log('Uploaded file codes:', data.fileCodes);
 *     }
 *   },
 * });
 *
 * // Upload files
 * mutate(selectedFiles);
 * ```
 */
export function useUploadFiles(
  options?: Omit<UseMutationOptions<FilesUploadResponse, Error, File[]>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: uploadFiles,
    ...options,
  });
}

/**
 * Hook to download a file by its code
 *
 * @example
 * ```tsx
 * const { mutate } = useDownloadFile({
 *   onSuccess: (blob) => {
 *     // Create download link
 *     const url = URL.createObjectURL(blob);
 *     const a = document.createElement('a');
 *     a.href = url;
 *     a.download = 'file.pdf';
 *     a.click();
 *     URL.revokeObjectURL(url);
 *   },
 * });
 *
 * mutate('file-code-123');
 * ```
 */
export function useDownloadFile(
  options?: Omit<UseMutationOptions<Blob, Error, string>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: downloadFile,
    ...options,
  });
}

/**
 * Hook to delete a file by its code
 *
 * @example
 * ```tsx
 * const { mutate } = useDeleteFile({
 *   onSuccess: () => {
 *     console.log('File deleted');
 *   },
 * });
 *
 * mutate('file-code-123');
 * ```
 */
export function useDeleteFile(
  options?: Omit<UseMutationOptions<void, Error, string>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: deleteFile,
    ...options,
  });
}
