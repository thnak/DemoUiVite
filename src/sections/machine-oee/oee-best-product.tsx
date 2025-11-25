import type { ProductOEEData } from 'src/_mock';
import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';

import { fPercent } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  product: ProductOEEData;
};

export function OEEBestProduct({ title, subheader, product, sx, ...other }: Props) {
  return (
    <Card sx={sx} {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 3,
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'warning.lighter',
              color: 'warning.main',
            }}
          >
            <Iconify icon="mdi:trophy" width={32} />
          </Box>
          <Box>
            <Typography variant="h6">{product.productName}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Best performing product
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              OEE Score
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Label color="success" variant="filled">
                {fPercent(product.oeeData.oee)}
              </Label>
            </Box>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Run Time
            </Typography>
            <Typography variant="h6">{product.runTime.toFixed(1)} hrs</Typography>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Availability
            </Typography>
            <Typography variant="subtitle1">{fPercent(product.oeeData.availability)}</Typography>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Performance
            </Typography>
            <Typography variant="subtitle1">{fPercent(product.oeeData.performance)}</Typography>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Quality
            </Typography>
            <Typography variant="subtitle1">{fPercent(product.oeeData.quality)}</Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}
