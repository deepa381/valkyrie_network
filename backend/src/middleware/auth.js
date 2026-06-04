const jwt = require('jsonwebtoken');

let User = null;
try { User = require('../models/User'); } catch (_) {}

// Access in-memory store from auth routes if DB is down
let getInMemoryUser = null;
try {
  const authRoutes = require('../modules/auth/routes');
  getInMemoryUser = (userId) => authRoutes.inMemoryUsers?.get(userId);
} catch (_) {}

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

    // CRITICAL FIX: Support both DB-backed and in-memory users
    // First try database
    if (User) {
      try {
        const user = await User.findById(decoded.userId).select('-passwordHash');
        if (user) {
          req.user = user;
          return next();
        }
      } catch (_) {}
    }

    // Fall back to in-memory user (for testing or when DB is down)
    if (getInMemoryUser && decoded.userId.startsWith('mem_')) {
      const memUser = getInMemoryUser(decoded.userId);
      if (memUser) {
        req.user = { ...memUser, _id: memUser.id };
        return next();
      }
    }

    // User not found in either store
    return res.status(401).json({ message: 'User not found' });
  } catch (err) {
    console.error('[Auth Middleware]', err);
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = { requireAuth };
