const router = require('express').Router();
const User = require('../../models/User');
const { generateDNA } = require('../../services/intelligenceService');

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

module.exports = router;
