import type { Theme, SxProps } from '@mui/material/styles';

import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';

import { visuallyHidden } from './machine-type-utils';

// ----------------------------------------------------------------------

type MachineTypeTableHeadProps = {
  order?: 'asc' | 'desc';
  orderBy?: string;
  rowCount?: number;
  numSelected?: number;
  onSort?: (id: string) => void;
  headLabel: {
    id: string;
    label: string;
    align?: 'left' | 'center' | 'right';
    width?: string | number;
    minWidth?: string | number;
  }[];
  onSelectAllRows?: (checked: boolean) => void;
  sx?: SxProps<Theme>;
};

export function MachineTypeTableHead({
  order = 'asc',
  orderBy = 'name',
  rowCount = 0,
  numSelected = 0,
  onSort,
  headLabel,
  onSelectAllRows,
  sx,
}: MachineTypeTableHeadProps) {
  return (
    <TableHead sx={sx}>
      <TableRow>
        {onSelectAllRows && (
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={!!numSelected && numSelected < rowCount}
              checked={!!rowCount && numSelected === rowCount}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                onSelectAllRows(event.target.checked)
              }
              inputProps={{
                id: 'select-all-machine-types',
                'aria-label': 'Select all machine types',
              }}
            />
          </TableCell>
        )}

        {headLabel.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align || 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ width: headCell.width, minWidth: headCell.minWidth }}
          >
            {onSort ? (
              <TableSortLabel
                hideSortIcon
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={() => onSort(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box sx={{ ...visuallyHidden }}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
