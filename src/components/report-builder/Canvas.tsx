/**
 * Canvas Component
 *
 * Center canvas that lists blocks, allows adding Table/Chart blocks,
 * selecting, moving (up/down), and removing blocks.
 * Renders TableBlock/ChartBlock previews.
 */

import type { Block, TableBlock as TableBlockType, ChartBlock as ChartBlockType } from 'src/types/report-builder';

import { v4 as uuidv4 } from 'uuid';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

import { TableBlock } from './blocks/TableBlock';
import { ChartBlock } from './blocks/ChartBlock';

// ----------------------------------------------------------------------

interface CanvasProps {
  blocks: Block[];
  selectedBlockId: string | null;
  onBlocksChange: (blocks: Block[]) => void;
  onSelectBlock: (blockId: string | null) => void;
}

export function Canvas({ blocks, selectedBlockId, onBlocksChange, onSelectBlock }: CanvasProps) {
  const handleAddTableBlock = () => {
    const newBlock: TableBlockType = {
      id: uuidv4(),
      type: 'table' as const,
      title: `Table ${blocks.filter((b) => b.type === 'table').length + 1}`,
      fields: [],
      pageSize: 10,
    };
    onBlocksChange([...blocks, newBlock]);
    onSelectBlock(newBlock.id);
  };

  const handleAddChartBlock = () => {
    const newBlock: ChartBlockType = {
      id: uuidv4(),
      type: 'chart' as const,
      title: `Chart ${blocks.filter((b) => b.type === 'chart').length + 1}`,
      fields: [],
      chartType: 'bar',
    };
    onBlocksChange([...blocks, newBlock]);
    onSelectBlock(newBlock.id);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newBlocks = [...blocks];
    [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
    onBlocksChange(newBlocks);
  };

  const handleMoveDown = (index: number) => {
    if (index === blocks.length - 1) return;
    const newBlocks = [...blocks];
    [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
    onBlocksChange(newBlocks);
  };

  const handleRemoveBlock = (blockId: string) => {
    onBlocksChange(blocks.filter((b) => b.id !== blockId));
    if (selectedBlockId === blockId) {
      onSelectBlock(null);
    }
  };

  const handleUpdateBlock = (blockId: string, updates: Partial<TableBlockType> | Partial<ChartBlockType>) => {
    onBlocksChange(
      blocks.map((block) => {
        if (block.id !== blockId) return block;
        return { ...block, ...updates } as Block;
      })
    );
  };

  const handleRemoveField = (blockId: string, fieldName: string) => {
    const block = blocks.find((b) => b.id === blockId);
    if (!block) return;
    
    handleUpdateBlock(blockId, {
      fields: block.fields.filter((f) => f !== fieldName),
    });
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h6" gutterBottom>
          Canvas
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<Iconify icon="solar:grid-bold-duotone" />}
            onClick={handleAddTableBlock}
          >
            Add Table
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<Iconify icon="solar:chart-bold-duotone" />}
            onClick={handleAddChartBlock}
          >
            Add Chart
          </Button>
        </Stack>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {blocks.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'text.secondary',
            }}
          >
            <Iconify icon={"solar:list-bold-duotone" as any} width={64} sx={{ mb: 2, opacity: 0.3 }} />
            <Typography variant="body1" gutterBottom>
              No blocks yet
            </Typography>
            <Typography variant="body2">
              Click &quot;Add Table&quot; or &quot;Add Chart&quot; to get started
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {blocks.map((block, index) => (
              <Box key={block.id} sx={{ position: 'relative' }}>
                <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
                  <Stack direction="row" spacing={0.5}>
                    <IconButton
                      size="small"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      sx={{ bgcolor: 'background.paper' }}
                    >
                      <Iconify icon={"solar:arrow-up-bold-duotone" as any} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleMoveDown(index)}
                      disabled={index === blocks.length - 1}
                      sx={{ bgcolor: 'background.paper' }}
                    >
                      <Iconify icon={"solar:arrow-down-bold-duotone" as any} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveBlock(block.id)}
                      sx={{ bgcolor: 'background.paper', color: 'error.main' }}
                    >
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </Stack>
                </Box>

                {block.type === 'table' ? (
                  <TableBlock
                    block={block}
                    isSelected={selectedBlockId === block.id}
                    onSelect={() => onSelectBlock(block.id)}
                    onRemoveField={(field) => handleRemoveField(block.id, field)}
                    onUpdatePageSize={(pageSize) => handleUpdateBlock(block.id, { pageSize })}
                  />
                ) : (
                  <ChartBlock
                    block={block}
                    isSelected={selectedBlockId === block.id}
                    onSelect={() => onSelectBlock(block.id)}
                    onRemoveField={(field) => handleRemoveField(block.id, field)}
                    onUpdateXAxis={(xAxis) => handleUpdateBlock(block.id, { xAxis })}
                    onUpdateYAxis={(yAxis) => handleUpdateBlock(block.id, { yAxis })}
                  />
                )}

                {index < blocks.length - 1 && <Divider sx={{ my: 2 }} />}
              </Box>
            ))}
          </Stack>
        )}
      </Box>

      {/* Extension points for future features */}
      {/* TODO: Add drag-and-drop block reordering using react-beautiful-dnd or dnd-kit */}
      {/* TODO: Add block duplication feature */}
      {/* TODO: Add block collapse/expand functionality */}
    </Card>
  );
}
