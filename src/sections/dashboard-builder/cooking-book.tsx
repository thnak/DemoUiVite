import type { IconifyName } from 'src/components/iconify/register-icons';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { Iconify } from 'src/components/iconify';

import type {
  WidgetType,
  WidgetItem,
  WidgetConfig,
  TextWidgetConfig,
  ImageWidgetConfig,
} from './types';

// ----------------------------------------------------------------------

/**
 * Merge Recipe: Defines how two widget types can be combined into a new widget
 * Like a cooking recipe - ingredient A + ingredient B = dish C
 */
export interface MergeRecipe {
  id: string;
  name: string;
  description: string;
  primaryIngredient: WidgetType; // The base widget (the "main dish")
  secondaryIngredient: WidgetType; // The widget to merge in (the "seasoning")
  resultType: WidgetType; // The resulting widget type
  icon: string;
  // Transform function to create the merged widget config
  transform: (primary: WidgetConfig, secondary: WidgetConfig) => WidgetConfig;
}

/**
 * Merge History Entry: Tracks merges for undo capability
 */
export interface MergeHistoryEntry {
  id: string;
  timestamp: number;
  recipeName: string;
  originalPrimaryWidget: WidgetItem;
  originalSecondaryWidget: WidgetItem;
  resultWidget: WidgetItem;
}

// ----------------------------------------------------------------------

/**
 * THE COOKING BOOK: All available merge recipes
 * Like a cookbook with different recipes for combining widgets
 */
export const COOKING_BOOK: MergeRecipe[] = [
  // Text + Image = Text-Image (side by side layout)
  {
    id: 'text-image-left',
    name: 'Text + Image → Side by Side (Text Left)',
    description: 'Combine text on the left with image on the right',
    primaryIngredient: 'text',
    secondaryIngredient: 'image',
    resultType: 'text-image',
    icon: 'mdi:page-layout-sidebar-left',
    transform: (primary, secondary) => ({
      type: 'text-image',
      config: {
        text: primary.config as TextWidgetConfig,
        image: secondary.config as ImageWidgetConfig,
        layout: 'text-left' as const,
      },
    }),
  },
  {
    id: 'text-image-right',
    name: 'Image + Text → Side by Side (Text Right)',
    description: 'Combine image on the left with text on the right',
    primaryIngredient: 'image',
    secondaryIngredient: 'text',
    resultType: 'text-image',
    icon: 'mdi:page-layout-sidebar-right',
    transform: (primary, secondary) => ({
      type: 'text-image',
      config: {
        text: secondary.config as TextWidgetConfig,
        image: primary.config as ImageWidgetConfig,
        layout: 'text-right' as const,
      },
    }),
  },
  // Image + Text = Image Blur with Overlay
  {
    id: 'image-blur-overlay',
    name: 'Image + Text → Image with Text Overlay',
    description: 'Create a blurred image background with text overlay',
    primaryIngredient: 'image',
    secondaryIngredient: 'text',
    resultType: 'image-blur',
    icon: 'mdi:image-filter-drama',
    transform: (primary, secondary) => {
      const imageConfig = primary.config as ImageWidgetConfig;
      const textConfig = secondary.config as TextWidgetConfig;
      // Map subtitle variants to body variants for image-blur
      const variant = textConfig.variant;
      const mappedVariant =
        variant === 'subtitle1' || variant === 'subtitle2' ? 'body1' : (variant ?? 'h4');
      return {
        type: 'image-blur' as const,
        config: {
          src: imageConfig.src,
          alt: imageConfig.alt,
          blurLevel: 4,
          text: textConfig.content,
          textVariant: mappedVariant,
          textAlign: textConfig.align ?? 'center',
        },
      };
    },
  },
  // Text + Image (reversed order for overlay)
  {
    id: 'text-image-overlay',
    name: 'Text + Image → Image with Text Overlay',
    description: 'Create a text overlay on blurred image background',
    primaryIngredient: 'text',
    secondaryIngredient: 'image',
    resultType: 'image-blur',
    icon: 'mdi:image-filter-drama',
    transform: (primary, secondary) => {
      const textConfig = primary.config as TextWidgetConfig;
      const imageConfig = secondary.config as ImageWidgetConfig;
      // Map subtitle variants to body variants for image-blur
      const variant = textConfig.variant;
      const mappedVariant =
        variant === 'subtitle1' || variant === 'subtitle2' ? 'body1' : (variant ?? 'h4');
      return {
        type: 'image-blur' as const,
        config: {
          src: imageConfig.src,
          alt: imageConfig.alt,
          blurLevel: 4,
          text: textConfig.content,
          textVariant: mappedVariant,
          textAlign: textConfig.align ?? 'center',
        },
      };
    },
  },
];

