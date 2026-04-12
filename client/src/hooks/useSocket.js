import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export function useSocket(shortCode, onUpdate) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!shortCode) return;

    socketRef.current = io('http://localhost:5000');

    socketRef.current.on(`analytics:${shortCode}`, (data) => {
      onUpdate(data);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [shortCode]);
}