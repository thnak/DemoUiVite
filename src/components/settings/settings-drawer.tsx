import type { IconifyName } from 'src/components/iconify/register-icons';

import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Switch from '@mui/material/Switch';
import Drawer from '@mui/material/Drawer';
import Slider from '@mui/material/Slider';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ButtonBase from '@mui/material/ButtonBase';

import { useThemeMode } from 'src/theme/theme-mode-context';

import { Iconify } from 'src/components/iconify';

import { useSettings } from './settings-context';

import type { NavColorValue, NavLayoutValue, FontFamilyValue, ColorPresetValue } from './settings-context';

// ----------------------------------------------------------------------

type SettingsDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function SettingsDrawer({ open, onClose }: SettingsDrawerProps) {
  const theme = useTheme();
  const { mode, setMode, resolvedMode } = useThemeMode();
  const { settings, updateSettings, resetSettings } = useSettings();

  const isDarkMode = resolvedMode === 'dark';
  const hasChanges =
    mode !== 'system' ||
    settings.contrast ||
    settings.rtl ||
    settings.compact ||
    settings.navLayout !== 'vertical' ||
    settings.navColor !== 'integrate' ||
    settings.colorPreset !== 'default' ||
    settings.fontFamily !== 'DM Sans' ||
    settings.fontSize !== 16;

  const handleReset = () => {
    setMode('system');
    resetSettings();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: 360,
            bgcolor: 'background.paper',
          },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          py: 2,
          px: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `solid 1px ${theme.vars.palette.divider}`,
        }}
      >
        <Typography variant="h6">Settings</Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Tooltip title="Toggle fullscreen">
            <IconButton size="small">
              <Iconify icon="solar:full-screen-square-bold" width={20} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Reset settings">
            <IconButton size="small" onClick={handleReset}>
              <Badge color="error" variant="dot" invisible={!hasChanges}>
                <Iconify icon="solar:refresh-bold" width={20} />
              </Badge>
            </IconButton>
          </Tooltip>

          <IconButton size="small" onClick={onClose}>
            <Iconify icon="mingcute:close-line" width={20} />
          </IconButton>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ overflow: 'auto', flex: 1 }}>
        <Stack spacing={3} sx={{ p: 2.5 }}>
          {/* Mode & Contrast */}
          <Stack direction="row" spacing={2}>
            <SettingCard
              label="Mode"
              icon={isDarkMode ? 'solar:moon-bold' : 'solar:sun-bold'}
              checked={isDarkMode}
              onChange={() => setMode(isDarkMode ? 'light' : 'dark')}
            />
            <SettingCard
              label="Contrast"
              icon="solar:settings-bold"
              checked={settings.contrast}
              onChange={() => updateSettings('contrast', !settings.contrast)}
            />
          </Stack>

          {/* RTL & Compact */}
          <Stack direction="row" spacing={2}>
            <SettingCard
              label="Right to left"
              icon="solar:align-right-bold"
              checked={settings.rtl}
              onChange={() => updateSettings('rtl', !settings.rtl)}
            />
            <SettingCard
              label="Compact"
              icon="solar:code-square-bold"
              checked={settings.compact}
              onChange={() => updateSettings('compact', !settings.compact)}
              info="Dashboard only"
            />
          </Stack>

          {/* Nav Section */}
          <Box>
            <SectionLabel label="Nav" info="Dashboard layout" />

            <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>
              Layout
            </Typography>
            <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
              {(['vertical', 'horizontal', 'mini'] as NavLayoutValue[]).map((layout) => (
                <NavLayoutOption
                  key={layout}
                  layout={layout}
                  selected={settings.navLayout === layout}
                  onClick={() => updateSettings('navLayout', layout)}
                />
              ))}
            </Stack>

            <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>
              Color
            </Typography>
            <Stack direction="row" spacing={2}>
              {(['integrate', 'apparent'] as NavColorValue[]).map((color) => (
                <NavColorOption
                  key={color}
                  color={color}
                  selected={settings.navColor === color}
                  onClick={() => updateSettings('navColor', color)}
                />
              ))}
            </Stack>
          </Box>

          {/* Presets */}
          <Box>
            <SectionLabel label="Presets" />
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5 }}>
              {(
                [
                  { value: 'default', color: '#00A76F' },
                  { value: 'cyan', color: '#078DEE' },
                  { value: 'purple', color: '#7635DC' },
                  { value: 'blue', color: '#2065D1' },
                  { value: 'orange', color: '#FDA92D' },
                  { value: 'red', color: '#FF3030' },
                ] as { value: ColorPresetValue; color: string }[]
              ).map((preset) => (
                <PresetOption
                  key={preset.value}
                  color={preset.color}
                  selected={settings.colorPreset === preset.value}
                  onClick={() => updateSettings('colorPreset', preset.value)}
                />
              ))}
            </Box>
          </Box>

          {/* Font Section */}
          <Box>
            <SectionLabel label="Font" />

            <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>
              Family
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5, mb: 3 }}>
              {(['Public Sans', 'Inter', 'DM Sans', 'Nunito Sans'] as FontFamilyValue[]).map(
                (font) => (
                  <FontFamilyOption
                    key={font}
                    font={font}
                    selected={settings.fontFamily === font}
                    onClick={() => updateSettings('fontFamily', font)}
                  />
                )
              )}
            </Box>

            <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>
              Size
            </Typography>
            <Box sx={{ px: 1 }}>
              <Slider
                value={settings.fontSize}
                onChange={(_, value) => updateSettings('fontSize', value as number)}
                min={12}
                max={20}
                step={1}
                marks
                valueLabelDisplay="on"
                valueLabelFormat={(value) => `${value}px`}
              />
            </Box>
          </Box>
        </Stack>
      </Box>
    </Drawer>
  );
}

