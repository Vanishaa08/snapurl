const jwt  = require('jsonwebtoken');
const User = require('../models/User');

function signAccess(userId) {
  return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRY });
}

function signRefresh(userId) {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRY });
}

exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password required' });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ error: 'Email already registered' });

    const user = await User.create({ email, passwordHash: password });

    const accessToken  = signAccess(user._id);
    const refreshToken = signRefresh(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({ accessToken, refreshToken });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await user.comparePassword(password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const accessToken  = signAccess(user._id);
    const refreshToken = signRefresh(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({ accessToken, refreshToken });
  } catch (err) { next(err); }
};

exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ error: 'Refresh token required' });

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user    = await User.findById(payload.userId);

    if (!user || user.refreshToken !== refreshToken)
      return res.status(401).json({ error: 'Invalid refresh token' });

    const newAccess  = signAccess(user._id);
    const newRefresh = signRefresh(user._id);

    user.refreshToken = newRefresh;
    await user.save();

    res.json({ accessToken: newAccess, refreshToken: newRefresh });
  } catch (err) { next(err); }
};