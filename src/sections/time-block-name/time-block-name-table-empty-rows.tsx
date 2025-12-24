import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

// ----------------------------------------------------------------------

type TimeBlockNameTableEmptyRowsProps = {
  height: number;
  emptyRows: number;
};

export function TimeBlockNameTableEmptyRows({
  emptyRows,
  height,
}: TimeBlockNameTableEmptyRowsProps) {
  if (!emptyRows) {
    return null;
  }

  return (
    <TableRow
      sx={{
        ...(height && {
          height: height * emptyRows,
        }),
      }}
    >
      <TableCell colSpan={6} />
    </TableRow>
  );
}