// ----------------------------------------------------------------------

/**
 * Find a compatible merge recipe for two widgets
 */
export function findMergeRecipe(
  primaryType: WidgetType,
  secondaryType: WidgetType
): MergeRecipe | null {
  return (
    COOKING_BOOK.find(
      (recipe) =>
        recipe.primaryIngredient === primaryType && recipe.secondaryIngredient === secondaryType
    ) ?? null
  );
}

/**
 * Get all recipes where the given widget type is the primary ingredient
 */
export function getRecipesForPrimary(widgetType: WidgetType): MergeRecipe[] {
  return COOKING_BOOK.filter((recipe) => recipe.primaryIngredient === widgetType);
}

/**
 * Get all recipes where the given widget type is the secondary ingredient
 */
export function getRecipesForSecondary(widgetType: WidgetType): MergeRecipe[] {
  return COOKING_BOOK.filter((recipe) => recipe.secondaryIngredient === widgetType);
}

/**
 * Check if a widget can be merged as primary with any other widget
 */
export function canBePrimary(widgetType: WidgetType): boolean {
  return COOKING_BOOK.some((recipe) => recipe.primaryIngredient === widgetType);
}

/**
 * Check if a widget can be merged as secondary into any other widget
 */
export function canBeSecondary(widgetType: WidgetType): boolean {
  return COOKING_BOOK.some((recipe) => recipe.secondaryIngredient === widgetType);
}

// ----------------------------------------------------------------------

// Widget type icons for visual display
const WIDGET_TYPE_ICONS: Record<WidgetType, IconifyName> = {
  "image-cutout": 'mdi:image-filter-drama',
  chart: 'mdi:chart-box-outline',
  text: 'mdi:format-header-1',
  image: 'mdi:image-outline',
  'text-image': 'mdi:page-layout-sidebar-left',
  table: 'mdi:table-large',
  'image-blur': 'mdi:image-filter-drama'
};

const WIDGET_TYPE_NAMES: Record<WidgetType, string> = {
  "image-cutout": '',
  chart: 'Chart',
  text: 'Text',
  image: 'Image',
  'text-image': 'Text + Image',
  table: 'Table',
  'image-blur': 'Image Overlay'
};

// ----------------------------------------------------------------------

interface CookingBookDrawerProps {
  open: boolean;
  onClose: () => void;
  onSelectRecipe?: (recipe: MergeRecipe) => void;
}

/**
 * Cooking Book Drawer: Shows all available merge recipes
 */
