export const getSocketUri = (): string => {
  return import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:3000/socket';
};
