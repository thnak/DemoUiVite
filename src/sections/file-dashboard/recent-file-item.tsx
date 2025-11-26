import type { BoxProps } from '@mui/material/Box';
import type { IconifyName } from 'src/components/iconify/register-icons';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AvatarGroup from '@mui/material/AvatarGroup';

import { Iconify } from 'src/components/iconify';

import type { RecentFile } from './file-dashboard-data';

// ----------------------------------------------------------------------

type RecentFileItemProps = BoxProps & {
  file: RecentFile;
};

function getFileIcon(type: RecentFile['type']): { icon: IconifyName; color: string } {
  switch (type) {
    case 'image':
      return { icon: 'solar:gallery-bold', color: '#00AB55' };
    case 'audio':
      return { icon: 'solar:music-note-3-bold', color: '#FF5630' };
    case 'video':
      return { icon: 'solar:play-circle-bold', color: '#FF5630' };
    case 'document':
      return { icon: 'solar:document-bold', color: '#FFAB00' };
    default:
      return { icon: 'solar:document-bold', color: '#919EAB' };
  }
}

export function RecentFileItem({ file, sx, ...other }: RecentFileItemProps) {
  const fileIcon = getFileIcon(file.type);
  const extraCollaborators = file.collaborators.length > 2 ? file.collaborators.length - 2 : 0;

  return (
    <Box
      sx={[
        {
          py: 2,
          px: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: (theme) => `1px dashed ${theme.vars.palette.divider}`,
          '&:last-child': {
            borderBottom: 'none',
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0, flex: 1 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 1,
            bgcolor: 'grey.100',
          }}
        >
          <Iconify icon={fileIcon.icon} width={24} height={24} sx={{ color: fileIcon.color }} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle2" noWrap>
            {file.name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {file.size} Mb • {file.date}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
        <AvatarGroup max={2} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: 12 } }}>
          {file.collaborators.slice(0, 2).map((collaborator) => (
            <Avatar key={collaborator.id} alt="Collaborator" src={collaborator.avatarUrl} />
          ))}
        </AvatarGroup>
        {extraCollaborators > 0 && (
          <Typography
            variant="caption"
            sx={{
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
        <IconButton size="small">
          <Iconify
            icon={file.isFavorite ? 'eva:star-fill' : 'eva:star-outline'}
            sx={{ color: file.isFavorite ? '#FFAB00' : 'text.secondary' }}
          />
        </IconButton>
        <IconButton size="small">
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </Box>
    </Box>
  );
}