export function CookingBookDrawer({ open, onClose, onSelectRecipe }: CookingBookDrawerProps) {
  // Group recipes by result type
  const groupedRecipes = COOKING_BOOK.reduce(
    (acc, recipe) => {
      const key = recipe.resultType;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(recipe);
      return acc;
    },
    {} as Record<WidgetType, MergeRecipe[]>
  );

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 400 } }}>
      <Box sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="mdi:chef-hat" width={24} />
            <Typography variant="h6">Cooking Book</Typography>
          </Stack>
          <IconButton onClick={onClose} size="small">
            <Iconify icon="mdi:close" />
          </IconButton>
        </Stack>

        <Alert severity="info" sx={{ mb: 2 }}>
          Drag a widget onto another to merge them! Each recipe shows what you can create.
        </Alert>

        <Stack spacing={3}>
          {Object.entries(groupedRecipes).map(([resultType, recipes]) => (
            <Box key={resultType}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                <Iconify icon={WIDGET_TYPE_ICONS[resultType as WidgetType]} width={20} />
                <Typography variant="subtitle1">
                  Creates: {WIDGET_TYPE_NAMES[resultType as WidgetType]}
                </Typography>
                <Chip label={recipes.length} size="small" />
              </Stack>

              <Stack spacing={1.5}>
                {recipes.map((recipe) => (
                  <Card
                    key={recipe.id}
                    sx={{
                      cursor: onSelectRecipe ? 'pointer' : 'default',
                      transition: 'all 0.2s',
                      '&:hover': onSelectRecipe
                        ? {
                            bgcolor: 'action.hover',
                            transform: 'translateX(4px)',
                          }
                        : {},
                    }}
                    onClick={() => onSelectRecipe?.(recipe)}
                  >
                    <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                      {/* Recipe visual representation */}
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ mb: 1, flexWrap: 'wrap' }}
                      >
                        <Tooltip title={WIDGET_TYPE_NAMES[recipe.primaryIngredient]}>
                          <Badge
                            badgeContent="1"
                            color="primary"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          >
                            <Box
                              sx={{
                                p: 0.75,
                                bgcolor: 'primary.lighter',
                                borderRadius: 1,
                                display: 'flex',
                              }}
                            >
                              <Iconify
                                icon={WIDGET_TYPE_ICONS[recipe.primaryIngredient]}
                                width={20}
                              />
                            </Box>
                          </Badge>
                        </Tooltip>

                        <Iconify icon="mdi:plus" width={16} sx={{ color: 'text.secondary' }} />

                        <Tooltip title={WIDGET_TYPE_NAMES[recipe.secondaryIngredient]}>
                          <Badge
                            badgeContent="2"
                            color="secondary"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          >
                            <Box
                              sx={{
                                p: 0.75,
                                bgcolor: 'secondary.lighter',
                                borderRadius: 1,
                                display: 'flex',
                              }}
                            >
                              <Iconify
                                icon={WIDGET_TYPE_ICONS[recipe.secondaryIngredient]}
                                width={20}
                              />
                            </Box>
                          </Badge>
                        </Tooltip>

                        <Iconify
                          icon="mdi:arrow-right-thick"
                          width={20}
                          sx={{ color: 'success.main' }}
                        />

                        <Tooltip title={WIDGET_TYPE_NAMES[recipe.resultType]}>
                          <Box
                            sx={{
                              p: 0.75,
                              bgcolor: 'success.lighter',
                              borderRadius: 1,
                              display: 'flex',
                            }}
                          >
                            <Iconify icon={WIDGET_TYPE_ICONS[recipe.resultType]} width={20} />
                          </Box>
                        </Tooltip>
                      </Stack>

                      <Typography variant="body2" fontWeight={500}>
                        {recipe.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {recipe.description}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
              <Divider sx={{ mt: 2 }} />
            </Box>
          ))}
        </Stack>
      </Box>
    </Drawer>
  );
}

// ----------------------------------------------------------------------

interface MergePreviewDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  recipe: MergeRecipe | null;
  primaryWidget: WidgetItem | null;
  secondaryWidget: WidgetItem | null;
}

/**
 * Merge Preview Dialog: Shows preview of the merge result before confirming
 */
export function MergePreviewDialog({
  open,
  onClose,
  onConfirm,
  recipe,
  primaryWidget,
  secondaryWidget,
}: MergePreviewDialogProps) {
  if (!recipe || !primaryWidget || !secondaryWidget) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:merge" width={24} />
          <span>Merge Widgets</span>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ pt: 1 }}>
          <Alert severity="info" icon={<Iconify icon="mdi:chef-hat" />}>
            You&apos;re about to combine two widgets using the recipe: <strong>{recipe.name}</strong>
          </Alert>

          {/* Visual merge representation */}
          <Card sx={{ bgcolor: 'background.neutral' }}>
            <CardContent>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                spacing={2}
                sx={{ flexWrap: 'wrap' }}
              >
                {/* Primary widget */}
                <Stack alignItems="center" spacing={0.5}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'primary.lighter',
                      borderRadius: 2,
                      border: '2px solid',
                      borderColor: 'primary.main',
                    }}
                  >
                    <Iconify
                      icon={WIDGET_TYPE_ICONS[primaryWidget.widgetConfig.type]}
                      width={32}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {WIDGET_TYPE_NAMES[primaryWidget.widgetConfig.type]}
                  </Typography>
                  <Chip label="Primary" size="small" color="primary" />
                </Stack>

                <Iconify icon="mdi:plus-circle" width={28} sx={{ color: 'text.secondary' }} />

                {/* Secondary widget */}
                <Stack alignItems="center" spacing={0.5}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'secondary.lighter',
                      borderRadius: 2,
                      border: '2px solid',
                      borderColor: 'secondary.main',
                    }}
                  >
                    <Iconify
                      icon={WIDGET_TYPE_ICONS[secondaryWidget.widgetConfig.type]}
                      width={32}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {WIDGET_TYPE_NAMES[secondaryWidget.widgetConfig.type]}
                  </Typography>
                  <Chip label="Secondary" size="small" color="secondary" />
                </Stack>

                <Iconify icon="mdi:arrow-right-bold" width={28} sx={{ color: 'success.main' }} />

                {/* Result widget */}
                <Stack alignItems="center" spacing={0.5}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'success.lighter',
                      borderRadius: 2,
                      border: '2px solid',
                      borderColor: 'success.main',
                    }}
                  >
                    <Iconify icon={WIDGET_TYPE_ICONS[recipe.resultType]} width={32} />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {WIDGET_TYPE_NAMES[recipe.resultType]}
                  </Typography>
                  <Chip label="Result" size="small" color="success" />
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Typography variant="body2" color="text.secondary">
            {recipe.description}
          </Typography>

          <Alert severity="warning" variant="outlined">
            The two original widgets will be replaced with the merged result. You can undo this
            action from the merge history.
          </Alert>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          color="success"
          startIcon={<Iconify icon="mdi:merge" />}
          onClick={onConfirm}
        >
          Merge Widgets
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ----------------------------------------------------------------------

