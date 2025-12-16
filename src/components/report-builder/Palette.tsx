/**
 * Palette Component
 *
 * Left palette listing entity properties with search and Add button
 * to add fields to the selected block.
 */

import type { PropertyMetadata } from 'src/types/report-builder';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface PaletteProps {
  properties: PropertyMetadata[];
  entityName: string;
  onAddField: (fieldName: string) => void;
}

export function Palette({ properties, entityName, onAddField }: PaletteProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProperties = properties.filter(
    (prop) =>
      prop.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h6" gutterBottom>
          Fields
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {entityName}
        </Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="Search fields..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', mr: 1 }} />,
          }}
        />
      </Box>

      <List sx={{ flex: 1, overflow: 'auto', py: 0 }}>
        {filteredProperties.length === 0 ? (
          <ListItem>
            <ListItemText
              primary="No fields found"
              secondary="Try a different search term"
              sx={{ textAlign: 'center', color: 'text.secondary' }}
            />
          </ListItem>
        ) : (
          filteredProperties.map((property) => (
            <ListItemButton
              key={property.propertyName}
              sx={{
                py: 1,
                px: 2,
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              <ListItemText
                primary={property.displayName}
                secondary={
                  <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      {property.typeName}
                    </Typography>
                    {property.isNullable && (
                      <Typography variant="caption" color="text.disabled">
                        • Nullable
                      </Typography>
                    )}
                  </Box>
                }
              />
              <Button
                size="small"
                variant="outlined"
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={() => onAddField(property.propertyName)}
                sx={{ ml: 1, minWidth: 'auto' }}
              >
                Add
              </Button>
            </ListItemButton>
          ))
        )}
      </List>

      {/* Extension points for future features */}
      {/* TODO: Add drag-and-drop support using react-beautiful-dnd or dnd-kit */}
      {/* TODO: Add property type icons for better visual distinction */}
      {/* TODO: Add property filtering by type (numeric, string, date, etc.) */}
    </Card>
  );
}
