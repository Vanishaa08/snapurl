const router    = require('express').Router();
const url       = require('../controllers/url.controller');
const requireAuth = require('../middleware/auth.middleware');

router.post('/',              url.shorten);           // anonymous or auth
router.get('/my',  requireAuth, url.getUserUrls);     // auth only
router.delete('/:shortCode', requireAuth, url.deleteUrl);
router.get('/:shortCode',    url.redirect);           // public

module.exports = router;