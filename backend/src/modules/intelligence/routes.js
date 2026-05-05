const router = require('express').Router();
const User = require('../../models/User');
const { generateDNA, generateTwin } = require('../../services/intelligenceService');

// GET /api/intelligence/:userId - return intelligence for a specific user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    const dna = generateDNA(user);
    return res.json({ user: user.toPublicJSON ? user.toPublicJSON() : user, intelligence: dna });
  } catch (err) {
    console.error('[Intelligence/Get]', err);
    return res.status(500).json({ message: 'Failed to compute intelligence' });
  }
});

// GET /api/intelligence/:userId/twin - return digital twin for a specific user
router.get('/:userId/twin', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    const twin = generateTwin(user);
    return res.json(twin);
  } catch (err) {
    console.error('[Intelligence/Twin/Get]', err);
    return res.status(500).json({ message: 'Failed to fetch digital twin' });
  }
});

module.exports = router;
