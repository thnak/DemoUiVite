import type { DailyOEEData } from 'src/_mock';
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
  weekData: DailyOEEData[];
};

function getOEEStatusColor(value: number): 'success' | 'warning' | 'error' {
  if (value >= 85) return 'success';
  if (value >= 60) return 'warning';
  return 'error';
}

export function OEEWeeklyTable({ title, subheader, weekData, sx, ...other }: Props) {
  return (
    <Card sx={sx} {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Scrollbar sx={{ minHeight: 300 }}>
        <TableContainer sx={{ p: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Day</TableCell>
                <TableCell align="center">Availability</TableCell>
                <TableCell align="center">Performance</TableCell>
                <TableCell align="center">Quality</TableCell>
                <TableCell align="center">OEE</TableCell>
                <TableCell>Top Product</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {weekData.map((day) => {
                // Find best product for the day
                const bestProduct = day.productData.reduce(
                  (best, current) => (current.oeeData.oee > best.oeeData.oee ? current : best),
                  day.productData[0]
                );

                return (
                  <TableRow key={day.dayOfWeek} hover>
                    <TableCell>{day.dayOfWeek}</TableCell>
                    <TableCell align="center">
                      <Label color={getOEEStatusColor(day.oeeData.availability)} variant="soft">
                        {fPercent(day.oeeData.availability)}
                      </Label>
                    </TableCell>
                    <TableCell align="center">
                      <Label color={getOEEStatusColor(day.oeeData.performance)} variant="soft">
                        {fPercent(day.oeeData.performance)}
                      </Label>
                    </TableCell>
                    <TableCell align="center">
                      <Label color={getOEEStatusColor(day.oeeData.quality)} variant="soft">
                        {fPercent(day.oeeData.quality)}
                      </Label>
                    </TableCell>
                    <TableCell align="center">
                      <Label color={getOEEStatusColor(day.oeeData.oee)} variant="filled">
                        {fPercent(day.oeeData.oee)}
                      </Label>
                    </TableCell>
                    <TableCell>
                      {bestProduct
                        ? `${bestProduct.productName} (${fPercent(bestProduct.oeeData.oee)})`
                        : '-'}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>
    </Card>
  );
}
