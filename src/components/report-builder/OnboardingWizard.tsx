/**
 * OnboardingWizard Component
 *
 * A 3-step MUI Dialog/Stepper to guide new users through:
 * 1. Choose Entity
 * 2. Add Fields
 * 3. Preview & Run
 */

import type { EntityMetadata } from 'src/types/report-builder';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import Stepper from '@mui/material/Stepper';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import ListItemButton from '@mui/material/ListItemButton';

// ----------------------------------------------------------------------

interface OnboardingWizardProps {
  open: boolean;
  entities: EntityMetadata[];
  onClose: () => void;
  onComplete: (entityName: string, selectedFields: string[]) => void;
}

const STEPS = ['Choose Entity', 'Add Fields', 'Preview & Run'];

export function OnboardingWizard({ open, entities, onClose, onComplete }: OnboardingWizardProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedEntity, setSelectedEntity] = useState('');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  const currentEntity = entities.find((e) => e.entityName === selectedEntity);

  const handleNext = () => {
    if (activeStep === STEPS.length - 1) {
      onComplete(selectedEntity, selectedFields);
      handleClose();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleClose = () => {
    setActiveStep(0);
    setSelectedEntity('');
    setSelectedFields([]);
    onClose();
  };

  const handleToggleField = (fieldName: string) => {
    setSelectedFields((prev) =>
      prev.includes(fieldName) ? prev.filter((f) => f !== fieldName) : [...prev, fieldName]
    );
  };

  const canProceed = () => {
    switch (activeStep) {
      case 0:
        return !!selectedEntity;
      case 1:
        return selectedFields.length > 0;
      case 2:
        return true;
      default:
        return false;
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Report Builder Quick Start</DialogTitle>

      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step 1: Choose Entity */}
        {activeStep === 0 && (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Select the main entity (data source) for your report
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Entity</InputLabel>
              <Select
                value={selectedEntity}
                onChange={(e) => setSelectedEntity(e.target.value)}
                label="Entity"
              >
                {entities
                  .filter((e) => e.isAvailable)
                  .map((entity) => (
                    <MenuItem key={entity.entityName} value={entity.entityName}>
                      {entity.displayName} {entity.category && `(${entity.category})`}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
        )}

        {/* Step 2: Add Fields */}
        {activeStep === 1 && (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Select the fields you want to display in your report
            </Typography>
            {currentEntity && (
              <List sx={{ maxHeight: 400, overflow: 'auto', border: (theme) => `1px solid ${theme.palette.divider}`, borderRadius: 1 }}>
                {currentEntity.properties.map((prop) => (
                  <ListItemButton
                    key={prop.propertyName}
                    onClick={() => handleToggleField(prop.propertyName)}
                    dense
                  >
                    <Checkbox
                      edge="start"
                      checked={selectedFields.includes(prop.propertyName)}
                      tabIndex={-1}
                      disableRipple
                    />
                    <ListItemText
                      primary={prop.displayName}
                      secondary={`${prop.typeName}${prop.isNullable ? ' (nullable)' : ''}`}
                    />
                  </ListItemButton>
                ))}
              </List>
            )}
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              {selectedFields.length} field(s) selected
            </Typography>
          </Box>
        )}

        {/* Step 3: Preview & Run */}
        {activeStep === 2 && (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Review your selections and click Finish to create your report
            </Typography>
            <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Entity: {currentEntity?.displayName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Selected Fields: {selectedFields.join(', ')}
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        {activeStep > 0 && (
          <Button onClick={handleBack}>Back</Button>
        )}
        <Button variant="contained" onClick={handleNext} disabled={!canProceed()}>
          {activeStep === STEPS.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
