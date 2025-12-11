import type { Theme, SxProps } from '@mui/material/styles';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

// ----------------------------------------------------------------------

type MachineTypeTableEmptyRowsProps = {
  emptyRows: number;
  height?: number;
  sx?: SxProps<Theme>;
};

export function MachineTypeTableEmptyRows({
  emptyRows,
  height,
  sx,
}: MachineTypeTableEmptyRowsProps) {
  if (!emptyRows) {
    return null;
  }

  return (
    <TableRow
      sx={{
        ...(height && {
          height: height * emptyRows,
        }),
        ...sx,
      }}
    >
      <TableCell colSpan={9} />
    </TableRow>
  );
}
