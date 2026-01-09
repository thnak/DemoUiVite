import type { SxProps, Theme } from '@mui/material/styles';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface TimeShiftCaseVisualizationProps {
  lateBufferMinutes?: number;
  mergeCase4ToShift1?: boolean;
  mergeCase5ToLatest?: boolean;
  autoVirtualShift?: boolean;
  sx?: SxProps<Theme>;
}

interface CaseInfo {
  id: number;
  name: string;
  description: string;
  trigger: string;
  color: string;
  affectedBy: ('lateBuffer' | 'case4' | 'case5' | 'autoVirtual')[];
}

const CASES: CaseInfo[] = [
  {
    id: 1,
    name: 'Case 1: Shift Loss',
    description: 'Machine stopped during shift (excluding breaks)',
    trigger: 'Downtime during scheduled shift',
    color: '#EF5350',
    affectedBy: [],
  },
  {
    id: 2,
    name: 'Case 2: Planned Break',
    description: 'Machine stopped during scheduled break',
    trigger: 'During defined break period',
    color: '#FFA726',
    affectedBy: [],
  },
  {
    id: 3,
    name: 'Case 3: Break Run',
    description: 'Machine running during scheduled break',
    trigger: 'Production during break time',
    color: '#66BB6A',
    affectedBy: [],
  },
  {
    id: 4,
    name: 'Case 4: Early Start',
    description: 'Production before first shift starts',
    trigger: 'Between work date start and first shift',
    color: '#42A5F5',
    affectedBy: ['case4'],
  },
  {
    id: 5,
    name: 'Case 5: Overtime',
    description: 'Production after shift within buffer window',
    trigger: 'Within late buffer minutes after shift',
    color: '#AB47BC',
    affectedBy: ['lateBuffer', 'case5'],
  },
  {
    id: 6,
    name: 'Case 6: Night Run',
    description: 'Production beyond buffer window (ghost production)',
    trigger: 'Beyond late buffer minutes',
    color: '#78909C',
    affectedBy: ['lateBuffer'],
  },
  {
    id: 7,
    name: 'Case 7: Sunday',
    description: 'Production on Sunday',
    trigger: 'Activity on Sunday',
    color: '#FF7043',
    affectedBy: ['autoVirtual'],
  },
  {
    id: 8,
    name: 'Case 8: Holiday',
    description: 'Production on public holiday',
    trigger: 'Activity on defined holiday',
    color: '#EC407A',
    affectedBy: ['autoVirtual'],
  },
];

// ----------------------------------------------------------------------

