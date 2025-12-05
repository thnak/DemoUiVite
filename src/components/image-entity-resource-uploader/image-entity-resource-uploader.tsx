import type { Area, Point } from 'react-easy-crop';
import type { Theme, SxProps } from '@mui/material/styles';

import Cropper from 'react-easy-crop';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import LinearProgress from '@mui/material/LinearProgress';

import { useUploadFiles } from 'src/api';

import { Iconify } from '../iconify';

// ----------------------------------------------------------------------

export interface ImageEntityResourceUploaderProps {
  /** Current image URL to display as preview */
  imageUrl?: string;
  /** Callback when image is successfully uploaded, receives new image URL */
  onImageUrlChange?: (newImageUrl: string) => void;
  /** Callback when upload fails */
  onUploadError?: (error: Error) => void;
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Aspect ratio for cropping (e.g., 1 for square, 16/9 for widescreen) */
  aspectRatio?: number;
  /** Output image quality (0-1) */
  quality?: number;
  /** Output image format */
  outputFormat?: 'jpeg' | 'png' | 'webp';
  /** Whether the uploader is disabled */
  disabled?: boolean;
  /** Custom placeholder text */
  placeholder?: string;
  /** Custom styles */
  sx?: SxProps<Theme>;
  /** Size of the preview image container */
  previewSize?: number;
}

