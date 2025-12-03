import type { TableRowProps } from '@mui/material/TableRow';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

// ----------------------------------------------------------------------

type DefectReasonTableEmptyRowsProps = TableRowProps & {
  emptyRows: number;
  height?: number;
};

export function DefectReasonTableEmptyRows({
  emptyRows,
  height,
  sx,
  ...other
}: DefectReasonTableEmptyRowsProps) {
  if (!emptyRows) {
    return null;
  }

  return (
    <TableRow
      sx={[height && { height: height * emptyRows }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <TableCell colSpan={8} />
    </TableRow>
  );
}
