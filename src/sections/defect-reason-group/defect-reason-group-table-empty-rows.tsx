import type { TableRowProps } from '@mui/material/TableRow';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

// ----------------------------------------------------------------------

type DefectReasonGroupTableEmptyRowsProps = TableRowProps & {
  emptyRows: number;
  height?: number;
};

export function DefectReasonGroupTableEmptyRows({
  emptyRows,
  height,
  sx,
  ...other
}: DefectReasonGroupTableEmptyRowsProps) {
  if (!emptyRows) {
    return null;
  }

  return (
    <TableRow
      sx={[height && { height: height * emptyRows }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <TableCell colSpan={6} />
    </TableRow>
  );
}
