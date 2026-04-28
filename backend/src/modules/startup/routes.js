const router = require('express').Router();
const { requireAuth } = require('../../middleware/auth');

let Startup = null;
try { Startup = require('../../models/Startup'); } catch (_) {}

const FALLBACK_STARTUPS = [
  {
    id: 's1', name: 'EcoLaunch', description: 'Sustainable packaging solutions for e-commerce brands worldwide.',
    stage: 'MVP', industry: 'CleanTech', progress: 45,
    techStack: ['React', 'Node.js', 'MongoDB'],
    milestones: [{ id: 'm1', title: 'Product Design', completed: true }, { id: 'm2', title: 'Beta Launch', completed: false }, { id: 'm3', title: 'First 100 Customers', completed: false }],
    team: [{ id: 't1', name: 'Jane Doe', role: 'CEO', avatar: null }, { id: 't2', name: 'Sara Kim', role: 'CTO', avatar: null }],
    fundingGoal: 500000, fundingRaised: 125000, tags: ['sustainable', 'b2b', 'ecommerce'], createdAt: new Date().toISOString(),
  },
  {
    id: 's2', name: 'MindBridge AI', description: 'AI-powered mental wellness platform for modern enterprises.',
    stage: 'Seed', industry: 'HealthTech', progress: 70,
    techStack: ['Python', 'TensorFlow', 'React', 'PostgreSQL'],
    milestones: [{ id: 'm1', title: 'MVP Launch', completed: true }, { id: 'm2', title: 'Enterprise Pilot', completed: true }, { id: 'm3', title: 'Series A Prep', completed: false }],
    team: [{ id: 't1', name: 'Priya S.', role: 'CEO', avatar: null }, { id: 't2', name: 'Raj M.', role: 'CTO', avatar: null }],
    fundingGoal: 2000000, fundingRaised: 650000, tags: ['mental-health', 'enterprise', 'ai'], createdAt: new Date().toISOString(),
  },
  {
    id: 's3', name: 'DataPulse', description: 'Real-time analytics dashboard for SME decision-makers.',
    stage: 'Idea', industry: 'SaaS', progress: 20,
    techStack: ['Next.js', 'FastAPI', 'Redis'],
    milestones: [{ id: 'm1', title: 'Market Research', completed: true }, { id: 'm2', title: 'Prototype', completed: false }],
    team: [{ id: 't1', name: 'Liu Wei', role: 'Founder', avatar: null }],
    fundingGoal: 250000, fundingRaised: 0, tags: ['analytics', 'saas', 'smb'], createdAt: new Date().toISOString(),
  },
];

// ─── GET /api/startup ─────────────────────────────────────────────────────────
router.get('/', requireAuth, async (req, res) => {
  try {
    if (Startup) {
      try {
        const startups = await Startup.find().populate('founder', 'name avatar role').sort({ createdAt: -1 });
        if (startups.length > 0) return res.json(startups.map((s) => s.toPublicJSON()));
      } catch (_) {}
    }
    return res.json(FALLBACK_STARTUPS);
  } catch (err) {
    console.error('[Startup GET]', err);
    return res.json(FALLBACK_STARTUPS);
  }
});

// ─── POST /api/startup ────────────────────────────────────────────────────────
router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, description, stage, industry, techStack, milestones, team } = req.body;
    if (!name) return res.status(400).json({ message: 'Startup name is required' });

    const startupData = {
      id: `s_${Date.now()}`,
      name: name.trim(),
      description: description || '',
      stage: stage || 'Idea',
      industry: industry || 'Technology',
      techStack: techStack || [],
      milestones: milestones || [{ id: 'm1', title: 'Define MVP', completed: false }],
      team: team || [],
      progress: 0,
      fundingGoal: 0,
      fundingRaised: 0,
      tags: [],
      createdAt: new Date().toISOString(),
    };

    if (Startup) {
      try {
        const startup = new Startup({
          ...startupData,
          founder: req.user._id,
        });
        await startup.save();
        if (req.app.locals.io) {
          req.app.locals.io.emit('startup:created', { name: startup.name, founder: req.user.name });
        }
        return res.status(201).json(startup.toPublicJSON());
      } catch (_) {}
    }

    // In-memory fallback
    if (req.app.locals.io) {
      req.app.locals.io.emit('startup:created', { name: startupData.name, founder: req.user.name || 'Founder' });
    }
    return res.status(201).json(startupData);
  } catch (err) {
    console.error('[Startup POST]', err);
    return res.status(500).json({ message: 'Failed to create startup' });
  }
});

// ─── GET /api/startup/:id ─────────────────────────────────────────────────────
router.get('/:id', requireAuth, async (req, res) => {
  try {
    if (Startup) {
      try {
        const startup = await Startup.findById(req.params.id).populate('founder', 'name avatar role');
        if (startup) return res.json(startup.toPublicJSON());
      } catch (_) {}
    }
    const fallback = FALLBACK_STARTUPS.find((s) => s.id === req.params.id);
    if (fallback) return res.json(fallback);
    return res.status(404).json({ message: 'Startup not found' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch startup' });
  }
});

module.exports = router;
