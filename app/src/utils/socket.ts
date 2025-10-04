export const getSocketUri = (): string => {
  if (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  ) {
    return 'ws://localhost:3000/socket';
  } else {
    return 'wss://crowdpad-server.fly.dev/socket';
  }
};
