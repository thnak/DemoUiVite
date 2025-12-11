/**
 * Example usage of generated entity selector components
 * This file demonstrates how to use the auto-generated selectors
 */

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import {
  AreaSelector,
  ProductSelector,
  MachineSelector,
  StationSelector,
  CalendarSelector,
  DepartmentSelector,
} from 'src/components/selectors';

// ----------------------------------------------------------------------

export function SelectorExamples() {
  // Single selector example
  const [productId, setProductId] = useState<string | null>(null);

  // Multiple selectors example
  const [formData, setFormData] = useState({
    machineId: null as string | null,
    stationId: null as string | null,
    areaId: null as string | null,
    departmentId: null as string | null,
    calendarId: null as string | null,
  });

  const handleSubmit = () => {
    console.log('Form submitted with:', {
      productId,
      ...formData,
    });
  };

  const handleReset = () => {
    setProductId(null);
    setFormData({
      machineId: null,
      stationId: null,
      areaId: null,
      departmentId: null,
      calendarId: null,
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Entity Selector Examples
      </Typography>

      <Stack spacing={3}>
        {/* Example 1: Single Selector */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Example 1: Single Selector
            </Typography>
            <ProductSelector
              value={productId}
              onChange={setProductId}
              label="Select Product"
              helperText="Start typing to search for products"
            />
            {productId && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected Product ID: {productId}
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Example 2: Multiple Selectors in a Form */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Example 2: Production Assignment Form
            </Typography>
            <Stack spacing={2}>
              <MachineSelector
                value={formData.machineId}
                onChange={(id) => setFormData({ ...formData, machineId: id })}
                label="Machine"
                required
              />
              <StationSelector
                value={formData.stationId}
                onChange={(id) => setFormData({ ...formData, stationId: id })}
                label="Station"
                required
              />
              <AreaSelector
                value={formData.areaId}
                onChange={(id) => setFormData({ ...formData, areaId: id })}
                label="Area"
              />
              <DepartmentSelector
                value={formData.departmentId}
                onChange={(id) => setFormData({ ...formData, departmentId: id })}
                label="Department"
              />
              <CalendarSelector
                value={formData.calendarId}
                onChange={(id) => setFormData({ ...formData, calendarId: id })}
                label="Calendar"
              />

              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button variant="contained" onClick={handleSubmit}>
                  Submit
                </Button>
                <Button variant="outlined" onClick={handleReset}>
                  Reset
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Example 3: With Validation */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Example 3: With Validation
            </Typography>
            <ProductSelector
              value={productId}
              onChange={setProductId}
              label="Product (Required)"
              required
              error={!productId}
              helperText={!productId ? 'Please select a product' : 'Product selected'}
            />
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
