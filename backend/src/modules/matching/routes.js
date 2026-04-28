const router = require('express').Router();
const User = require('../../models/User');
const { findMatchesForUser } = require('../../services/matchService');

// GET /api/match/:userId - returns match candidates from DB
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const matches = await findMatchesForUser(userId);
    if (!matches || matches.length === 0) return res.status(200).json({ matches: [], message: 'No matches found for this user' });
    return res.json({ matches });
  } catch (err) {
    console.error('[Matching/Get]', err);
    return res.status(500).json({ message: 'Failed to compute matches' });
  }
});

module.exports = router;
