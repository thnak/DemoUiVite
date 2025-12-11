import type { Theme, SxProps } from '@mui/material/styles';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

type MachineTypeTableNoDataProps = {
  searchQuery?: string;
  sx?: SxProps<Theme>;
};

export function MachineTypeTableNoData({ searchQuery = '', sx }: MachineTypeTableNoDataProps) {
  return (
    <TableRow>
      <TableCell align="center" colSpan={7} sx={sx}>
        <Typography variant="h6" gutterBottom>
          Not found
        </Typography>

        <Typography variant="body2">
          No results found for <strong>&quot;{searchQuery}&quot;</strong>
        </Typography>
      </TableCell>
    </TableRow>
  );
}
