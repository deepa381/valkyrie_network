const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// In-memory store when DB is unavailable
const inMemoryUsers = new Map();

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// Try to load User model; fall back gracefully if DB is down
let User = null;
try {
  User = require('../../models/User');
} catch (_) {}

// ─── POST /api/auth/signup ───────────────────────────────────────────────────
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // ── DB path ──
    if (User) {
      try {
        const existing = await User.findOne({ email: normalizedEmail });
        if (existing) {
          return res.status(409).json({ message: 'Email already in use' });
        }
        const user = new User({
          name: name.trim(),
          email: normalizedEmail,
          passwordHash: password,
          role: role || 'founder',
        });
        await user.save();
        const token = signToken(user._id);
        return res.status(201).json({ token, user: user.toPublicJSON() });
      } catch (dbErr) {
        // DB down — fall through to in-memory
      }
    }

    // ── In-memory fallback ──
    if (inMemoryUsers.has(normalizedEmail)) {
      return res.status(409).json({ message: 'Email already in use' });
    }
    const id = `mem_${Date.now()}`;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = { id, _id: id, name: name.trim(), email: normalizedEmail, passwordHash, role: role || 'founder', skills: [], interests: [], goals: [], bio: '', location: '', avatar: null, createdAt: new Date() };
    inMemoryUsers.set(normalizedEmail, user);
    const token = signToken(id);
    const { passwordHash: _ph, ...publicUser } = user;
    return res.status(201).json({ token, user: publicUser });
  } catch (err) {
    console.error('[Auth/Signup]', err);
    return res.status(500).json({ message: 'Server error during signup' });
  }
});

// ─── POST /api/auth/login ────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const normalizedEmail = email.toLowerCase().trim();

    // ── DB path ──
    if (User) {
      try {
        const user = await User.findOne({ email: normalizedEmail });
        if (user) {
          const isMatch = await user.comparePassword(password);
          if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });
          const token = signToken(user._id);
          return res.status(200).json({ token, user: user.toPublicJSON() });
        }
      } catch (dbErr) {
        // DB down — fall through to in-memory
      }
    }

    // ── In-memory fallback ──
    const memUser = inMemoryUsers.get(normalizedEmail);
    if (!memUser) return res.status(401).json({ message: 'Invalid email or password' });
    const isMatch = await bcrypt.compare(password, memUser.passwordHash);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });
    const token = signToken(memUser.id);
    const { passwordHash: _ph, ...publicUser } = memUser;
    return res.status(200).json({ token, user: publicUser });
  } catch (err) {
    console.error('[Auth/Login]', err);
    return res.status(500).json({ message: 'Server error during login' });
  }
});

// Export in-memory store so other modules can access it when DB is down
router.inMemoryUsers = inMemoryUsers;

module.exports = router;
