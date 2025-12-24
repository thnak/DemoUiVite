import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

type TimeBlockNameTableNoDataProps = {
  searchQuery: string;
};

export function TimeBlockNameTableNoData({ searchQuery }: TimeBlockNameTableNoDataProps) {
  return (
    <TableRow>
      <TableCell align="center" colSpan={6}>
        <Typography variant="h6" sx={{ py: 10 }}>
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
