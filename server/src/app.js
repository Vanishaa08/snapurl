const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');

const authRoutes      = require('./routes/auth.routes');
const urlRoutes       = require('./routes/url.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const errorMiddleware = require('./middleware/error.middleware');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(express.json());

app.use('/api/auth',      authRoutes);
app.use('/api/urls',      urlRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use(errorMiddleware);

module.exports = app;