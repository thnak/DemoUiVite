import type { CardProps } from '@mui/material/Card';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';

import { Iconify } from 'src/components/iconify';
import { ImageUploader } from 'src/components/image-uploader';

// ----------------------------------------------------------------------

type UploadImageCardProps = CardProps;

export function UploadImageCard({ sx, ...other }: UploadImageCardProps) {
  const [open, setOpen] = useState(false);
  const [uploadedCode, setUploadedCode] = useState<string | null>(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleUploadComplete = (fileCode: string) => {
    setUploadedCode(fileCode);
    handleClose();
  };

  const handleUploadError = (_error: Error) => {
    // Error is handled by the ImageUploader component
  };

  return (
    <>
      <Card
        onClick={handleOpen}
        sx={[
          {
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
            cursor: 'pointer',
            border: (theme) => `1px dashed ${theme.vars.palette.divider}`,
            '&:hover': {
              bgcolor: 'action.hover',
            },
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            bgcolor: 'grey.100',
          }}
        >
          <Iconify
            icon="solar:gallery-bold"
            width={24}
            height={24}
            sx={{ color: 'secondary.main' }}
          />
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Upload Image
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.disabled' }}>
          Crop, rotate & preview
        </Typography>
        {uploadedCode && (
          <Typography variant="caption" sx={{ color: 'success.main' }}>
            Image uploaded
          </Typography>
        )}
      </Card>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogContent sx={{ p: 0 }}>
          <ImageUploader
            onUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
            maxSize={10 * 1024 * 1024} // 10MB
            aspectRatio={16 / 9}
            quality={0.9}
            outputFormat="jpeg"
            placeholder="Click or drop an image to edit and upload"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
