const router = require('express').Router();
const User = require('../../models/User');
const { buildNetworkForUser } = require('../../services/graphService');

// GET /api/graph/:userId - build network graph centered on user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const graph = await buildNetworkForUser(userId);
    return res.json(graph);
  } catch (err) {
    console.error('[Graph/Get]', err);
    return res.status(500).json({ message: 'Failed to build network graph' });
  }
});

module.exports = router;
