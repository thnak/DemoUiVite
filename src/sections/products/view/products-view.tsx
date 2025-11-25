import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function ProductsView() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5 }}>
        <Typography variant="h4">Products</Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New Product
        </Button>
      </Box>

      <Card sx={{ p: 3 }}>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Product list will be displayed here. This is a placeholder view.
        </Typography>
      </Card>
    </Box>
  );
}
