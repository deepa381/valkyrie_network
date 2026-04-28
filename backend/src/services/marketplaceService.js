// Minimal opportunity catalog — filtering logic depends on real user profile
const OPPORTUNITIES = [
  { id: 'op-grant-1', type: 'grant', title: 'Early-Stage Founder Grant', tags: ['seed', 'grant'], skills: ['fundraising', 'pitching'], goals: ['fundraise'] },
  { id: 'op-acc-1', type: 'accelerator', title: 'Global Accelerator Cohort', tags: ['accelerator'], skills: ['growth', 'product'], goals: ['scale'] },
  { id: 'op-invest-1', type: 'investment', title: 'AI & ML Investor Round', tags: ['investment', 'ai'], skills: ['machine learning', 'data science'], goals: ['raise_series_a'] },
];

function normalize(arr) {
  return Array.isArray(arr) ? arr.map((s) => String(s).toLowerCase().trim()) : [];
}

function scoreOpportunityForUser(user, opp) {
  const uSkills = new Set(normalize(user.skills));
  const uGoals = new Set(normalize(user.goals));
  const oppSkills = normalize(opp.skills || []);
  const oppGoals = normalize(opp.goals || []);

  const skillMatch = oppSkills.filter((s) => uSkills.has(s)).length;
  const goalMatch = oppGoals.filter((g) => uGoals.has(g)).length;
  // simple scoring
  return Math.min(100, Math.round(skillMatch * 60 + goalMatch * 40));
}

function findOpportunitiesForUser(user) {
  if (!user) throw new Error('User required');
  const scored = OPPORTUNITIES.map((opp) => ({ ...opp, relevance: scoreOpportunityForUser(user, opp) })).filter((o) => o.relevance > 0);
  scored.sort((a, b) => b.relevance - a.relevance);
  return scored;
}

module.exports = { findOpportunitiesForUser };
