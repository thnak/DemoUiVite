import type { Theme, SxProps } from '@mui/material/styles';

import { useRef, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';

import { useUploadFiles } from 'src/api';

import { Iconify } from '../iconify';

import type { IconifyName } from '../iconify/register-icons';

// ----------------------------------------------------------------------

export interface FileUploaderProps {
  /** Callback when files are successfully uploaded, receives array of file codes */
  onUploadComplete?: (fileCodes: string[]) => void;
  /** Callback when upload fails */
  onUploadError?: (error: Error) => void;
  /** Accepted file types (e.g., 'image/*,.pdf') */
  accept?: string;
  /** Maximum number of files allowed */
  maxFiles?: number;
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Whether multiple file selection is allowed */
  multiple?: boolean;
  /** Whether the uploader is disabled */
  disabled?: boolean;
  /** Custom placeholder text */
  placeholder?: string;
  /** Custom styles */
  sx?: SxProps<Theme>;
}

interface SelectedFile {
  file: File;
  id: string;
  preview?: string;
}

export function FileUploader({
  onUploadComplete,
  onUploadError,
  accept,
  maxFiles = 10,
  maxSize,
  multiple = true,
  disabled = false,
  placeholder = 'Drop files here or click to browse',
  sx,
}: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const { mutate: uploadFiles, isPending: isUploading } = useUploadFiles({
    onSuccess: (response) => {
      if (response.isSuccess && response.fileCodes) {
        onUploadComplete?.(response.fileCodes);
        // Clear selected files after successful upload
        setSelectedFiles([]);
      } else {
        onUploadError?.(new Error(response.message || 'Upload failed'));
      }
    },
    onError: (error) => {
      onUploadError?.(error);
    },
  });

  const generateId = useCallback(
    () => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    []
  );

  const createPreview = useCallback((file: File): string | undefined => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return undefined;
  }, []);

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const newFiles: SelectedFile[] = [];
      const currentCount = selectedFiles.length;
      const allowedCount = Math.min(files.length, maxFiles - currentCount);

      for (let i = 0; i < allowedCount; i += 1) {
        const file = files[i];

        // Check file size if maxSize is specified
        if (maxSize && file.size > maxSize) {
          console.warn(`File "${file.name}" exceeds maximum size of ${maxSize} bytes`);
          continue;
        }

        newFiles.push({
          file,
          id: generateId(),
          preview: createPreview(file),
        });
      }

      if (newFiles.length > 0) {
        setSelectedFiles((prev) => [...prev, ...newFiles]);
      }
    },
    [selectedFiles.length, maxFiles, maxSize, generateId, createPreview]
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleFileSelect(event.target.files);
      // Reset input value to allow selecting the same file again
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    },
    [handleFileSelect]
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setDragOver(false);

      if (disabled) return;

      handleFileSelect(event.dataTransfer.files);
    },
    [disabled, handleFileSelect]
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      if (!disabled) {
        setDragOver(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragOver(false);
  }, []);

  const handleClick = useCallback(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  }, [disabled]);

  const handleRemoveFile = useCallback((fileId: string) => {
    setSelectedFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((f) => f.id !== fileId);
    });
  }, []);

  const handleUpload = useCallback(() => {
    if (selectedFiles.length === 0) return;

    const files = selectedFiles.map((sf) => sf.file);
    uploadFiles(files);
  }, [selectedFiles, uploadFiles]);

  const handleClearAll = useCallback(() => {
    selectedFiles.forEach((sf) => {
      if (sf.preview) {
        URL.revokeObjectURL(sf.preview);
      }
    });
    setSelectedFiles([]);
  }, [selectedFiles]);

  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
  }, []);

  const getFileIcon = useCallback((mimeType: string): IconifyName => {
    if (mimeType.startsWith('image/')) return 'solar:gallery-bold';
    if (mimeType.startsWith('video/')) return 'eva:video-fill';
    if (mimeType.startsWith('audio/')) return 'solar:music-note-3-bold';
    if (mimeType.includes('pdf')) return 'solar:document-bold';
    if (mimeType.includes('word') || mimeType.includes('document'))
      return 'solar:document-bold';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet'))
      return 'mdi:table';
    if (mimeType.includes('zip') || mimeType.includes('compressed'))
      return 'solar:folder-bold';
    return 'solar:document-bold';
  }, []);

  const isUploadDisabled = disabled || isUploading || selectedFiles.length === 0;
  const canAddMore = selectedFiles.length < maxFiles;

  return (
    <Stack spacing={2} sx={sx}>
      {/* Drop Zone */}
      <Box
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        sx={{
          p: 3,
          borderRadius: 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
          bgcolor: dragOver ? 'action.hover' : 'background.neutral',
          border: (theme) =>
            `2px dashed ${dragOver ? theme.palette.primary.main : theme.palette.divider}`,
          transition: 'all 0.2s ease-in-out',
          opacity: disabled ? 0.5 : 1,
          '&:hover': {
            bgcolor: disabled ? 'background.neutral' : 'action.hover',
          },
        }}
      >
        <Stack alignItems="center" spacing={1}>
          <Iconify
            icon="solar:cloud-upload-bold"
            width={48}
            sx={{ color: dragOver ? 'primary.main' : 'text.secondary' }}
          />
          <Typography variant="body1" color="text.primary">
            {placeholder}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {multiple ? `Max ${maxFiles} files` : 'Single file only'}
            {maxSize && ` • Max size: ${formatFileSize(maxSize)}`}
          </Typography>
        </Stack>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple && canAddMore}
          onChange={handleInputChange}
          disabled={disabled}
          style={{ display: 'none' }}
        />
      </Box>

      {/* Upload Progress */}
      {isUploading && <LinearProgress sx={{ borderRadius: 1 }} />}

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <Stack spacing={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle2" color="text.secondary">
              Selected files ({selectedFiles.length}/{maxFiles})
            </Typography>
            <Button
              size="small"
              color="error"
              onClick={handleClearAll}
              disabled={isUploading}
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" width={16} />}
            >
              Clear all
            </Button>
          </Box>

          <Stack spacing={1}>
            {selectedFiles.map((sf) => (
              <Box
                key={sf.id}
                sx={{
                  p: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: 1,
                  bgcolor: 'background.paper',
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              >
                {/* File Preview/Icon */}
                {sf.preview ? (
                  <Box
                    component="img"
                    src={sf.preview}
                    alt={sf.file.name}
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 0.5,
                      objectFit: 'cover',
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 0.5,
                      bgcolor: 'action.hover',
                      flexShrink: 0,
                    }}
                  >
                    <Iconify icon={getFileIcon(sf.file.type)} width={24} />
                  </Box>
                )}

                {/* File Info */}
                <Box sx={{ ml: 1.5, flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" noWrap>
                    {sf.file.name}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                      {formatFileSize(sf.file.size)}
                    </Typography>
                    <Chip
                      label={sf.file.type.split('/')[1]?.toUpperCase() || 'FILE'}
                      size="small"
                      sx={{ height: 18, fontSize: '0.625rem' }}
                    />
                  </Stack>
                </Box>

                {/* Remove Button */}
                <IconButton
                  size="small"
                  onClick={() => handleRemoveFile(sf.id)}
                  disabled={isUploading}
                  sx={{ flexShrink: 0 }}
                >
                  <Iconify icon="mingcute:close-line" width={18} />
                </IconButton>
              </Box>
            ))}
          </Stack>
        </Stack>
      )}

      {/* Action Buttons */}
      {selectedFiles.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={isUploadDisabled}
            startIcon={
              isUploading ? (
                <Iconify icon="solar:restart-bold" width={20} />
              ) : (
                <Iconify icon="solar:cloud-upload-bold" width={20} />
              )
            }
          >
            {isUploading ? 'Uploading...' : `Upload ${selectedFiles.length} file(s)`}
          </Button>
        </Box>
      )}
    </Stack>
  );
}
