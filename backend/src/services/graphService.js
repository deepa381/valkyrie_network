const User = require('../models/User');
const { scoreBetween } = require('./matchService');

async function buildNetworkForUser(userId, maxNodes = 50) {
  const user = await User.findById(userId).select('-passwordHash');
  if (!user) throw new Error('User not found');

  const users = await User.find({ _id: { $ne: user._id } }).select('name role avatar skills interests goals').limit(200);

  // Score similarity to generate edges
  const scored = users.map((u) => ({ user: u, score: scoreBetween(user, u).total }));
  scored.sort((a, b) => b.score - a.score);

  const top = scored.slice(0, Math.min(scored.length, maxNodes - 1));

  const nodes = [
    { id: user._id.toString(), label: user.name, type: user.role, group: user.role, avatar: user.avatar || null },
    ...top.map((t) => ({ id: t.user._id.toString(), label: t.user.name, type: t.user.role, group: t.user.role, avatar: t.user.avatar || null })),
  ];

  const edges = top.map((t) => ({ id: `e-${user._id.toString()}-${t.user._id.toString()}`, source: user._id.toString(), target: t.user._id.toString(), weight: t.score }));

  return { nodes, edges };
}

module.exports = { buildNetworkForUser };
