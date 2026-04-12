const router       = require('express').Router();
const url          = require('../controllers/url.controller');
const requireAuth  = require('../middleware/auth.middleware');
const optionalAuth = require('../middleware/optionalAuth.middleware');
const validate     = require('../middleware/validate.middleware');

router.post('/',             optionalAuth, validate('shorten'), url.shorten);
router.get('/my',            requireAuth,  url.getUserUrls);
router.delete('/:shortCode', requireAuth,  url.deleteUrl);
router.get('/:shortCode',    url.redirect);

module.exports = router;