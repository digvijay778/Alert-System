// frontend/src/contexts/SocketContext.jsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext'; // To connect only when logged in

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Only establish a connection if the user is authenticated
    if (isAuthenticated) {
      const newSocket = io(import.meta.env.VITE_API_BASE_URL, {
        // You can add authentication details here if needed
        // auth: { token: localStorage.getItem('authToken') }
        reconnectionAttempts: 5,
      });

      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('Socket connected:', newSocket.id);
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      // Cleanup function to disconnect the socket when the provider unmounts
      // or when the user logs out.
      return () => {
        newSocket.disconnect();
      };
    } else if (socket) {
      // If the user logs out, disconnect the existing socket
      socket.disconnect();
      setSocket(null);
    }
  }, [isAuthenticated]); // This effect depends on the user's auth status

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
