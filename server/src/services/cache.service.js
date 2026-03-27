const { getRedis } = require('../config/redis');

async function getUrl(shortCode) {
  const redis = getRedis();
  const raw   = await redis.get(`url:${shortCode}`);
  return raw ? JSON.parse(raw) : null;
}

async function setUrl(shortCode, data, ttlSeconds) {
  const redis = getRedis();
  const args  = [`url:${shortCode}`, JSON.stringify(data)];
  if (ttlSeconds > 0) args.push('EX', ttlSeconds);
  await redis.set(...args);
}

async function deleteUrl(shortCode) {
  const redis = getRedis();
  await redis.del(`url:${shortCode}`);
}

async function pushAnalyticsEvent(event) {
  const redis = getRedis();
  await redis.rpush('analytics:queue', JSON.stringify(event));
}

module.exports = { getUrl, setUrl, deleteUrl, pushAnalyticsEvent };