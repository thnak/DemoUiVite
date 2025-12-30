import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useEffect } from 'react';
import { Icon } from '@iconify/react';
import { varAlpha } from 'minimal-shared/utils';
import { motion, AnimatePresence } from 'framer-motion';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import ListItem from '@mui/material/ListItem';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer, { drawerClasses } from '@mui/material/Drawer';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useIdleTimer } from 'src/hooks/use-idle-timer';

import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';

import { NavUpgrade } from '../components/nav-upgrade';
import { useNavCollapse } from './nav-collapse-context';
import { WorkspacesPopover } from '../components/workspaces-popover';

import type { NavData } from '../nav-config-dashboard';
import type { WorkspacesPopoverProps } from '../components/workspaces-popover';

// ----------------------------------------------------------------------

export type NavContentProps = {
  data: NavData;
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
  workspaces: WorkspacesPopoverProps['data'];
  sx?: SxProps<Theme>;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
};

// Animation variants for nav entrance
const navVariants = {
  hidden: { x: -280, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
};

// Animation variants for menu groups
const menuGroupVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06, // 60ms delay between menu items
      delayChildren: 0.2, // Start after nav entrance
    },
  },
};

// Animation variants for individual menu items
const menuItemVariants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
};

export function NavDesktop({
  sx,
  data,
  slots,
  workspaces,
  layoutQuery,
}: NavContentProps & { layoutQuery: Breakpoint }) {
  const theme = useTheme();
  const { collapsed, setCollapsed } = useNavCollapse();

  // Auto-collapse on idle (desktop only, 30 seconds)
  const { isIdle } = useIdleTimer({
    timeout: 30000, // 30 seconds
    enabled: true,
  });

  useEffect(() => {
    setCollapsed(isIdle);
  }, [isIdle, setCollapsed]);

  const handleToggleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <Box
      component={motion.div}
      variants={navVariants}
      initial="hidden"
      animate="visible"
      sx={{
        pt: 2.5,
        px: 2.5,
        top: 0,
        left: 0,
        height: 1,
        display: 'none',
        position: 'fixed',
        flexDirection: 'column',
        zIndex: 'var(--layout-nav-zIndex)',
        width: collapsed
          ? 'var(--layout-nav-vertical-width-collapsed)'
          : 'var(--layout-nav-vertical-width)',
        borderRight: `1px solid ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)}`,
        transition: theme.transitions.create(['width'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        [theme.breakpoints.up(layoutQuery)]: {
          display: 'flex',
        },
        ...sx,
      }}
    >
      <NavContent
        data={data}
        slots={slots}
        workspaces={workspaces}
        collapsed={collapsed}
        onToggleCollapse={handleToggleCollapse}
      />
    </Box>
  );
}

// ----------------------------------------------------------------------

export function NavMobile({
  sx,
  data,
  open,
  slots,
  onClose,
  workspaces,
}: NavContentProps & { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          pt: 2.5,
          px: 2.5,
          overflow: 'unset',
          width: 'var(--layout-nav-mobile-width)',
          ...sx,
        },
      }}
    >
      <NavContent data={data} slots={slots} workspaces={workspaces} />
    </Drawer>
  );
}

// ----------------------------------------------------------------------

export function NavContent({
  data,
  slots,
  workspaces,
  sx,
  collapsed = false,
  onToggleCollapse,
}: NavContentProps) {
  const pathname = usePathname();

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Logo sx={{ opacity: collapsed ? 0 : 1, transition: 'opacity 0.2s' }} />
        {onToggleCollapse && (
          <Tooltip title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} placement="right">
            <IconButton
              onClick={onToggleCollapse}
              size="small"
              sx={{
                color: 'text.secondary',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <Icon
                icon={collapsed ? 'eva:arrow-forward-fill' : 'eva:arrow-back-fill'}
                width={20}
              />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {slots?.topArea}

      {!collapsed && <WorkspacesPopover data={workspaces} sx={{ my: 2 }} />}

      <Scrollbar fillContent>
        <Box
          component="nav"
          sx={[
            {
              display: 'flex',
              flex: '1 1 auto',
              flexDirection: 'column',
            },
            ...(Array.isArray(sx) ? sx : [sx]),
          ]}
        >
          {data.map((group) => (
            <Box key={group.subheader} sx={{ mb: 2 }}>
              <AnimatePresence>
                {!collapsed && (
                  <Typography
                    component={motion.div}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    variant="overline"
                    sx={{
                      px: 2,
                      mb: 1,
                      display: 'block',
                      color: 'text.secondary',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '1.2px',
                    }}
                  >
                    {group.subheader}
                  </Typography>
                )}
              </AnimatePresence>
              <Box
                component={motion.ul}
                variants={menuGroupVariants}
                initial="hidden"
                animate="visible"
                sx={{
                  gap: 0.5,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {group.items.map((item) => {
                  const isActived = item.path === pathname;

                  return (
                    <ListItem
                      disableGutters
                      disablePadding
                      key={item.title}
                      component={motion.li}
                      variants={menuItemVariants}
                    >
                      <Tooltip
                        title={collapsed ? item.title : ''}
                        placement="right"
                        arrow
                        disableInteractive
                      >
                        <ListItemButton
                          disableGutters
                          component={RouterLink}
                          href={item.path}
                          sx={[
                            (theme) => ({
                              pl: 2,
                              py: 1,
                              gap: 2,
                              pr: 1.5,
                              borderRadius: 0.75,
                              typography: 'body2',
                              fontWeight: 'fontWeightMedium',
                              color: theme.vars.palette.text.secondary,
                              minHeight: 44,
                              justifyContent: collapsed ? 'center' : 'flex-start',
                              ...(isActived && {
                                fontWeight: 'fontWeightSemiBold',
                                color: theme.vars.palette.primary.main,
                                bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.08),
                                '&:hover': {
                                  bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.16),
                                },
                              }),
                            }),
                          ]}
                        >
                          <Box component="span" sx={{ width: 24, height: 24 }}>
                            {item.icon}
                          </Box>

                          <AnimatePresence>
                            {!collapsed && (
                              <Box
                                component={motion.span}
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.2 }}
                                sx={{ flexGrow: 1, overflow: 'hidden' }}
                              >
                                {item.title}
                              </Box>
                            )}
                          </AnimatePresence>

                          {!collapsed && item.info && item.info}
                        </ListItemButton>
                      </Tooltip>
                    </ListItem>
                  );
                })}
              </Box>
            </Box>
          ))}
        </Box>
      </Scrollbar>

      {slots?.bottomArea}

      <NavUpgrade />
    </>
  );
}
