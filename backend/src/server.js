require('dotenv').config();
console.log('✅ Environment variables loaded');

const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { connectDB } = require('./config/db');

const app = express();
const server = http.createServer(app);

// Allow any localhost port in dev; use env var in production
const corsOrigin = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL
  : (origin, callback) => {
      // Allow all localhost origins (any port) in development
      if (!origin || /^http:\/\/localhost(:\d+)?$/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed for: ' + origin));
      }
    };

const io = new Server(server, {
  cors: { origin: corsOrigin, methods: ['GET', 'POST'], credentials: true },
});

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make io accessible in route handlers
app.locals.io = io;

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api', require('./routes'));

// ─── Health check ────────────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// ─── Socket.IO ───────────────────────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log('🔌 Socket connected:', socket.id);
  socket.on('join', (userId) => socket.join(`user:${userId}`));
  socket.on('disconnect', () => console.log('🔌 Socket disconnected:', socket.id));
});

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Valkyrie Backend running on port ${PORT}`);
  });
});