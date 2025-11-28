import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import CardHeader from '@mui/material/CardHeader';
import TableContainer from '@mui/material/TableContainer';

import type { TableWidgetConfig } from '../types';

// ----------------------------------------------------------------------

type TableWidgetProps = CardProps & {
  config: TableWidgetConfig;
};

export function TableWidget({ config, sx, ...other }: TableWidgetProps) {
  const { title, headers, rows, striped = false, compact = false } = config;

  return (
    <Card
      sx={[
        {
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {title && <CardHeader title={title} sx={{ pb: 1 }} />}
      <Box sx={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
        <TableContainer>
          <Table size={compact ? 'small' : 'medium'}>
            <TableHead>
              <TableRow>
                {headers.map((header, index) => (
                  <TableCell
                    key={index}
                    sx={{
                      fontWeight: 'fontWeightBold',
                      bgcolor: 'background.neutral',
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  sx={{
                    ...(striped &&
                      rowIndex % 2 === 1 && {
                        bgcolor: 'action.hover',
                      }),
                  }}
                >
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex}>{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Card>
  );
}
