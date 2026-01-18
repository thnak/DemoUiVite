import type { CardProps } from '@mui/material/Card';
import type { MachineOeeSummary } from 'src/api/types/generated';

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
  data: MachineOeeSummary[];
};

function getOEEStatusColor(value: number): 'success' | 'warning' | 'error' {
  if (value >= 85) return 'success';
  if (value >= 60) return 'warning';
  return 'error';
}

export function OEESummaryMachineTable({ title, subheader, data, sx, ...other }: Props) {
  // Sort by OEE descending
  const sortedData = [...data].sort((a, b) => (b.metrics?.oee || 0) - (a.metrics?.oee || 0));

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
                <TableCell align="right">Total Produced</TableCell>
                <TableCell>Target Progress</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData.map((row, index) => (
                <TableRow key={row.machineId} hover>
                  <TableCell>
                    {index === 0 ? '🏆 ' : ''}
                    {row.machineName || 'Unknown'}
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell align="center">
                    <Label color={getOEEStatusColor(row.metrics?.oee || 0)} variant="filled">
                      {fPercent(row.metrics?.oee || 0)}
                    </Label>
                  </TableCell>
                  <TableCell align="center">
                    <Label color={getOEEStatusColor(row.metrics?.availability || 0)} variant="soft">
                      {fPercent(row.metrics?.availability || 0)}
                    </Label>
                  </TableCell>
                  <TableCell align="center">
                    <Label color={getOEEStatusColor(row.metrics?.performance || 0)} variant="soft">
                      {fPercent(row.metrics?.performance || 0)}
                    </Label>
                  </TableCell>
                  <TableCell align="center">
                    <Label color={getOEEStatusColor(row.metrics?.quality || 0)} variant="soft">
                      {fPercent(row.metrics?.quality || 0)}
                    </Label>
                  </TableCell>
                  <TableCell align="right">{fNumber(row.metrics?.goodCount || 0)}</TableCell>
                  <TableCell align="right">{fNumber(row.metrics?.totalProducedQuantity || 0)}</TableCell>
                  <TableCell sx={{ minWidth: 150 }}>
                    <LinearProgress
                      variant="determinate"
                      value={((row.metrics?.oee || 0) / 85) * 100}
                      color={getOEEStatusColor(row.metrics?.oee || 0)}
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
