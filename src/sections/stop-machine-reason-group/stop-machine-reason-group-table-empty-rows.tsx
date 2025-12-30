import type { TableRowProps } from '@mui/material/TableRow';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

// ----------------------------------------------------------------------

type StopMachineReasonGroupTableEmptyRowsProps = TableRowProps & {
  emptyRows: number;
  height?: number;
};

export function StopMachineReasonGroupTableEmptyRows({
  emptyRows,
  height,
  sx,
  ...other
}: StopMachineReasonGroupTableEmptyRowsProps) {
  if (!emptyRows) {
    return null;
  }

  return (
    <TableRow
      sx={[height && { height: height * emptyRows }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <TableCell colSpan={7} />
    </TableRow>
  );
}
