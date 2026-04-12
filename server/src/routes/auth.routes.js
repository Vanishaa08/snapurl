const router   = require('express').Router();
const auth     = require('../controllers/auth.controller');
const validate = require('../middleware/validate.middleware');

router.post('/register', validate('register'), auth.register);
router.post('/login',    validate('login'),    auth.login);
router.post('/refresh',                        auth.refresh);

module.exports = router;