// ----------------------------------------------------------------------

type SettingCardProps = {
  label: string;
  icon: IconifyName;
  checked: boolean;
  onChange: () => void;
  info?: string;
};

function SettingCard({ label, icon, checked, onChange, info }: SettingCardProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        flex: 1,
        p: 2,
        borderRadius: 1.5,
        position: 'relative',
        border: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)}`,
        ...(checked && {
          borderColor: 'primary.main',
          bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.08),
        }),
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Iconify icon={icon} width={24} />
        <Switch size="small" checked={checked} onChange={onChange} />
      </Box>
      <Typography variant="subtitle2">{label}</Typography>
      {info && (
        <Tooltip title={info} placement="top">
          <IconButton
            size="small"
            sx={{ position: 'absolute', top: 8, right: 40 }}
          >
            <Iconify icon="solar:info-circle-bold" width={16} />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
}

// ----------------------------------------------------------------------

type SectionLabelProps = {
  label: string;
  info?: string;
};

function SectionLabel({ label, info }: SectionLabelProps) {
  return (
    <>
      <Divider sx={{ borderStyle: 'dashed', mb: 2 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
        <Box
          sx={{
            py: 0.5,
            px: 1,
            borderRadius: 0.75,
            typography: 'caption',
            fontWeight: 'fontWeightBold',
            bgcolor: 'text.primary',
            color: 'background.paper',
          }}
        >
          {label}
        </Box>
        {info && (
          <Tooltip title={info}>
            <Iconify icon="solar:info-circle-bold" width={16} sx={{ color: 'text.disabled' }} />
          </Tooltip>
        )}
      </Box>
    </>
  );
}

// ----------------------------------------------------------------------

type NavLayoutOptionProps = {
  layout: NavLayoutValue;
  selected: boolean;
  onClick: () => void;
};

function NavLayoutOption({ layout, selected, onClick }: NavLayoutOptionProps) {
  const theme = useTheme();

  const renderVertical = (
    <Box sx={{ display: 'flex', gap: 0.5, width: '100%', height: '100%' }}>
      <Box
        sx={{
          width: 16,
          height: '100%',
          borderRadius: 0.5,
          bgcolor: 'primary.main',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: 0.5,
          gap: 0.25,
        }}
      >
        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'common.white' }} />
        <Box sx={{ width: 8, height: 2, borderRadius: 0.25, bgcolor: varAlpha('255 255 255', 0.4) }} />
        <Box sx={{ width: 8, height: 2, borderRadius: 0.25, bgcolor: varAlpha('255 255 255', 0.4) }} />
      </Box>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Box sx={{ height: 8, borderRadius: 0.5, bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.16) }} />
        <Box sx={{ flex: 1, borderRadius: 0.5, bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08) }} />
      </Box>
    </Box>
  );

  const renderHorizontal = (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, width: '100%', height: '100%' }}>
      <Box
        sx={{
          height: 10,
          borderRadius: 0.5,
          bgcolor: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          px: 0.5,
          gap: 0.25,
        }}
      >
        <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'common.white' }} />
        <Box sx={{ width: 8, height: 2, borderRadius: 0.25, bgcolor: varAlpha('255 255 255', 0.4) }} />
        <Box sx={{ width: 8, height: 2, borderRadius: 0.25, bgcolor: varAlpha('255 255 255', 0.4) }} />
      </Box>
      <Box sx={{ flex: 1, borderRadius: 0.5, bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08) }} />
    </Box>
  );

  const renderMini = (
    <Box sx={{ display: 'flex', gap: 0.5, width: '100%', height: '100%' }}>
      <Box
        sx={{
          width: 10,
          height: '100%',
          borderRadius: 0.5,
          bgcolor: 'primary.main',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: 0.5,
          gap: 0.25,
        }}
      >
        <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'common.white' }} />
        <Box sx={{ width: 4, height: 2, borderRadius: 0.25, bgcolor: varAlpha('255 255 255', 0.4) }} />
        <Box sx={{ width: 4, height: 2, borderRadius: 0.25, bgcolor: varAlpha('255 255 255', 0.4) }} />
      </Box>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Box sx={{ height: 8, borderRadius: 0.5, bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.16) }} />
        <Box sx={{ flex: 1, borderRadius: 0.5, bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08) }} />
      </Box>
    </Box>
  );

  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        width: 80,
        height: 56,
        p: 1,
        borderRadius: 1,
        border: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)}`,
        ...(selected && {
          bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.08),
          borderColor: 'primary.main',
        }),
      }}
    >
      {layout === 'vertical' && renderVertical}
      {layout === 'horizontal' && renderHorizontal}
      {layout === 'mini' && renderMini}
    </ButtonBase>
  );
}

