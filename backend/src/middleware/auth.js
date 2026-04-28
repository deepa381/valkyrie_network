const jwt = require('jsonwebtoken');

let User = null;
try { User = require('../models/User'); } catch (_) {}

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (_) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Require database-backed user for all authenticated routes
    if (!User) return res.status(500).json({ message: 'User model not available on server' });
    const user = await User.findById(decoded.userId).select('-passwordHash');
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = { requireAuth };
