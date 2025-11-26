import type { CardProps } from '@mui/material/Card';

import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import LinearProgress from '@mui/material/LinearProgress';

import { fCurrency, fShortenNumber } from 'src/utils/format-number';

import type { SalesOverviewItem } from './demo-dashboard-data';

// ----------------------------------------------------------------------

type SalesOverviewProps = CardProps & {
  title: string;
  subheader?: string;
  data: SalesOverviewItem[];
};

export function SalesOverview({ title, subheader, data, sx, ...other }: SalesOverviewProps) {
  const theme = useTheme();

  return (
    <Card sx={sx} {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Stack spacing={4} sx={{ p: 3, pt: 2 }}>
        {data.map((item) => {
          const progress = (item.value / item.maxValue) * 100;

          return (
            <Box key={item.id}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 1,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    typography: 'subtitle2',
                    color: 'text.secondary',
                  }}
                >
                  {item.label}
                </Box>
                <Box
                  component="span"
                  sx={{
                    typography: 'subtitle2',
                    color: 'text.primary',
                  }}
                >
                  {fCurrency(item.value)}
                </Box>
              </Box>

              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 8,
                  borderRadius: 1,
                  bgcolor: varAlpha(theme.vars.palette[item.color].mainChannel, 0.16),
                  '& .MuiLinearProgress-bar': {
                    bgcolor: `${item.color}.main`,
                    borderRadius: 1,
                  },
                }}
              />
            </Box>
          );
        })}
      </Stack>
    </Card>
  );
}

// ----------------------------------------------------------------------

type CurrentBalanceCardProps = CardProps & {
  title: string;
  balance: number;
  currency: string;
};

export function CurrentBalanceCard({
  title,
  balance,
  currency,
  sx,
  ...other
}: CurrentBalanceCardProps) {
  const theme = useTheme();

  return (
    <Card
      sx={[
        () => ({
          p: 3,
          position: 'relative',
          color: 'primary.darker',
          backgroundColor: 'common.white',
          backgroundImage: `linear-gradient(135deg, ${varAlpha(theme.vars.palette.primary.lighterChannel, 0.48)}, ${varAlpha(theme.vars.palette.primary.lightChannel, 0.48)})`,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box sx={{ mb: 3 }}>
        <Box sx={{ typography: 'subtitle2', color: 'text.secondary' }}>{title}</Box>
        <Box sx={{ typography: 'h3', mt: 1 }}>{fShortenNumber(balance)}</Box>
      </Box>

      <Stack direction="row" spacing={2}>
        <Box
          component="button"
          type="button"
          aria-label="Transfer funds"
          sx={{
            px: 3,
            py: 1.5,
            flex: 1,
            border: 'none',
            borderRadius: 1.5,
            cursor: 'pointer',
            typography: 'button',
            color: 'primary.contrastText',
            backgroundColor: 'primary.main',
            transition: theme.transitions.create('opacity'),
            '&:hover': {
              opacity: 0.88,
            },
            '&:focus-visible': {
              outline: `2px solid ${theme.vars.palette.primary.main}`,
              outlineOffset: 2,
            },
          }}
        >
          Transfer
        </Box>
        <Box
          component="button"
          type="button"
          aria-label="View invites"
          sx={{
            px: 3,
            py: 1.5,
            flex: 1,
            borderRadius: 1.5,
            cursor: 'pointer',
            typography: 'button',
            color: 'text.primary',
            backgroundColor: 'common.white',
            border: `1px solid ${theme.vars.palette.grey[300]}`,
            transition: theme.transitions.create('background-color'),
            '&:hover': {
              backgroundColor: theme.vars.palette.grey[100],
            },
            '&:focus-visible': {
              outline: `2px solid ${theme.vars.palette.primary.main}`,
              outlineOffset: 2,
            },
          }}
        >
          Invite
        </Box>
      </Stack>
    </Card>
  );
}
