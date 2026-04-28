const router = require('express').Router();
const { requireAuth } = require('../../middleware/auth');

const INDUSTRIES = ['FinTech', 'HealthTech', 'EdTech', 'CleanTech', 'SaaS', 'E-commerce', 'AI/ML', 'Cybersecurity'];
const STAGES = ['Idea', 'MVP', 'Seed', 'Series A'];
const STACKS = [
  ['React', 'Node.js', 'MongoDB'],
  ['Next.js', 'FastAPI', 'PostgreSQL'],
  ['React Native', 'Firebase', 'Python'],
  ['Vue.js', 'Django', 'Redis'],
];

// Deterministic idea builder
const buildStartup = (prompt = '') => {
  const hash = [...prompt].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const industry = INDUSTRIES[hash % INDUSTRIES.length];
  const stage = STAGES[hash % STAGES.length];
  const stack = STACKS[hash % STACKS.length];

  const pick = (arr, offset = 0) => arr[(hash + offset) % arr.length];

  const problems = [
    `Small businesses in the ${industry} sector spend 40% more time on manual processes than necessary.`,
    `Current ${industry} solutions lack personalization and real-time insights for end users.`,
    `Access to ${industry} tools remains a privilege of large corporations, leaving SMEs underserved.`,
  ];
  const solutions = [
    `An AI-powered platform that automates ${industry} workflows and provides actionable insights.`,
    `A mobile-first ${industry} app with real-time analytics and personalized recommendations.`,
    `A no-code ${industry} toolkit enabling any business to compete at enterprise level.`,
  ];
  const revenues = [
    'SaaS subscription ($49/mo–$499/mo), enterprise licensing, and API access.',
    'Freemium with premium tiers, marketplace commissions, and white-label licensing.',
    'Usage-based pricing plus annual enterprise contracts.',
  ];

  return {
    name: `${prompt.split(' ').slice(0, 2).join('')}Tech`.replace(/\W/g, '').slice(0, 12) || `${industry}Hub`,
    tagline: `The ${industry} platform built for the next generation of founders.`,
    problem: pick(problems),
    solution: pick(solutions, 1),
    industry,
    stage,
    revenueModel: pick(revenues, 2),
    techStack: stack,
    estimatedMarket: `$${(hash % 50 + 5)}B`,
    targetCustomers: ['SMEs', 'Startups', 'Enterprise teams'],
    competitiveEdge: `AI-first approach, founder-centric design, and community-driven growth flywheel.`,
    milestones: [
      { title: 'Define core MVP features', completed: false },
      { title: 'Build and launch beta', completed: false },
      { title: 'Acquire first 100 users', completed: false },
      { title: 'Reach $10K MRR', completed: false },
    ],
  };
};

// ─── POST /api/builder/build ──────────────────────────────────────────────────
router.post('/build', requireAuth, (req, res) => {
  try {
    const { prompt, keywords } = req.body;
    const input = prompt || (Array.isArray(keywords) ? keywords.join(' ') : '') || req.user.name || 'startup';
    const idea = buildStartup(input);
    return res.json(idea);
  } catch (err) {
    console.error('[Builder]', err);
    return res.status(500).json({ message: 'Failed to build startup idea' });
  }
});

module.exports = router;
