const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');

const authRoutes      = require('./routes/auth.routes');
const urlRoutes       = require('./routes/url.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const urlController   = require('./controllers/url.controller');
const errorMiddleware = require('./middleware/error.middleware');

const app = express();

app.use(helmet());
app.use(cors({ 
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'],
  credentials: true
}));
app.use(express.json());

app.use('/api/auth',      authRoutes);
app.use('/api/urls',      urlRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));
app.get('/:shortCode', urlController.redirect);

app.use(errorMiddleware);

module.exports = app;