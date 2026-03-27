const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  shortCode: { type: String, required: true, index: true },
  ip:        String,
  country:   { type: String, default: 'Unknown' },
  city:      { type: String, default: 'Unknown' },
  referrer:  { type: String, default: 'Direct' },
  device:    { type: String, default: 'Unknown' },
  userAgent: String,
}, { timestamps: true });

// Compound index for time-range analytics queries
analyticsSchema.index({ shortCode: 1, createdAt: -1 });

module.exports = mongoose.model('Analytics', analyticsSchema);