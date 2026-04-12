const { getRedis } = require('../config/redis');
const Analytics    = require('../models/Analytics');
const geoip        = require('geoip-lite');
const UAParser     = require('ua-parser-js');

exports.start = function(io) {
  console.log('Analytics worker started');
  processQueue(io);
};

async function processQueue(io) {
  const redis = getRedis();
  while (true) {
    try {
      const result = await redis.blpop('analytics:queue', 0);
      const event  = JSON.parse(result[1]);
      const geo    = geoip.lookup(event.ip) || {};
      const ua     = UAParser(event.userAgent);

      await Analytics.create({
        shortCode: event.shortCode,
        ip:        event.ip,
        country:   geo.country  || 'Unknown',
        city:      geo.city     || 'Unknown',
        referrer:  event.referrer,
        device:    ua.device.type || 'desktop',
        userAgent: event.userAgent,
      });

      io.emit(`analytics:${event.shortCode}`, {
        shortCode: event.shortCode,
        country:   geo.country || 'Unknown',
        device:    ua.device.type || 'desktop',
        referrer:  event.referrer,
        timestamp: new Date()
      });

    } catch (err) {
      console.error('Worker error:', err.message);
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}