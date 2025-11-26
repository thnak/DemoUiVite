import type { CardProps } from '@mui/material/Card';
import type { MachineDowntimeSummary } from 'src/_mock';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import CardHeader from '@mui/material/CardHeader';
import LinearProgress from '@mui/material/LinearProgress';
import TableContainer from '@mui/material/TableContainer';

import { fNumber, fShortenNumber } from 'src/utils/format-number';

import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  data: MachineDowntimeSummary[];
};

export function DowntimeMachineTable({ title, subheader, data, sx, ...other }: Props) {
  const maxDowntime = Math.max(...data.map((d) => d.totalDowntimeMinutes));

  return (
    <Card sx={sx} {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Scrollbar sx={{ minHeight: 402 }}>
        <TableContainer sx={{ p: 2, minWidth: 720 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Machine</TableCell>
                <TableCell align="center">Events</TableCell>
                <TableCell align="right">Downtime (hrs)</TableCell>
                <TableCell align="right" sx={{ minWidth: 200 }}>
                  Impact
                </TableCell>
                <TableCell>Top Reason</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {data.slice(0, 10).map((row) => {
                const downtimeHours = Math.round((row.totalDowntimeMinutes / 60) * 10) / 10;
                const progressValue = (row.totalDowntimeMinutes / maxDowntime) * 100;
                const topReason = row.topReasons[0];

                return (
                  <TableRow key={row.machineId} hover>
                    <TableCell>
                      <Box sx={{ fontWeight: 'fontWeightMedium' }}>{row.machineName}</Box>
                    </TableCell>

                    <TableCell align="center">{fNumber(row.totalDowntimeEvents)}</TableCell>

                    <TableCell align="right">{fShortenNumber(downtimeHours)}</TableCell>

                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={progressValue}
                          color={progressValue > 70 ? 'error' : progressValue > 40 ? 'warning' : 'primary'}
                          sx={{ width: 1, height: 8, borderRadius: 1 }}
                        />
                        <Box
                          sx={{
                            minWidth: 40,
                            typography: 'caption',
                            color: 'text.secondary',
                          }}
                        >
                          {Math.round(progressValue)}%
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      {topReason ? (
                        <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
                          {topReason.reason}
                          <Box component="span" sx={{ ml: 0.5, color: 'error.main' }}>
                            ({Math.round((topReason.minutes / 60) * 10) / 10}h)
                          </Box>
                        </Box>
                      ) : (
                        '-'
                      )}
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