// ----------------------------------------------------------------------

type NavColorOptionProps = {
  color: NavColorValue;
  selected: boolean;
  onClick: () => void;
};

function NavColorOption({ color, selected, onClick }: NavColorOptionProps) {
  const theme = useTheme();

  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        flex: 1,
        py: 1.5,
        px: 2,
        gap: 1,
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        border: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)}`,
        ...(selected && {
          bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.08),
          borderColor: 'primary.main',
        }),
      }}
    >
      <Box
        sx={{
          width: 24,
          height: 24,
          borderRadius: 0.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: color === 'integrate' ? 'primary.lighter' : varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
        }}
      >
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: 0.25,
            bgcolor: 'primary.main',
          }}
        />
      </Box>
      <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
        {color}
      </Typography>
    </ButtonBase>
  );
}

// ----------------------------------------------------------------------

type PresetOptionProps = {
  color: string;
  selected: boolean;
  onClick: () => void;
};

function PresetOption({ color, selected, onClick }: PresetOptionProps) {
  const theme = useTheme();

  // Convert hex to RGB for alpha channel
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return hex;
    return `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`;
  };

  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        width: '100%',
        height: 64,
        borderRadius: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: varAlpha(hexToRgb(color), 0.08),
        border: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
        ...(selected && {
          borderColor: color,
          borderWidth: 2,
        }),
      }}
    >
      <Box
        sx={{
          width: 24,
          height: 24,
          borderRadius: 0.75,
          bgcolor: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Iconify
          icon="solar:list-bold"
          width={16}
          sx={{ color: 'common.white' }}
        />
      </Box>
    </ButtonBase>
  );
}

// ----------------------------------------------------------------------

type FontFamilyOptionProps = {
  font: FontFamilyValue;
  selected: boolean;
  onClick: () => void;
};

function FontFamilyOption({ font, selected, onClick }: FontFamilyOptionProps) {
  const theme = useTheme();

  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        p: 2,
        borderRadius: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)}`,
        ...(selected && {
          bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.08),
          borderColor: 'primary.main',
        }),
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontFamily: font,
          color: selected ? 'primary.main' : 'text.secondary',
          mb: 0.5,
        }}
      >
        Aa
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {font}
      </Typography>
    </ButtonBase>
  );
}
