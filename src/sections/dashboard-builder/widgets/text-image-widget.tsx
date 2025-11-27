import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import type { TextImageWidgetConfig } from '../types';

// ----------------------------------------------------------------------

type TextImageWidgetProps = CardProps & {
  config: TextImageWidgetConfig;
};

export function TextImageWidget({ config, sx, ...other }: TextImageWidgetProps) {
  const { text, image, layout } = config;

  const isVertical = layout === 'text-top' || layout === 'text-bottom';
  const isTextFirst = layout === 'text-left' || layout === 'text-top';

  const textContent = (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        overflow: 'auto',
      }}
    >
      <Typography
        variant={text.variant ?? 'body1'}
        align={text.align ?? 'left'}
        sx={{ width: '100%' }}
      >
        {text.content}
      </Typography>
    </Box>
  );

  const imageContent = (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        minWidth: 0,
        overflow: 'hidden',
      }}
    >
      <Box
        component="img"
        src={image.src}
        alt={image.alt}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: image.objectFit ?? 'cover',
        }}
      />
    </Box>
  );

  return (
    <Card
      sx={[
        {
          height: '100%',
          display: 'flex',
          flexDirection: isVertical ? 'column' : 'row',
          overflow: 'hidden',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {isTextFirst ? (
        <>
          {textContent}
          {imageContent}
        </>
      ) : (
        <>
          {imageContent}
          {textContent}
        </>
      )}
    </Card>
  );
}
