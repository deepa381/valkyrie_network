const router = require('express').Router();
const User = require('../../models/User');
const { findOpportunitiesForUser } = require('../../services/marketplaceService');

// GET /api/marketplace/:userId - returns opportunities relevant to a user profile
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const opportunities = await findOpportunitiesForUser(user);
    if (!opportunities || opportunities.length === 0) return res.status(200).json({ opportunities: [], message: 'No relevant opportunities found for this profile' });
    return res.json({ opportunities });
  } catch (err) {
    console.error('[Marketplace/Get]', err);
    return res.status(500).json({ message: 'Failed to fetch marketplace opportunities' });
  }
});

module.exports = router;
