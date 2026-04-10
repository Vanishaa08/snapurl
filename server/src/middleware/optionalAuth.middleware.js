const jwt = require('jsonwebtoken');

module.exports = function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return next();
  try {
    const token = header.split(' ')[1];
    req.user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch {
    // invalid token — treat as anonymous
  }
  next();
};