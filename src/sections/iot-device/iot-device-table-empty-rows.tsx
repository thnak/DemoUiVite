import type { TableRowProps } from '@mui/material/TableRow';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

// ----------------------------------------------------------------------

type IoTDeviceTableEmptyRowsProps = TableRowProps & {
  emptyRows: number;
  height?: number;
};

export function IoTDeviceTableEmptyRows({
  emptyRows,
  height,
  sx,
  ...other
}: IoTDeviceTableEmptyRowsProps) {
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
