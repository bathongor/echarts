import { useEffect, useRef, useState } from 'react';

interface StockData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  Name: string;
}

interface WebSocketMessage {
  type: 'initial' | 'update';
  data: StockData;
}

interface UseWebSocketReturn {
  stockData: StockData[];
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  error: string | null;
  reconnect: () => void;
}

const WEBSOCKET_URL = 'ws://localhost:8080';
const RECONNECT_INTERVAL = 3000; // 3 seconds
const MAX_DATA_POINTS = 100; // Keep last 100 data points for performance

export const useWebSocket = (): UseWebSocketReturn => {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [error, setError] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isUnmountedRef = useRef(false);

  const connect = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setConnectionStatus('connecting');
    setError(null);

    try {
      const ws = new WebSocket(WEBSOCKET_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        if (isUnmountedRef.current) return;
        console.log('WebSocket connected');
        setConnectionStatus('connected');
        setError(null);
      };

      ws.onmessage = (event) => {
        if (isUnmountedRef.current) return;
        
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
          setStockData(prevData => {
            const newData = [...prevData, message.data];
            // Keep only the last MAX_DATA_POINTS for performance
            return newData.slice(-MAX_DATA_POINTS);
          });
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
          setError('Error parsing server data');
        }
      };

      ws.onclose = (event) => {
        if (isUnmountedRef.current) return;
        
        console.log('WebSocket connection closed:', event.code, event.reason);
        setConnectionStatus('disconnected');
        
        if (!event.wasClean) {
          setError(`Connection closed unexpectedly: ${event.reason || 'Unknown reason'}`);
          
          // Auto-reconnect after delay if connection was not closed intentionally
          reconnectTimeoutRef.current = setTimeout(() => {
            if (!isUnmountedRef.current) {
              console.log('Attempting to reconnect...');
              connect();
            }
          }, RECONNECT_INTERVAL);
        }
      };

      ws.onerror = (event) => {
        if (isUnmountedRef.current) return;
        
        console.error('WebSocket error:', event);
        setConnectionStatus('error');
        setError('Failed to connect to WebSocket server');
      };

    } catch (err) {
      console.error('Error creating WebSocket connection:', err);
      setConnectionStatus('error');
      setError('Failed to create WebSocket connection');
    }
  };

  const reconnect = () => {
    // Clear any existing reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    // Close existing connection if any
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    // Clear existing data
    setStockData([]);
    
    // Reconnect
    connect();
  };

  useEffect(() => {
    connect();

    return () => {
      isUnmountedRef.current = true;
      
      // Clear reconnect timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      // Close WebSocket connection
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  return {
    stockData,
    connectionStatus,
    error,
    reconnect
  };
};
