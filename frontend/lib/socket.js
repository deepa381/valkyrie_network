'use client';

// Socket.IO client singleton
// Only initializes on the client side

let socket = null;

export const getSocket = () => {
  if (typeof window === 'undefined') return null;

  if (!socket) {
    // Dynamically import to avoid SSR issues
    // Remove trailing /api if present so socket connects to root server URL
    const socketUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '').replace(/\/$/, '') || 'http://localhost:5000';
    try {
      const { io } = require('socket.io-client');
      socket = io(socketUrl, {
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 3,
        timeout: 5000,
      });

      socket.on('connect', () => {
        console.log('🔌 Socket connected');
      });

      socket.on('connect_error', (err) => {
        console.warn('Socket connection error (non-critical):', err.message);
      });

      socket.on('disconnect', () => {
        console.log('🔌 Socket disconnected');
      });
    } catch (err) {
      console.warn('Socket.IO not available:', err.message);
      return null;
    }
  }

  return socket;
};

export const joinUserRoom = (userId) => {
  const s = getSocket();
  if (s && userId) s.emit('join', userId);
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
