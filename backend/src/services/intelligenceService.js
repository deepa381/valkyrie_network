const crypto = require('crypto');

const seedFrom = (user) => {
  const base = `${user._id || ''}:${user.email || ''}:${(user.skills || []).join(',')}`;
  const hash = crypto.createHash('md5').update(base).digest('hex');
  // Convert first 8 chars to integer
  return parseInt(hash.slice(0, 8), 16) || 0;
};

const clamp = (v, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(v)));

function generateDNA(user) {
  const seed = seedFrom(user);
  const skills = Array.isArray(user.skills) ? user.skills : [];
  const goals = Array.isArray(user.goals) ? user.goals : [];
  const interests = Array.isArray(user.interests) ? user.interests : [];

  const traits = [
    { name: 'Vision', score: clamp(50 + (seed % 30) + skills.length * 2) },
    { name: 'Execution', score: clamp(48 + ((seed >> 3) % 35) + goals.length * 3) },
    { name: 'Resilience', score: clamp(52 + ((seed >> 5) % 28)) },
    { name: 'Communication', score: clamp(45 + ((seed >> 7) % 40) + (user.bio && user.bio.length > 50 ? 8 : 0)) },
    { name: 'Leadership', score: clamp(50 + ((seed >> 11) % 32)) },
    { name: 'Adaptability', score: clamp(54 + ((seed >> 13) % 26) + interests.length * 2) },
  ];

  const overallScore = clamp(traits.reduce((s, t) => s + t.score, 0) / traits.length);

  const strengthCandidates = [
    'Inspires teams with clear vision',
    'Turns ambiguity into data-driven plans',
    'Builds resilient teams under pressure',
    'Communicates priorities clearly to stakeholders',
    'Consistently ships and iterates quickly',
  ];
  const weaknessCandidates = [
    'May under-delegate during high workload',
    'Tends to over-focus on product at expense of GTM',
    'Can be reluctant to cut features early',
  ];

  const pick = (arr, i) => arr[i % arr.length];

  const strengths = [pick(strengthCandidates, seed % 10), pick(strengthCandidates, (seed >> 4) % 10)].filter(Boolean);
  const blindSpots = [pick(weaknessCandidates, (seed >> 2) % 10)].filter(Boolean);

  const recommendedRoles = [];
  if (overallScore > 70 && traits.find((t) => t.name === 'Vision').score > 60) recommendedRoles.push('CEO / Visionary');
  if (traits.find((t) => t.name === 'Execution').score > 60) recommendedRoles.push('COO / Operations');
  if (traits.find((t) => t.name === 'Communication').score > 60) recommendedRoles.push('Head of Talent / Community');
  if (recommendedRoles.length === 0) recommendedRoles.push('Founding Team — multiple roles');

  const personalityType = pick(['Visionary Builder', 'Methodical Architect', 'Agile Strategist', 'Resilient Operator'], seed % 4);
  const leadershipStyle = pick(['Transformational', 'Servant Leadership', 'Democratic', 'Pacesetting'], (seed >> 2) % 4);
  const stressBehavior = pick([
    'Tends to over-analyze and delay decisions under pressure.',
    'May become overly focused on minute details, losing sight of the big picture.',
    'Might push the team too hard during crunch periods.',
    'Can become defensive when faced with critical feedback during high-stress moments.'
  ], (seed >> 5) % 4);

  const idealCofounder = {
    traits: [pick(['Detail-oriented', 'Analytical', 'Empathetic'], seed % 3), pick(['Disciplined', 'Creative', 'Patient'], (seed >> 3) % 3)],
    skills: [pick(['Operations', 'Sales', 'Finance'], (seed >> 1) % 3), pick(['Product', 'Engineering', 'Marketing'], (seed >> 4) % 3)],
    personality: pick(['Methodical Executor', 'Creative Disruptor', 'Steady Reliable'], (seed >> 6) % 3)
  };

  return {
    overallScore,
    traits,
    strengths,
    blindSpots,
    personalityType,
    leadershipStyle,
    stressBehavior,
    idealCofounder,
    recommendedRoles,
    seed: seed % 100,
  };
}

function generateTwin(user) {
  const dna = generateDNA(user);
  return {
    id: `twin-${user._id}`,
    name: `${user.name}'s Digital Twin`,
    version: '1.0.2',
    lastSync: new Date().toISOString(),
    capabilities: [
      'Strategic Planning',
      'Team Alignment',
      'Execution Monitoring'
    ],
    dnaScore: dna.overallScore,
    status: 'online'
  };
}

module.exports = { generateDNA, generateTwin };
