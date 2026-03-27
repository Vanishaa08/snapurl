const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  shortCode:   { type: String, required: true, unique: true },
  originalUrl: { type: String, required: true },
  customAlias: { type: String, default: null },
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  expiresAt:   { type: Date, default: null },
  isActive:    { type: Boolean, default: true },
}, { timestamps: true });

// The index that makes redirects fast
urlSchema.index({ shortCode: 1 });

// TTL index — MongoDB auto-deletes expired docs
// (soft approach: we use isActive instead, so skip hard TTL)
urlSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Url', urlSchema);