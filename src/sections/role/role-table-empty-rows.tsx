import type { TableRowProps } from '@mui/material/TableRow';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

// ----------------------------------------------------------------------

type RoleTableEmptyRowsProps = TableRowProps & {
  emptyRows: number;
  height?: number;
};

export function RoleTableEmptyRows({ emptyRows, height, sx, ...other }: RoleTableEmptyRowsProps) {
  if (!emptyRows) {
    return null;
  }

  return (
    <TableRow
      sx={[height && { height: height * emptyRows }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <TableCell colSpan={4} />
    </TableRow>
  );
}
