const router     = require('express').Router();
const analytics  = require('../controllers/analytics.controller');
const requireAuth = require('../middleware/auth.middleware');

router.get('/:shortCode', requireAuth, analytics.getUrlAnalytics);

module.exports = router;