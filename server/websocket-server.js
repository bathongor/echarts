const WebSocket = require('ws');
const http = require('http');

// Create HTTP server
const server = http.createServer();

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Random stock data generator
class StockDataGenerator {
  constructor() {
    this.currentPrice = 180; // Starting price for Boeing
    this.lastData = {
      date: new Date().toISOString(),
      open: this.currentPrice,
      high: this.currentPrice,
      low: this.currentPrice,
      close: this.currentPrice,
      volume: Math.floor(Math.random() * 1000000) + 500000,
      Name: 'BA'
    };
  }

  generateNext() {
    const now = new Date();
    const priceChange = (Math.random() - 0.5) * 4; // Price can change by ±$2
    const volatility = Math.random() * 0.02; // 2% volatility
    
    // Update current price with some trend and random walk
    this.currentPrice += priceChange;
    this.currentPrice = Math.max(this.currentPrice, 50); // Min price
    this.currentPrice = Math.min(this.currentPrice, 300); // Max price
    
    const high = this.currentPrice * (1 + volatility * Math.random());
    const low = this.currentPrice * (1 - volatility * Math.random());
    const open = this.lastData.close;
    const close = this.currentPrice + (Math.random() - 0.5) * 2;
    
    this.lastData = {
      date: now.toISOString(),
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume: Math.floor(Math.random() * 1000000) + 500000,
      Name: 'BA'
    };

    return this.lastData;
  }
}

const stockGenerator = new StockDataGenerator();

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('New WebSocket connection established');
  
  // Send initial data
  ws.send(JSON.stringify({
    type: 'initial',
    data: stockGenerator.generateNext()
  }));
  
  // Send periodic updates every 2 seconds
  const interval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      const newData = stockGenerator.generateNext();
      ws.send(JSON.stringify({
        type: 'update',
        data: newData
      }));
    } else {
      clearInterval(interval);
    }
  }, 2000);
  
  ws.on('close', () => {
    console.log('WebSocket connection closed');
    clearInterval(interval);
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    clearInterval(interval);
  });
});

// Start the server
const PORT = process.env.WS_PORT || 8080;
server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});

// Handle server shutdown gracefully
process.on('SIGTERM', () => {
  console.log('Server shutting down...');
  server.close(() => {
    process.exit(0);
  });
});