interface MergeHistoryDrawerProps {
  open: boolean;
  onClose: () => void;
  history: MergeHistoryEntry[];
  onUndo: (entry: MergeHistoryEntry) => void;
}

/**
 * Merge History Drawer: Shows history of all merges with undo capability
 */
export function MergeHistoryDrawer({ open, onClose, history, onUndo }: MergeHistoryDrawerProps) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 380 } }}>
      <Box sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="mdi:history" width={24} />
            <Typography variant="h6">Merge History</Typography>
          </Stack>
          <IconButton onClick={onClose} size="small">
            <Iconify icon="mdi:close" />
          </IconButton>
        </Stack>

        {history.length === 0 ? (
          <Box
            sx={{
              py: 8,
              textAlign: 'center',
            }}
          >
            <Iconify
              icon="mdi:history"
              width={48}
              sx={{ color: 'text.disabled', mb: 2 }}
            />
            <Typography variant="body2" color="text.secondary">
              No merge history yet
            </Typography>
            <Typography variant="caption" color="text.disabled">
              Merge widgets to see history here
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {history.map((entry) => (
              <Card key={entry.id}>
                <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ mb: 1 }}
                  >
                    <Typography variant="subtitle2">{entry.recipeName}</Typography>
                    <Tooltip title="Undo this merge">
                      <IconButton
                        size="small"
                        color="warning"
                        onClick={() => onUndo(entry)}
                      >
                        <Iconify icon="mdi:undo" width={18} />
                      </IconButton>
                    </Tooltip>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 0.5 }}>
                    <Iconify
                      icon={WIDGET_TYPE_ICONS[entry.originalPrimaryWidget.widgetConfig.type]}
                      width={16}
                    />
                    <Iconify icon="mdi:plus" width={12} sx={{ color: 'text.disabled' }} />
                    <Iconify
                      icon={WIDGET_TYPE_ICONS[entry.originalSecondaryWidget.widgetConfig.type]}
                      width={16}
                    />
                    <Iconify icon="mdi:arrow-right" width={12} sx={{ color: 'text.disabled' }} />
                    <Iconify
                      icon={WIDGET_TYPE_ICONS[entry.resultWidget.widgetConfig.type]}
                      width={16}
                    />
                  </Stack>

                  <Typography variant="caption" color="text.disabled">
                    {new Date(entry.timestamp).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Box>
    </Drawer>
  );
}

// ----------------------------------------------------------------------

interface MergeDropZoneProps {
  isOver: boolean;
  canDrop: boolean;
  recipe: MergeRecipe | null;
}

/**
 * Visual indicator for merge drop zone
 */
export function MergeDropZoneIndicator({ isOver, canDrop, recipe }: MergeDropZoneProps) {
  if (!isOver) return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: canDrop ? 'success.lighter' : 'error.lighter',
        border: '3px dashed',
        borderColor: canDrop ? 'success.main' : 'error.main',
        borderRadius: 2,
        zIndex: 10,
        opacity: 0.9,
        pointerEvents: 'none',
      }}
    >
      <Stack alignItems="center" spacing={1}>
        <Iconify
          icon={canDrop ? 'mdi:merge' : 'mdi:cancel'}
          width={48}
          sx={{ color: canDrop ? 'success.main' : 'error.main' }}
        />
        <Typography
          variant="subtitle1"
          sx={{ color: canDrop ? 'success.dark' : 'error.dark' }}
        >
          {canDrop ? `Merge → ${recipe?.name ?? 'Drop to merge'}` : 'Cannot merge these widgets'}
        </Typography>
      </Stack>
    </Box>
  );
}
