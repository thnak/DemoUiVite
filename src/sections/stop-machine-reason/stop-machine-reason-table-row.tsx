import type { StopMachineImpact } from 'src/api/types/generated';

import { useState, useCallback } from 'react';

import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { useRouter } from 'src/routes/hooks';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type StopMachineReasonProps = {
  id: string;
  code: string;
  name: string;
  description: string;
  groupName: string;
  color: string;
  impact: StopMachineImpact;
  requiresApproval: boolean;
  requiresNote: boolean;
  requiresAttachment: boolean;
  requiresComment: boolean;
};

type StopMachineReasonTableRowProps = {
  row: StopMachineReasonProps;
  selected: boolean;
  onSelectRow: () => void;
  onDeleteRow?: () => void;
};

const getImpactColor = (impact: StopMachineImpact): 'success' | 'error' | 'warning' | 'default' => {
  switch (impact) {
    case 'run':
      return 'success';
    case 'unPlanedStop':
      return 'error';
    case 'planedStop':
      return 'warning';
    case 'notScheduled':
      return 'default';
    default:
      return 'default';
  }
};

const getImpactLabel = (impact: StopMachineImpact): string => {
  switch (impact) {
    case 'run':
      return 'Run';
    case 'unPlanedStop':
      return 'Unplanned Stop';
    case 'planedStop':
      return 'Planned Stop';
    case 'notScheduled':
      return 'Not Scheduled';
    default:
      return impact;
  }
};

export function StopMachineReasonTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
}: StopMachineReasonTableRowProps) {
  const router = useRouter();
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleEdit = useCallback(() => {
    handleClosePopover();
    router.push(`/stop-machine-reason/edit/${row.id}`);
  }, [handleClosePopover, router, row.id]);

  const handleDelete = useCallback(() => {
    handleClosePopover();
    if (onDeleteRow) {
      onDeleteRow();
    }
  }, [handleClosePopover, onDeleteRow]);

  const handleManageMachineMapping = useCallback(() => {
    handleClosePopover();
    router.push(`/stop-machine-reason/${row.id}/machine-mapping`);
  }, [handleClosePopover, router, row.id]);

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell>{row.code}</TableCell>

        <TableCell>{row.name}</TableCell>

        <TableCell>{row.groupName}</TableCell>

        <TableCell>
          <Label color={getImpactColor(row.impact)}>{getImpactLabel(row.impact)}</Label>
        </TableCell>

        <TableCell sx={{ maxWidth: 300 }}>{row.description}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem onClick={handleManageMachineMapping} sx={{ color: 'secondary.main' }}>
            <Iconify icon="solar:settings-bold-duotone" />
            Machine Mapping
          </MenuItem>

          <MenuItem onClick={handleEdit}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
