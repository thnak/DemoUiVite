import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import CardHeader from '@mui/material/CardHeader';
import TableContainer from '@mui/material/TableContainer';

import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';

import type { Salesman } from './demo-dashboard-data';

// ----------------------------------------------------------------------

type BestSalesmanTableProps = CardProps & {
  title: string;
  subheader?: string;
  data: Salesman[];
};

export function BestSalesmanTable({
  title,
  subheader,
  data,
  sx,
  ...other
}: BestSalesmanTableProps) {
  const getRankColor = (rank: number) => {
    if (rank === 1) return 'success';
    if (rank === 2) return 'info';
    if (rank === 3) return 'warning';
    return 'default';
  };

  const getFlagEmoji = (countryCode: string) => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  return (
    <Card sx={sx} {...other}>
      <CardHeader title={title} subheader={subheader} />

      <TableContainer sx={{ overflow: 'auto' }}>
        <Table sx={{ minWidth: 640 }} aria-label="Best salesman table">
          <TableHead>
            <TableRow>
              <TableCell>Seller</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Country</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="right">Rank</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar alt={row.name} src={row.avatarUrl} sx={{ width: 36, height: 36 }} />
                    <Box component="span" sx={{ typography: 'subtitle2' }}>
                      {row.name}
                    </Box>
                  </Box>
                </TableCell>

                <TableCell sx={{ color: 'text.secondary' }}>{row.product}</TableCell>

                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      component="span"
                      sx={{ fontSize: 20 }}
                      role="img"
                      aria-label={`${row.country} flag`}
                    >
                      {getFlagEmoji(row.countryCode)}
                    </Box>
                    <Box component="span" sx={{ color: 'text.secondary' }}>
                      {row.country}
                    </Box>
                  </Box>
                </TableCell>

                <TableCell align="right" sx={{ typography: 'subtitle2' }}>
                  {fCurrency(row.total)}
                </TableCell>

                <TableCell align="right">
                  <Label variant="soft" color={getRankColor(row.rank)}>
                    Top {row.rank}
                  </Label>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
