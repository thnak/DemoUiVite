import type { CardProps } from '@mui/material/Card';

import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import type { TextWidgetConfig } from '../types';

// ----------------------------------------------------------------------

type TextWidgetProps = CardProps & {
  config: TextWidgetConfig;
};

export function TextWidget({ config, sx, ...other }: TextWidgetProps) {
  return (
    <Card
      sx={[
        {
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          overflow: 'auto',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Typography
        variant={config.variant ?? 'body1'}
        align={config.align ?? 'left'}
        sx={{ width: '100%' }}
      >
        {config.content}
      </Typography>
    </Card>
  );
}
