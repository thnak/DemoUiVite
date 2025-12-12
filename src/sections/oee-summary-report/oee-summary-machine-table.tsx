import type { MachineOEESummary } from 'src/_mock';
import type { CardProps } from '@mui/material/Card';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import CardHeader from '@mui/material/CardHeader';
import LinearProgress from '@mui/material/LinearProgress';
import TableContainer from '@mui/material/TableContainer';

import { fNumber, fPercent } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  data: MachineOEESummary[];
};

function getOEEStatusColor(value: number): 'success' | 'warning' | 'error' {
  if (value >= 85) return 'success';
  if (value >= 60) return 'warning';
  return 'error';
}

export function OEESummaryMachineTable({ title, subheader, data, sx, ...other }: Props) {
  // Sort by OEE descending
  const sortedData = [...data].sort((a, b) => b.metrics.oee - a.metrics.oee);

  return (
    <Card sx={sx} {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Scrollbar sx={{ minHeight: 400 }}>
        <TableContainer sx={{ p: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Machine</TableCell>
                <TableCell>Area</TableCell>
                <TableCell align="center">OEE</TableCell>
                <TableCell align="center">Availability</TableCell>
                <TableCell align="center">Performance</TableCell>
                <TableCell align="center">Quality</TableCell>
                <TableCell align="right">Good Count</TableCell>
                <TableCell align="right">Total Count</TableCell>
                <TableCell>Target Progress</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData.map((row, index) => (
                <TableRow key={row.machineId} hover>
                  <TableCell>
                    {index === 0 ? '🏆 ' : ''}
                    {row.machineName}
                  </TableCell>
                  <TableCell>{row.area}</TableCell>
                  <TableCell align="center">
                    <Label color={getOEEStatusColor(row.metrics.oee)} variant="filled">
                      {fPercent(row.metrics.oee)}
                    </Label>
                  </TableCell>
                  <TableCell align="center">
                    <Label color={getOEEStatusColor(row.metrics.availability)} variant="soft">
                      {fPercent(row.metrics.availability)}
                    </Label>
                  </TableCell>
                  <TableCell align="center">
                    <Label color={getOEEStatusColor(row.metrics.performance)} variant="soft">
                      {fPercent(row.metrics.performance)}
                    </Label>
                  </TableCell>
                  <TableCell align="center">
                    <Label color={getOEEStatusColor(row.metrics.quality)} variant="soft">
                      {fPercent(row.metrics.quality)}
                    </Label>
                  </TableCell>
                  <TableCell align="right">{fNumber(row.goodCount)}</TableCell>
                  <TableCell align="right">{fNumber(row.totalCount)}</TableCell>
                  <TableCell sx={{ minWidth: 150 }}>
                    <LinearProgress
                      variant="determinate"
                      value={(row.metrics.oee / row.targetOEE) * 100}
                      color={getOEEStatusColor(row.metrics.oee)}
                      sx={{ height: 8, borderRadius: 1 }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>
    </Card>
  );
}
