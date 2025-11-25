import type { ProductOEEData } from 'src/_mock';
import type { CardProps } from '@mui/material/Card';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import CardHeader from '@mui/material/CardHeader';
import TableContainer from '@mui/material/TableContainer';

import { fPercent } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  products: ProductOEEData[];
};

function getOEEStatusColor(value: number): 'success' | 'warning' | 'error' {
  if (value >= 85) return 'success';
  if (value >= 60) return 'warning';
  return 'error';
}

export function OEEProductTable({ title, subheader, products, sx, ...other }: Props) {
  // Sort products by OEE descending
  const sortedProducts = [...products].sort((a, b) => b.oeeData.oee - a.oeeData.oee);

  return (
    <Card sx={sx} {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Scrollbar sx={{ minHeight: 300 }}>
        <TableContainer sx={{ p: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell align="center">Availability</TableCell>
                <TableCell align="center">Performance</TableCell>
                <TableCell align="center">Quality</TableCell>
                <TableCell align="center">OEE</TableCell>
                <TableCell align="right">Run Time (hrs)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedProducts.map((product, index) => (
                <TableRow key={`${product.productId}-${index}`} hover>
                  <TableCell>
                    {index === 0 ? '🏆 ' : ''}
                    {product.productName}
                  </TableCell>
                  <TableCell align="center">
                    <Label color={getOEEStatusColor(product.oeeData.availability)} variant="soft">
                      {fPercent(product.oeeData.availability)}
                    </Label>
                  </TableCell>
                  <TableCell align="center">
                    <Label color={getOEEStatusColor(product.oeeData.performance)} variant="soft">
                      {fPercent(product.oeeData.performance)}
                    </Label>
                  </TableCell>
                  <TableCell align="center">
                    <Label color={getOEEStatusColor(product.oeeData.quality)} variant="soft">
                      {fPercent(product.oeeData.quality)}
                    </Label>
                  </TableCell>
                  <TableCell align="center">
                    <Label color={getOEEStatusColor(product.oeeData.oee)} variant="filled">
                      {fPercent(product.oeeData.oee)}
                    </Label>
                  </TableCell>
                  <TableCell align="right">{product.runTime.toFixed(1)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>
    </Card>
  );
}
