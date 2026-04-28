const router = require('express').Router();
const { requireAuth } = require('../../middleware/auth');

let User = null;
try { User = require('../../models/User'); } catch (_) {}

// ─── GET /api/user/profile ───────────────────────────────────────────────────
router.get('/profile', requireAuth, async (req, res) => {
  try {
    if (User) {
      try {
        const user = await User.findById(req.user._id).select('-passwordHash');
        if (user) return res.json(user.toPublicJSON());
      } catch (_) {}
    }
    // Fallback: return token payload as profile
    const u = req.user;
    return res.json({
      id: u._id || u.id || 'unknown',
      name: u.name || 'Founder',
      email: u.email || '',
      role: u.role || 'founder',
      bio: u.bio || '',
      location: u.location || '',
      avatar: u.avatar || null,
      skills: u.skills || [],
      interests: u.interests || [],
      goals: u.goals || [],
      experience: u.experience || [],
      achievements: u.achievements || [],
    });
  } catch (err) {
    console.error('[User/Profile GET]', err);
    return res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

// ─── PUT /api/user/profile ───────────────────────────────────────────────────
router.put('/profile', requireAuth, async (req, res) => {
  try {
    const allowed = ['name', 'bio', 'location', 'avatar', 'skills', 'interests', 'goals', 'experience', 'achievements', 'role'];
    const updates = {};
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    if (User) {
      try {
        const user = await User.findByIdAndUpdate(
          req.user._id,
          { $set: updates },
          { new: true, runValidators: true }
        ).select('-passwordHash');
        if (user) return res.json(user.toPublicJSON());
      } catch (_) {}
    }

    // Fallback: merge and return
    return res.json({ ...req.user, ...updates, id: req.user._id || req.user.id });
  } catch (err) {
    console.error('[User/Profile PUT]', err);
    return res.status(500).json({ message: 'Failed to update profile' });
  }
});

// ─── GET /api/user/all ───────────────────────────────────────────────────────
router.get('/all', requireAuth, async (req, res) => {
  try {
    if (User) {
      try {
        const users = await User.find({ _id: { $ne: req.user._id } }).select('-passwordHash').limit(50);
        if (users.length > 0) return res.json(users.map((u) => u.toPublicJSON()));
      } catch (_) {}
    }
    return res.json([]);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch users' });
  }
});

module.exports = router;
