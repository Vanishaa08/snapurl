const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');

const authRoutes      = require('./routes/auth.routes');
const urlRoutes       = require('./routes/url.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const urlController   = require('./controllers/url.controller');
const errorMiddleware = require('./middleware/error.middleware');

const app = express();

app.use(morgan('dev'));

// ✅ FIXED helmet config
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://snapurl-jet.vercel.app'
  ],
  credentials: true
}));

app.use(express.json());

app.use('/api/auth',      authRoutes);
app.use('/api/urls',      urlRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

// ✅ redirect route
app.get('/:shortCode', urlController.redirect);

app.use(errorMiddleware);

module.exports = app;