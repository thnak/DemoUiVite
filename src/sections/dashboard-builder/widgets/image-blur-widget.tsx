import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import type { ImageBlurWidgetConfig } from '../types';

// ----------------------------------------------------------------------

type ImageBlurWidgetProps = CardProps & {
  config: ImageBlurWidgetConfig;
};

export function ImageBlurWidget({ config, sx, ...other }: ImageBlurWidgetProps) {
  const { src, alt, blurLevel = 4, text, textVariant = 'h4', textAlign = 'center' } = config;

  return (
    <Card
      sx={[
        {
          height: '100%',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {/* Blurred background image */}
      <Box
        component="img"
        src={src}
        alt={alt}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: `blur(${blurLevel}px)`,
          transform: 'scale(1.1)', // Prevent blur edges from showing
        }}
      />

      {/* Text overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          bgcolor: 'rgba(0, 0, 0, 0.3)',
        }}
      >
        <Typography
          variant={textVariant}
          align={textAlign}
          sx={{
            color: 'common.white',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            width: '100%',
          }}
        >
          {text}
        </Typography>
      </Box>
    </Card>
  );
}
