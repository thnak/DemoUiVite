import type { ButtonProps } from '@mui/material/Button';

import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface TourButtonProps extends Omit<ButtonProps, 'onClick'> {
  onStartTour: () => void;
  tooltip?: string;
}

// ----------------------------------------------------------------------

/**
 * A button component to trigger guided tours
 *
 * @param onStartTour - Function to start the tour
 * @param tooltip - Tooltip text to display on hover
 * @param variant
 * @param color
 * @param other
 */
export function TourButton({ 
  onStartTour, 
  tooltip = 'Start guided tour',
  variant = 'outlined',
  color = 'inherit',
  ...other 
}: TourButtonProps) {
  return (
    <Tooltip title={tooltip} arrow>
      <Button
        variant={variant}
        color={color}
        startIcon={<Iconify icon="solar:info-circle-bold" width={20} />}
        onClick={onStartTour}
        {...other}
      >
        Help
      </Button>
    </Tooltip>
  );
}
