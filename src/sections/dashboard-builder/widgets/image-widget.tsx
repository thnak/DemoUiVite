import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';

import type { ImageWidgetConfig } from '../types';

// ----------------------------------------------------------------------

type ImageWidgetProps = CardProps & {
  config: ImageWidgetConfig;
};

export function ImageWidget({ config, sx, ...other }: ImageWidgetProps) {
  return (
    <Card
      sx={[
        {
          height: '100%',
          display: 'flex',
          overflow: 'hidden',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        component="img"
        src={config.src}
        alt={config.alt}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: config.objectFit ?? 'cover',
        }}
      />
    </Card>
  );
}
