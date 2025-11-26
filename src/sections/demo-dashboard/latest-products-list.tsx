import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';

import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';

import type { DemoProduct } from './demo-dashboard-data';

// ----------------------------------------------------------------------

type LatestProductsListProps = CardProps & {
  title: string;
  subheader?: string;
  data: DemoProduct[];
};

export function LatestProductsList({
  title,
  subheader,
  data,
  sx,
  ...other
}: LatestProductsListProps) {
  return (
    <Card sx={sx} {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Stack spacing={3} sx={{ p: 3, pt: 2 }}>
        {data.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </Stack>
    </Card>
  );
}

// ----------------------------------------------------------------------

type ProductItemProps = {
  product: DemoProduct;
};

function ProductItem({ product }: ProductItemProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Box
        component="img"
        alt={product.name}
        src={product.imageUrl}
        sx={{
          width: 48,
          height: 48,
          flexShrink: 0,
          borderRadius: 1.5,
          objectFit: 'cover',
        }}
      />

      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Box
          sx={{
            mb: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Box
            component="span"
            sx={{
              typography: 'subtitle2',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {product.name}
          </Box>

          {product.isNew && (
            <Label variant="soft" color="info" sx={{ flexShrink: 0 }}>
              NEW
            </Label>
          )}

          {product.isSale && (
            <Label variant="soft" color="error" sx={{ flexShrink: 0 }}>
              SALE
            </Label>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {product.salePrice ? (
            <>
              <Box
                component="span"
                sx={{
                  typography: 'body2',
                  color: 'text.disabled',
                  textDecoration: 'line-through',
                }}
              >
                {fCurrency(product.price)}
              </Box>
              <Box
                component="span"
                sx={{
                  typography: 'subtitle2',
                  color: 'error.main',
                }}
              >
                {fCurrency(product.salePrice)}
              </Box>
            </>
          ) : (
            <Box
              component="span"
              sx={{
                typography: 'subtitle2',
                color: 'text.secondary',
              }}
            >
              {fCurrency(product.price)}
            </Box>
          )}
        </Box>
      </Box>

      <ColorPreview colors={product.colors} />
    </Box>
  );
}

// ----------------------------------------------------------------------

type ColorPreviewProps = {
  colors: string[];
  limit?: number;
};

function ColorPreview({ colors, limit = 3 }: ColorPreviewProps) {
  const showColors = colors.slice(0, limit);
  const moreCount = colors.length - limit;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        flexShrink: 0,
      }}
    >
      {showColors.map((color, index) => (
        <Box
          key={`${color}-${index}`}
          sx={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            backgroundColor: color,
            border: color.toUpperCase() === '#FFFFFF' ? '1px solid rgba(0, 0, 0, 0.12)' : 'none',
          }}
          aria-label={`Color option ${index + 1}`}
        />
      ))}

      {moreCount > 0 && (
        <Box
          component="span"
          sx={{
            typography: 'caption',
            color: 'text.secondary',
            ml: 0.5,
          }}
        >
          +{moreCount}
        </Box>
      )}
    </Box>
  );
}
