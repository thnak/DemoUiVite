import Box from '@mui/material/Box';

import type { CutoutShape, ImageCutoutWidgetConfig } from '../types';

// ----------------------------------------------------------------------

// SVG clip path definitions for different shapes
const getClipPath = (shape: CutoutShape): string => {
  switch (shape) {
    case 'circle':
      return 'circle(50% at 50% 50%)';
    case 'ellipse':
      return 'ellipse(50% 40% at 50% 50%)';
    case 'hexagon':
      return 'polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)';
    case 'star':
      return 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
    case 'heart':
      return 'polygon(50% 100%, 0% 35%, 25% 0%, 50% 15%, 75% 0%, 100% 35%)';
    case 'diamond':
      return 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
    case 'rounded-square':
      return 'inset(5% round 15%)';
    default:
      return 'circle(50% at 50% 50%)';
  }
};

// Get shape icon for display
export const getShapeIcon = (shape: CutoutShape): string => {
  switch (shape) {
    case 'circle':
      return '⬤';
    case 'ellipse':
      return '⬮';
    case 'hexagon':
      return '⬡';
    case 'star':
      return '★';
    case 'heart':
      return '♥';
    case 'diamond':
      return '◆';
    case 'rounded-square':
      return '▢';
    default:
      return '⬤';
  }
};

interface ImageCutoutWidgetProps {
  config: ImageCutoutWidgetConfig;
}

export function ImageCutoutWidget({ config }: ImageCutoutWidgetProps) {
  const {
    src,
    alt,
    shape,
    backgroundColor = 'transparent',
    borderWidth = 0,
    borderColor = 'primary.main',
  } = config;

  const clipPath = getClipPath(shape);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: backgroundColor,
        p: 2,
        position: 'relative',
      }}
    >
      {/* Border layer (if borderWidth > 0) */}
      {borderWidth > 0 && (
        <Box
          sx={{
            position: 'absolute',
            width: `calc(100% - ${32 - borderWidth * 2}px)`,
            height: `calc(100% - ${32 - borderWidth * 2}px)`,
            bgcolor: borderColor,
            clipPath,
            zIndex: 0,
          }}
        />
      )}

      {/* Image layer */}
      <Box
        component="img"
        src={src}
        alt={alt}
        sx={{
          width: `calc(100% - ${32 + borderWidth * 2}px)`,
          height: `calc(100% - ${32 + borderWidth * 2}px)`,
          objectFit: 'cover',
          clipPath,
          zIndex: 1,
        }}
      />
    </Box>
  );
}
