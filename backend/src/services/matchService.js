const User = require('../models/User');

function normalize(arr) {
  return Array.isArray(arr) ? arr.map((s) => String(s).toLowerCase().trim()) : [];
}

function scoreBetween(a, b) {
  // a and b are user objects
  const aSkills = new Set(normalize(a.skills));
  const bSkills = normalize(b.skills);
  const sharedSkills = bSkills.filter((s) => aSkills.has(s)).length;
  const skillScore = aSkills.size ? (sharedSkills / aSkills.size) * 50 : 0;

  const aInterests = new Set(normalize(a.interests));
  const bInterests = normalize(b.interests);
  const sharedInterests = bInterests.filter((i) => aInterests.has(i)).length;
  const interestScore = aInterests.size ? (sharedInterests / aInterests.size) * 30 : 0;

  const aGoals = new Set(normalize(a.goals));
  const bGoals = normalize(b.goals);
  // Complementary goals: goals b has that a does not (encourages complementary teaming)
  const complementary = bGoals.filter((g) => !aGoals.has(g)).length;
  const complementScore = Math.min(20, complementary * 5);

  const total = Math.min(100, Math.round(skillScore + interestScore + complementScore));
  return { total, breakdown: { skills: Math.round(skillScore), interests: Math.round(interestScore), complement: complementScore } };
}

async function findMatchesForUser(userId, limit = 20) {
  const user = await User.findById(userId).select('-passwordHash');
  if (!user) throw new Error('User not found');

  const candidates = await User.find({ _id: { $ne: user._id } }).select('-passwordHash').limit(200);
  if (!candidates || candidates.length === 0) return [];

  const scored = candidates.map((c) => {
    const s = scoreBetween(user, c);
    return {
      id: c._id.toString(),
      name: c.name,
      role: c.role,
      avatar: c.avatar || null,
      matchScore: s.total,
      skills: c.skills || [],
      interests: c.interests || [],
      goals: c.goals || [],
      compatibility: s.breakdown,
      bio: c.bio || '',
    };
  });

  scored.sort((a, b) => b.matchScore - a.matchScore);
  return scored.slice(0, limit);
}

module.exports = { findMatchesForUser, scoreBetween };