export function TimeShiftCaseVisualization({
  lateBufferMinutes = 120,
  mergeCase4ToShift1 = false,
  mergeCase5ToLatest = false,
  autoVirtualShift = false,
  sx,
}: TimeShiftCaseVisualizationProps) {
  const [expanded, setExpanded] = useState(false);
  const [selectedCase, setSelectedCase] = useState<number | null>(null);

  const handleToggleExpanded = () => {
    setExpanded(!expanded);
  };

  const handleCaseClick = (caseId: number) => {
    setSelectedCase(selectedCase === caseId ? null : caseId);
  };

  const isCaseAffected = (affectedBy: CaseInfo['affectedBy']): boolean => {
    if (affectedBy.length === 0) return false;

    return affectedBy.some((factor) => {
      switch (factor) {
        case 'lateBuffer':
          return lateBufferMinutes !== 120; // Highlighted if different from default
        case 'case4':
          return mergeCase4ToShift1;
        case 'case5':
          return mergeCase5ToLatest;
        case 'autoVirtual':
          return autoVirtualShift;
        default:
          return false;
      }
    });
  };

  return (
    <Card sx={sx}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Iconify icon="solar:diagram-up-bold-duotone" width={24} />
            <Typography variant="h6">Time-Shift Case Overview</Typography>
          </Box>
          <Button
            size="small"
            onClick={handleToggleExpanded}
            endIcon={
              <Iconify
                icon={expanded ? 'solar:alt-arrow-up-bold' : 'solar:alt-arrow-down-bold'}
                width={20}
              />
            }
          >
            {expanded ? 'Collapse' : 'Expand'}
          </Button>
        </Box>

        <Alert severity="info" sx={{ mb: 2 }}>
          This diagram shows the 8 time-shift cases and how your policy configuration affects them.
          Click on any case to see more details.
        </Alert>

        <Collapse in={expanded}>
          <Stack spacing={2}>
            {/* Visual Timeline Representation */}
            <Box
              sx={{
                p: 2,
                bgcolor: 'background.neutral',
                borderRadius: 1,
                position: 'relative',
                minHeight: 200,
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Timeline Visualization
              </Typography>

              {/* Work Day Timeline */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {/* Time labels */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Work Day Start
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Shift 1
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Break
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Shift 2
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    + {lateBufferMinutes}min
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Night/Weekend
                  </Typography>
                </Box>

                {/* Timeline bar */}
                <Box
                  sx={{
                    display: 'flex',
                    height: 40,
                    borderRadius: 1,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  {/* Case 4: Early Start */}
                  <Tooltip title="Case 4: Early Start" arrow>
                    <Box
                      sx={{
                        flex: 1,
                        bgcolor: CASES[3].color,
                        cursor: 'pointer',
                        opacity: isCaseAffected(CASES[3].affectedBy) ? 1 : 0.5,
                        transition: 'all 0.3s',
                        '&:hover': { opacity: 1, transform: 'scale(1.02)' },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onClick={() => handleCaseClick(4)}
                    >
                      <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                        4
                      </Typography>
                    </Box>
                  </Tooltip>

                  {/* Shift 1 (Standard + Case 1/2/3) */}
                  <Tooltip title="Shift 1: Standard Work + Cases 1,2,3" arrow>
                    <Box
                      sx={{
                        flex: 3,
                        bgcolor: '#4CAF50',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                        Shift 1
                      </Typography>
                    </Box>
                  </Tooltip>

                  {/* Break (Case 2/3) */}
                  <Tooltip title="Break: Cases 2 & 3" arrow>
                    <Box
                      sx={{
                        flex: 0.5,
                        bgcolor: CASES[1].color,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                        B
                      </Typography>
                    </Box>
                  </Tooltip>

                  {/* Shift 2 */}
                  <Tooltip title="Shift 2: Standard Work" arrow>
                    <Box
                      sx={{
                        flex: 3,
                        bgcolor: '#4CAF50',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                        Shift 2
                      </Typography>
                    </Box>
                  </Tooltip>

                  {/* Case 5: Overtime */}
                  <Tooltip title="Case 5: Overtime (within buffer)" arrow>
                    <Box
                      sx={{
                        flex: 1,
                        bgcolor: CASES[4].color,
                        cursor: 'pointer',
                        opacity: isCaseAffected(CASES[4].affectedBy) ? 1 : 0.5,
                        transition: 'all 0.3s',
                        '&:hover': { opacity: 1, transform: 'scale(1.02)' },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onClick={() => handleCaseClick(5)}
                    >
                      <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                        5
                      </Typography>
                    </Box>
                  </Tooltip>

                  {/* Case 6: Night Run */}
                  <Tooltip title="Case 6: Night Run (beyond buffer)" arrow>
                    <Box
                      sx={{
                        flex: 1.5,
                        bgcolor: CASES[5].color,
                        cursor: 'pointer',
                        opacity: isCaseAffected(CASES[5].affectedBy) ? 1 : 0.5,
                        transition: 'all 0.3s',
                        '&:hover': { opacity: 1, transform: 'scale(1.02)' },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onClick={() => handleCaseClick(6)}
                    >
                      <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                        6
                      </Typography>
                    </Box>
                  </Tooltip>
                </Box>

                {/* Weekend/Holiday row */}
                <Box
                  sx={{
                    display: 'flex',
                    height: 40,
                    borderRadius: 1,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider',
                    mt: 1,
                  }}
                >
                  <Tooltip title="Case 7: Sunday Production" arrow>
                    <Box
                      sx={{
                        flex: 1,
                        bgcolor: CASES[6].color,
                        cursor: 'pointer',
                        opacity: isCaseAffected(CASES[6].affectedBy) ? 1 : 0.5,
                        transition: 'all 0.3s',
                        '&:hover': { opacity: 1, transform: 'scale(1.02)' },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onClick={() => handleCaseClick(7)}
                    >
                      <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                        Case 7: Sunday
                      </Typography>
                    </Box>
                  </Tooltip>

                  <Tooltip title="Case 8: Holiday Production" arrow>
                    <Box
                      sx={{
                        flex: 1,
                        bgcolor: CASES[7].color,
                        cursor: 'pointer',
                        opacity: isCaseAffected(CASES[7].affectedBy) ? 1 : 0.5,
                        transition: 'all 0.3s',
                        '&:hover': { opacity: 1, transform: 'scale(1.02)' },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onClick={() => handleCaseClick(8)}
                    >
                      <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                        Case 8: Holiday
                      </Typography>
                    </Box>
                  </Tooltip>
                </Box>
              </Box>
            </Box>

            {/* Case Details Grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2 }}>
              {CASES.map((caseInfo) => {
                const isAffected = isCaseAffected(caseInfo.affectedBy);
                const isSelected = selectedCase === caseInfo.id;

                return (
                  <Card
                    key={caseInfo.id}
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      border: '2px solid',
                      borderColor: isSelected ? caseInfo.color : 'transparent',
                      bgcolor: isSelected ? `${caseInfo.color}10` : 'background.paper',
                      '&:hover': {
                        borderColor: caseInfo.color,
                        transform: 'translateY(-2px)',
                        boxShadow: 2,
                      },
                    }}
                    onClick={() => handleCaseClick(caseInfo.id)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            bgcolor: caseInfo.color,
                          }}
                        />
                        <Typography variant="subtitle2">{caseInfo.name}</Typography>
                        {isAffected && (
                          <Chip
                            label="Active"
                            size="small"
                            color="primary"
                            sx={{ ml: 'auto', height: 20 }}
                          />
                        )}
                      </Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                        {caseInfo.description}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
                        Trigger: {caseInfo.trigger}
                      </Typography>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>

            {/* Current Configuration Summary */}
            <Card sx={{ bgcolor: 'background.neutral' }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Current Policy Configuration
                </Typography>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Iconify icon="solar:clock-circle-bold-duotone" width={20} />
                    <Typography variant="body2">
                      Late Buffer: <strong>{lateBufferMinutes} minutes</strong>
                    </Typography>
                    <Chip
                      label={`Cases 5 & 6`}
                      size="small"
                      sx={{ ml: 1 }}
                      color={lateBufferMinutes !== 120 ? 'primary' : 'default'}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Iconify icon="solar:play-circle-bold-duotone" width={20} />
                    <Typography variant="body2">
                      Merge Case 4 (Early Start): <strong>{mergeCase4ToShift1 ? 'Yes' : 'No'}</strong>
                    </Typography>
                    <Chip
                      label="Case 4"
                      size="small"
                      sx={{ ml: 1 }}
                      color={mergeCase4ToShift1 ? 'primary' : 'default'}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Iconify icon="solar:stop-circle-bold-duotone" width={20} />
                    <Typography variant="body2">
                      Merge Case 5 (Overtime): <strong>{mergeCase5ToLatest ? 'Yes' : 'No'}</strong>
                    </Typography>
                    <Chip
                      label="Case 5"
                      size="small"
                      sx={{ ml: 1 }}
                      color={mergeCase5ToLatest ? 'primary' : 'default'}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Iconify icon="solar:calendar-mark-bold-duotone" width={20} />
                    <Typography variant="body2">
                      Auto Virtual Shift: <strong>{autoVirtualShift ? 'Enabled' : 'Disabled'}</strong>
                    </Typography>
                    <Chip
                      label="Cases 7 & 8"
                      size="small"
                      sx={{ ml: 1 }}
                      color={autoVirtualShift ? 'primary' : 'default'}
                    />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Collapse>
      </CardContent>
    </Card>
  );
}
