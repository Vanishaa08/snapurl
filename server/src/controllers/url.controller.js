const Url       = require('../models/Url');
const snowflake = require('../services/snowflake.service');
const cache     = require('../services/cache.service');

exports.shorten = async (req, res, next) => {
  try {
    const { originalUrl, customAlias, expiresAt } = req.body;
    const userId = req.user?.userId ?? null;  // null for anonymous

    if (!originalUrl)
      return res.status(400).json({ error: 'originalUrl is required' });

    // Custom alias — registered users only
    let shortCode = customAlias || snowflake.generateId();

    if (customAlias) {
      if (!userId)
        return res.status(401).json({ error: 'Login required for custom alias' });
      const taken = await Url.findOne({ shortCode: customAlias });
      if (taken)
        return res.status(409).json({ error: 'Alias already taken' });
    }

    const expiry = expiresAt ? new Date(expiresAt) : null;

    const url = await Url.create({
      shortCode, originalUrl, customAlias: customAlias || null,
      userId, expiresAt: expiry
    });

    // Warm cache immediately — first redirect will be a HIT
    const ttl = expiry
      ? Math.floor((expiry - Date.now()) / 1000)
      : 86400; // 24h default
    await cache.setUrl(shortCode, { originalUrl, expiresAt: expiry }, ttl);

    res.status(201).json({
      shortCode,
      shortUrl: `${process.env.BASE_URL}/${shortCode}`,
      originalUrl,
      expiresAt: expiry
    });
  } catch (err) { next(err); }
};

exports.redirect = async (req, res, next) => {
  try {
    const { shortCode } = req.params;

    // 1. Check Redis cache (hybrid approach)
    const cached = await cache.getUrl(shortCode);
    if (cached) {
      const isExpired = cached.expiresAt && new Date(cached.expiresAt) < new Date();
      if (isExpired) {
        await cache.deleteUrl(shortCode);
        return res.status(410).json({ error: 'URL has expired' });
      }
      // Fire analytics async, don't await
      fireAnalytics(shortCode, req);
      return res.redirect(302, cached.originalUrl);
    }

    // 2. Cache miss — query MongoDB
    const url = await Url.findOne({
      shortCode,
      isActive: true,
      $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }]
    });

    if (!url) return res.status(404).json({ error: 'URL not found' });

    // 3. Warm cache for next request
    const ttl = url.expiresAt
      ? Math.floor((url.expiresAt - Date.now()) / 1000)
      : 86400;
    await cache.setUrl(shortCode, {
      originalUrl: url.originalUrl,
      expiresAt: url.expiresAt
    }, ttl);

    fireAnalytics(shortCode, req);
    res.redirect(302, url.originalUrl);
  } catch (err) { next(err); }
};

exports.getUserUrls = async (req, res, next) => {
  try {
    const urls = await Url.find({ userId: req.user.userId, isActive: true })
                          .sort({ createdAt: -1 });
    res.json(urls);
  } catch (err) { next(err); }
};

exports.deleteUrl = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    await Url.findOneAndUpdate(
      { shortCode, userId: req.user.userId },
      { isActive: false }
    );
    await cache.deleteUrl(shortCode); // ← cache invalidation on update
    res.json({ message: 'URL deactivated' });
  } catch (err) { next(err); }
};

function fireAnalytics(shortCode, req) {
  cache.pushAnalyticsEvent({
    shortCode,
    ip:        req.ip,
    referrer:  req.headers.referer || 'Direct',
    userAgent: req.headers['user-agent'],
    timestamp: Date.now()
  }).catch(console.error); // never let analytics crash redirect
}