import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

type Props = {
  searchQuery: string;
};

export function IoTSensorTableNoData({ searchQuery }: Props) {
  return (
    <TableRow>
      <TableCell align="center" colSpan={8} sx={{ py: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Not found
        </Typography>

        <Typography variant="body2">
          No results found for &nbsp;
          <strong>&quot;{searchQuery}&quot;</strong>.
          <br /> Try checking for typos or using complete words.
        </Typography>
      </TableCell>
    </TableRow>
  );
}
