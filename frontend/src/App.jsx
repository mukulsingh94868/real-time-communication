// /src/App.jsx

import React, { useEffect, useState } from 'react';
import ConnectionStatus from './components/ConnectionStatus';

const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);

  // Heartbeat interval
  const HEARTBEAT_INTERVAL = 30000;

  const handleReconnect = () => {
    if (navigator.onLine && !socket) {
      const ws = new WebSocket('ws://localhost:8080');

      ws.onopen = () => {
        setIsConnected(true);
        console.log('WebSocket connected');
      };

      ws.onmessage = (message) => {
        console.log('Received:', message.data);
      };

      ws.onclose = () => {
        setIsConnected(false);
        console.log('WebSocket disconnected');
        setTimeout(handleReconnect, 5000);
      };

      const heartbeat = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'ping' }));
        }
      }, HEARTBEAT_INTERVAL);

      setSocket(ws);

      return () => {
        clearInterval(heartbeat);
        ws.close();
      };
    }
  };

  useEffect(() => {
    handleReconnect();

    window.addEventListener('online', handleReconnect);
    window.addEventListener('offline', () => setIsConnected(false));

    return () => {
      window.removeEventListener('online', handleReconnect);
      window.removeEventListener('offline', () => setIsConnected(false));
      if (socket) socket.close();
    };
  }, [socket]);

  return (
    <div>
      <h1>Real-time Connectivity System</h1>
      <ConnectionStatus />
      {isConnected ? (
        <p>Connected to the server</p>
      ) : (
        <p>Attempting to connect...</p>
      )}
    </div>
  );
};

export default App;
