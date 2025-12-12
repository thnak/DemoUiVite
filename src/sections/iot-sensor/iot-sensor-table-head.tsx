import type { Theme, SxProps } from '@mui/material/styles';

import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';

import { visuallyHidden } from './iot-sensor-utils';

// ----------------------------------------------------------------------

type IoTSensorTableHeadProps = {
  order: 'asc' | 'desc';
  orderBy: string;
  rowCount?: number;
  numSelected?: number;
  onSort: (id: string) => void;
  onSelectAllRows?: (checked: boolean) => void;
  headLabel: { id: string; label: string; align?: 'left' | 'center' | 'right' }[];
  sx?: SxProps<Theme>;
};

export function IoTSensorTableHead({
  order,
  orderBy,
  rowCount = 0,
  numSelected = 0,
  onSort,
  headLabel,
  onSelectAllRows,
  sx,
}: IoTSensorTableHeadProps) {
  return (
    <TableHead sx={sx}>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              onSelectAllRows?.(event.target.checked)
            }
          />
        </TableCell>

        {headLabel.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align || 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ width: headCell.id === '' ? 88 : 'auto', minWidth: headCell.id === '' ? 88 : 100 }}
          >
            {headCell.id ? (
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
