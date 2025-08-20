# WebSocket Real-time Stock Data Setup

This application now supports real-time stock data updates via WebSocket connection.

## Features Added

1. **WebSocket Server**: A standalone WebSocket server that generates random Boeing (BA) stock data
2. **Real-time Updates**: Charts update automatically every 2 seconds with new data
3. **Connection Status**: Visual indicators show the WebSocket connection status
4. **Auto-reconnection**: Automatic reconnection when connection is lost
5. **Performance Optimized**: Keeps only the last 100 data points for smooth performance

## How to Run

### Option 1: Run both servers simultaneously (Recommended)
```bash
npm run dev
```
This starts both the Next.js app (port 3000) and the WebSocket server (port 8080) concurrently.

### Option 2: Run servers separately
Terminal 1 - WebSocket Server:
```bash
npm run ws:dev
```

Terminal 2 - Next.js App:
```bash
npm run dev:next
```

## How it Works

1. **WebSocket Server** (`server/websocket-server.js`):
   - Runs on port 8080
   - Generates random Boeing stock data every 2 seconds
   - Simulates realistic price movements with volatility

2. **Dashboard Component** (`src/app/dashboard/page.tsx`):
   - Connects to WebSocket server automatically
   - Displays real-time data with live updates
   - Shows connection status with colored indicators

3. **WebSocket Hook** (`src/hooks/useWebSocket.ts`):
   - Manages WebSocket connection lifecycle
   - Handles reconnection automatically
   - Maintains data state and connection status

## Connection Status Indicators

- 🟢 **Connected**: Receiving real-time data
- 🟡 **Connecting**: Attempting to connect
- 🔴 **Error**: Connection failed
- ⚫ **Disconnected**: Not connected

## Data Generation

The WebSocket server generates realistic stock data:
- Price movements: ±$2 per update
- Volatility: Up to 2% price swings
- Volume: Random between 500K-1.5M shares
- Updates: Every 2 seconds
- Price bounds: $50-$300 (realistic for Boeing stock)

## Notes

- The app keeps only the last 100 data points for performance
- Real-time aggregation works for daily view (live updates)
- Weekly/Monthly aggregation uses the accumulated real-time data
- WebSocket automatically reconnects if connection is lost
