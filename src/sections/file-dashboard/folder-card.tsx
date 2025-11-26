import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AvatarGroup from '@mui/material/AvatarGroup';

import { Iconify } from 'src/components/iconify';

import type { FolderData } from './file-dashboard-data';

// ----------------------------------------------------------------------

type FolderCardProps = CardProps & {
  folder: FolderData;
};

function formatSize(sizeInMB: number): string {
  if (sizeInMB >= 1024) {
    return `${(sizeInMB / 1024).toFixed(2)} Gb`;
  }
  return `${sizeInMB.toFixed(2)} Mb`;
}

export function FolderCard({ folder, sx, ...other }: FolderCardProps) {
  const extraCollaborators = folder.collaborators.length > 2 ? folder.collaborators.length - 2 : 0;

  return (
    <Card
      sx={[
        {
          p: 2.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Iconify icon="solar:folder-bold" width={40} height={40} sx={{ color: '#FFAB00' }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton size="small">
            <Iconify
              icon={folder.isFavorite ? 'eva:star-fill' : 'eva:star-outline'}
              sx={{ color: folder.isFavorite ? '#FFAB00' : 'text.secondary' }}
            />
          </IconButton>
          <IconButton size="small">
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </Box>
      </Box>

      <Box>
        <Typography variant="subtitle1" noWrap>
          {folder.name}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {formatSize(folder.size)} • {folder.fileCount} files
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <AvatarGroup max={2} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: 12 } }}>
          {folder.collaborators.slice(0, 2).map((collaborator) => (
            <Avatar key={collaborator.id} alt="Collaborator" src={collaborator.avatarUrl} />
          ))}
        </AvatarGroup>
        {extraCollaborators > 0 && (
          <Typography
            variant="caption"
            sx={{
              ml: 0.5,
              px: 0.75,
              py: 0.25,
              borderRadius: 1,
              bgcolor: 'success.lighter',
              color: 'success.darker',
            }}
          >
            +{extraCollaborators}
          </Typography>
        )}
      </Box>
    </Card>
  );
}
