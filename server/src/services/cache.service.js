const { getRedis } = require('../config/redis');

const withTimeout = (promise, ms = 3000) =>
  Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error('Redis timeout')), ms))]);

async function getUrl(shortCode) {
  try {
    const redis = getRedis();
    const raw = await withTimeout(redis.get(`url:${shortCode}`));
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error('Cache getUrl error:', err.message);
    return null;
  }
}

async function setUrl(shortCode, data, ttlSeconds) {
  try {
    const redis = getRedis();
    const args = [`url:${shortCode}`, JSON.stringify(data)];
    if (ttlSeconds > 0) args.push('EX', ttlSeconds);
    await withTimeout(redis.set(...args));
  } catch (err) {
    console.error('Cache setUrl error:', err.message);
  }
}

async function deleteUrl(shortCode) {
  try {
    const redis = getRedis();
    await withTimeout(redis.del(`url:${shortCode}`));
  } catch (err) {
    console.error('Cache deleteUrl error:', err.message);
  }
}

async function pushAnalyticsEvent(event) {
  try {
    const redis = getRedis();
    await withTimeout(redis.rpush('analytics:queue', JSON.stringify(event)));
  } catch (err) {
    console.error('Cache pushAnalytics error:', err.message);
  }
}

module.exports = { getUrl, setUrl, deleteUrl, pushAnalyticsEvent };