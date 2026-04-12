const Analytics = require('../models/Analytics');

exports.getUrlAnalytics = async (req, res, next) => {
  try {
    const { shortCode } = req.params;

    // Total clicks
    const totalClicks = await Analytics.countDocuments({ shortCode });

    // Clicks by day (last 7 days)
    const clicksByDay = await Analytics.aggregate([
      { $match: { shortCode } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } },
      { $limit: 7 }
    ]);

    // Top countries
    const byCountry = await Analytics.aggregate([
      { $match: { shortCode } },
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Device breakdown
    const byDevice = await Analytics.aggregate([
      { $match: { shortCode } },
      { $group: { _id: '$device', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Referrer breakdown
    const byReferrer = await Analytics.aggregate([
      { $match: { shortCode } },
      { $group: { _id: '$referrer', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({ totalClicks, clicksByDay, byCountry, byDevice, byReferrer });
  } catch (err) { next(err); }
};