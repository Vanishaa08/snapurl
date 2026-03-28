require('dotenv').config();
const http       = require('http');
const { Server } = require('socket.io');

const app             = require('./app');
const connectDB       = require('./config/db');
const { connectRedis } = require('./config/redis');
const analyticsWorker = require('./workers/analytics.worker');

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();
  await connectRedis();

  const server = http.createServer(app);

  const io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL || 'http://localhost:3000' }
  });

  app.set('io', io);

  analyticsWorker.start(io);

  server.listen(PORT, () => {
    console.log(`SnapURL server running on port ${PORT}`);
  });
}

start().catch(console.error);