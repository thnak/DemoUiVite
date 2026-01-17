import type { ButtonProps, IconButtonProps } from '@mui/material';

import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export interface BackButtonProps {
  /**
   * The base path to navigate back to (e.g., '/machines', '/products')
   */
  href: string;
  /**
   * Display variant: 'icon' for icon button only, 'text' for button with text
   * @default 'icon'
   */
  variant?: 'icon' | 'text';
  /**
   * Button text (only used when variant='text')
   * @default 'Back'
   */
  label?: string;
  /**
   * Whether to preserve query parameters from the referrer URL
   * @default true
   */
  preserveQuery?: boolean;
  /**
   * Additional props for the button/icon button
   */
  buttonProps?: Partial<ButtonProps> | Partial<IconButtonProps>;
  /**
   * Custom onClick handler (overrides default navigation)
   */
  onClick?: () => void;
}

/**
 * BackButton component that provides consistent navigation back to list pages
 * with optional query parameter preservation.
 *
 * Features:
 * - Preserves pagination/filter state from referring page
 * - Two display modes: icon-only or with text label
 * - Follows world-standard back button patterns
 * - Accessible with proper aria-labels
 *
 * @example
 * // Icon button only (compact)
 * <BackButton href="/machines" />
 *
 * @example
 * // Button with text label
 * <BackButton href="/machines" variant="text" label="Back to Machines" />
 *
 * @example
 * // Without query preservation
 * <BackButton href="/machines" preserveQuery={false} />
 */
export function BackButton({
  href,
  variant = 'icon',
  label = 'Back',
  preserveQuery = true,
  buttonProps = {},
  onClick,
}: BackButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick();
      return;
    }

    // Check if we came from the list page and preserve its query params
    let targetPath = href;

    if (preserveQuery) {
      // Check if there's a referrer state with query params
      const state = location.state as { from?: string; search?: string } | undefined;
      
      if (state?.from?.startsWith(href)) {
        // We came from the list page, use the stored search params
        targetPath = state.search ? `${href}${state.search}` : href;
      } else if (window.history.state?.usr?.from?.startsWith(href)) {
        // Fallback to history state
        const search = window.history.state?.usr?.search;
        targetPath = search ? `${href}${search}` : href;
      }
    }

    navigate(targetPath);
  }, [href, navigate, onClick, preserveQuery, location.state]);

  if (variant === 'icon') {
    return (
      <IconButton
        onClick={handleClick}
        aria-label={label}
        {...(buttonProps as Partial<IconButtonProps>)}
      >
        <Iconify icon="eva:arrow-back-fill" />
      </IconButton>
    );
  }

  return (
    <Button
      onClick={handleClick}
      startIcon={<Iconify icon="eva:arrow-back-fill" />}
      variant="outlined"
      color="inherit"
      {...(buttonProps as Partial<ButtonProps>)}
    >
      {label}
    </Button>
  );
}

/**
 * Utility function to navigate to a create/edit page with state preservation
 * Call this from list pages before navigating to edit pages.
 *
 * @param navigate - React Router's navigate function
 * @param targetPath - The path to navigate to (e.g., '/machines/123/edit')
 * @param fromPath - The current list page path (e.g., '/machines')
 * @param searchParams - Current URL search params to preserve
 *
 * @example
 * const navigate = useNavigate();
 * const location = useLocation();
 *
 * const handleEdit = (id: string) => {
 *   navigateWithState(navigate, `/machines/${id}/edit`, '/machines', location.search);
 * };
 */
export function navigateWithState(
  navigate: ReturnType<typeof useNavigate>,
  targetPath: string,
  fromPath: string,
  searchParams: string = ''
) {
  navigate(targetPath, {
    state: {
      from: fromPath,
      search: searchParams,
    },
  });
}