export function ImageEntityResourceUploader({
  imageUrl,
  onImageUrlChange,
  onUploadError,
  maxSize,
  aspectRatio = 1,
  quality = 0.9,
  outputFormat = 'jpeg',
  disabled = false,
  placeholder = 'Click or drop an image',
  sx,
  previewSize = 200,
}: ImageEntityResourceUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Image editing state
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [originalFileName, setOriginalFileName] = useState<string>('');

  const { mutate: uploadFiles, isPending: isUploading } = useUploadFiles({
    onSuccess: (response) => {
      if (response.isSuccess && response.fileCodes && response.fileCodes.length > 0) {
        // Construct the new image URL from the file code
        const newImageUrl = `/api/Files/download/${response.fileCodes[0]}`;
        onImageUrlChange?.(newImageUrl);
        handleCloseDialog();
      } else {
        onUploadError?.(new Error(response.message || 'Upload failed'));
      }
    },
    onError: (error) => {
      onUploadError?.(error);
    },
  });

  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
  }, []);

  const readFile = useCallback(
    (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error('Failed to read file'));
          }
        });
        reader.addEventListener('error', () => reject(reader.error));
        reader.readAsDataURL(file);
      }),
    []
  );

  const handleFileSelect = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) {
        onUploadError?.(new Error('Please select an image file'));
        return;
      }

      if (maxSize && file.size > maxSize) {
        onUploadError?.(new Error(`Image exceeds maximum size of ${formatFileSize(maxSize)}`));
        return;
      }

      try {
        const imageDataUrl = await readFile(file);
        setImageSrc(imageDataUrl);
        setOriginalFileName(file.name);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
        setDialogOpen(true);
      } catch {
        onUploadError?.(new Error('Failed to read image file'));
      }
    },
    [maxSize, formatFileSize, onUploadError, readFile]
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
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

      const file = event.dataTransfer.files[0];
      if (file) {
        handleFileSelect(file);
      }
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

  const handlePaste = useCallback(
    (event: ClipboardEvent) => {
      if (disabled || !isFocused) return;

      const items = event.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i += 1) {
        const item = items[i];
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            handleFileSelect(file);
            event.preventDefault();
            break;
          }
        }
      }
    },
    [disabled, isFocused, handleFileSelect]
  );

  // Listen for paste events on the document when focused
  useEffect(() => {
    if (!isFocused) return undefined;

    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [isFocused, handlePaste]);

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixelsValue: Area) => {
    setCroppedAreaPixels(croppedAreaPixelsValue);
  }, []);

  const createCroppedImage = useCallback(async (): Promise<Blob | null> => {
    if (!imageSrc || !croppedAreaPixels) return null;

    const image = new Image();
    image.src = imageSrc;

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('Failed to load image'));
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    // Calculate the bounding box of the rotated image
    const rotRad = (rotation * Math.PI) / 180;
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
      image.width,
      image.height,
      rotation
    );

    // Set canvas size to match the bounding box
    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;

    // Translate canvas center to image center and rotate
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx.rotate(rotRad);
    ctx.translate(-image.width / 2, -image.height / 2);

    // Draw the rotated image
    ctx.drawImage(image, 0, 0);

    // Get the pixel data of the cropped area
    const data = ctx.getImageData(
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    // Set canvas size to final crop dimensions
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    // Put the cropped image data
    ctx.putImageData(data, 0, 0);

    return new Promise((resolve) => {
      const mimeType = `image/${outputFormat}`;
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        mimeType,
        quality
      );
    });
  }, [imageSrc, croppedAreaPixels, rotation, outputFormat, quality]);

  const handleUpload = useCallback(async () => {
    const croppedBlob = await createCroppedImage();
    if (!croppedBlob) {
      onUploadError?.(new Error('Failed to process image'));
      return;
    }

    // Create a file from the blob
    const extension = outputFormat === 'jpeg' ? 'jpg' : outputFormat;
    const fileName = originalFileName.replace(/\.[^/.]+$/, '') + `_cropped.${extension}`;
    const file = new File([croppedBlob], fileName, { type: `image/${outputFormat}` });

    uploadFiles([file]);
  }, [createCroppedImage, uploadFiles, onUploadError, outputFormat, originalFileName]);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setCroppedAreaPixels(null);
    setOriginalFileName('');
  }, []);

  const handleRotateLeft = useCallback(() => {
    setRotation((prev) => (prev - 90 + 360) % 360);
  }, []);

  const handleRotateRight = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360);
  }, []);

  const handleResetTransform = useCallback(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  }, []);

  return (
    <>
      <Stack spacing={2} sx={sx}>
        {/* Image Preview / Drop Zone */}
        <Box
          ref={containerRef}
          tabIndex={0}
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onMouseEnter={() => setIsFocused(true)}
          onMouseLeave={() => setIsFocused(false)}
          sx={{
            position: 'relative',
            width: previewSize,
            height: previewSize,
            borderRadius: 2,
            cursor: disabled ? 'not-allowed' : 'pointer',
            bgcolor: dragOver ? 'action.hover' : 'background.neutral',
            border: (theme) =>
              `2px dashed ${dragOver ? theme.palette.primary.main : theme.palette.divider}`,
            transition: 'all 0.2s ease-in-out',
            opacity: disabled ? 0.5 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            outline: 'none',
            '&:hover': {
              bgcolor: disabled ? 'background.neutral' : 'action.hover',
              '& .upload-overlay': {
                opacity: disabled ? 0 : 1,
              },
            },
            '&:focus': {
              borderColor: 'primary.main',
            },
          }}
        >
          {imageUrl ? (
            <>
              <Avatar
                src={imageUrl}
                alt="Preview"
                variant="rounded"
                sx={{ width: '100%', height: '100%' }}
              />
              {/* Hover overlay */}
              <Box
                className="upload-overlay"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.2s ease-in-out',
                }}
              >
                <Stack alignItems="center" spacing={0.5}>
                  <Iconify
                    icon="solar:cloud-upload-bold"
                    width={32}
                    sx={{ color: 'common.white' }}
                  />
                  <Typography variant="caption" sx={{ color: 'common.white' }}>
                    Change image
                  </Typography>
                </Stack>
              </Box>
            </>
          ) : (
            <Stack alignItems="center" spacing={0.5}>
              <Iconify
                icon="solar:gallery-bold"
                width={48}
                sx={{ color: dragOver ? 'primary.main' : 'text.secondary' }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textAlign: 'center', px: 1 }}
              >
                {placeholder}
              </Typography>
              <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.625rem' }}>
                Ctrl+V to paste
              </Typography>
            </Stack>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            disabled={disabled}
            style={{ display: 'none' }}
          />
        </Box>

        {/* Helper text */}
        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
          Supports JPG, PNG, WebP
          {maxSize && ` • Max: ${formatFileSize(maxSize)}`}
        </Typography>
      </Stack>

      {/* Image Editor Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Edit Image</Typography>
            <IconButton onClick={handleCloseDialog} size="small">
              <Iconify icon="mingcute:close-line" />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          {isUploading && <LinearProgress sx={{ mb: 2 }} />}

          {imageSrc && (
            <Stack spacing={3}>
              {/* Cropper Area */}
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: 400,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  overflow: 'hidden',
                }}
              >
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={aspectRatio}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </Box>

              {/* Controls */}
              <Stack spacing={2}>
                {/* Zoom Control */}
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Iconify icon="eva:search-fill" width={20} sx={{ color: 'text.secondary' }} />
                  <Typography variant="body2" sx={{ minWidth: 50 }}>
                    Zoom
                  </Typography>
                  <Slider
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    onChange={(_, value) => setZoom(value as number)}
                    disabled={isUploading}
                    sx={{ flex: 1 }}
                  />
                  <Typography variant="body2" sx={{ minWidth: 40, textAlign: 'right' }}>
                    {zoom.toFixed(1)}x
                  </Typography>
                </Stack>

                {/* Rotation Control */}
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Iconify icon="solar:restart-bold" width={20} sx={{ color: 'text.secondary' }} />
                  <Typography variant="body2" sx={{ minWidth: 50 }}>
                    Rotate
                  </Typography>
                  <Slider
                    value={rotation}
                    min={0}
                    max={360}
                    step={1}
                    onChange={(_, value) => setRotation(value as number)}
                    disabled={isUploading}
                    sx={{ flex: 1 }}
                  />
                  <Typography variant="body2" sx={{ minWidth: 40, textAlign: 'right' }}>
                    {rotation}°
                  </Typography>
                </Stack>

                {/* Quick Actions */}
                <Stack direction="row" spacing={1} justifyContent="center">
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={handleRotateLeft}
                    disabled={isUploading}
                    startIcon={<Iconify icon="mdi:undo" width={18} />}
                  >
                    Rotate Left
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={handleRotateRight}
                    disabled={isUploading}
                    startIcon={<Iconify icon="mdi:redo" width={18} />}
                  >
                    Rotate Right
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={handleResetTransform}
                    disabled={isUploading}
                    startIcon={<Iconify icon="solar:restart-bold" width={18} />}
                  >
                    Reset
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseDialog} disabled={isUploading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={isUploading || !imageSrc}
            startIcon={
              isUploading ? (
                <Iconify icon="solar:restart-bold" width={20} />
              ) : (
                <Iconify icon="solar:cloud-upload-bold" width={20} />
              )
            }
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// Helper function to calculate the size of the image after rotation
function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = (rotation * Math.PI) / 180;
  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}
