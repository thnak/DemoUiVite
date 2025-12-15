/**
 * Connection Status Component
 * Displays the current SignalR connection state
 */

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import { useRealtimeConnection } from 'src/hooks/use-realtime-connection';

export function ConnectionStatus() {
  const { connectionState, isConnected, isConnecting, isReconnecting, isDisconnected } =
    useRealtimeConnection();

  const getStatusConfig = () => {
    if (isConnected) {
      return { label: '🟢 Connected', color: 'success' as const };
    }
    if (isReconnecting) {
      return { label: '🟡 Reconnecting...', color: 'warning' as const };
    }
    if (isConnecting) {
      return { label: '🔵 Connecting...', color: 'info' as const };
    }
    if (isDisconnected) {
      return { label: '🔴 Disconnected', color: 'error' as const };
    }
    return { label: 'Unknown', color: 'default' as const };
  };

  const { label, color } = getStatusConfig();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Chip label={label} color={color} size="small" variant="outlined" />
      {connectionState.lastConnected && isConnected && (
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Connected at {connectionState.lastConnected.toLocaleTimeString()}
        </Typography>
      )}
      {connectionState.connectionId && (
        <Typography variant="caption" sx={{ color: 'text.disabled', fontFamily: 'monospace' }}>
          ID: {connectionState.connectionId.substring(0, 8)}
        </Typography>
      )}
    </Box>
  );
}
