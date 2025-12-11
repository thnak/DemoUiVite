import type { CardProps } from '@mui/material/Card';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { Iconify } from 'src/components/iconify';
import { FileUploader } from 'src/components/file-uploader';

// ----------------------------------------------------------------------

type UploadFileCardProps = CardProps;

export function UploadFileCard({ sx, ...other }: UploadFileCardProps) {
  const [open, setOpen] = useState(false);
  const [uploadedCodes, setUploadedCodes] = useState<string[]>([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleUploadComplete = (fileCodes: string[]) => {
    setUploadedCodes((prev) => [...prev, ...fileCodes]);
    handleClose();
  };

  const handleUploadError = (error: Error) => {
    // Error is handled by the FileUploader component's onUploadError callback
    // Additional error handling (e.g., toast notification) can be added here
    void error;
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
            icon="solar:cloud-upload-bold"
            width={24}
            height={24}
            sx={{ color: 'primary.main' }}
          />
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Upload file
        </Typography>
        {uploadedCodes.length > 0 && (
          <Typography variant="caption" sx={{ color: 'success.main' }}>
            {uploadedCodes.length} file(s) uploaded
          </Typography>
        )}
      </Card>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Files</DialogTitle>
        <DialogContent>
          <FileUploader
            onUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.zip"
            maxFiles={10}
            maxSize={10 * 1024 * 1024} // 10MB
            multiple
            sx={{ mt: 2 }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
