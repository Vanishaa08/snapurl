const router       = require('express').Router();
const url          = require('../controllers/url.controller');
const requireAuth  = require('../middleware/auth.middleware');
const optionalAuth = require('../middleware/optionalAuth.middleware');

router.post('/',             optionalAuth, url.shorten);
router.get('/my',            requireAuth,  url.getUserUrls);
router.delete('/:shortCode', requireAuth,  url.deleteUrl);
router.get('/:shortCode',    url.redirect);

module.exports = router;