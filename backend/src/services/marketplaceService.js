const Opportunity = require('../models/Opportunity');

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

async function findOpportunitiesForUser(user) {
  if (!user) throw new Error('User required');
  
  const opportunities = await Opportunity.find({});
  
  // If no opportunities in DB, we could seed them or return empty
  if (!opportunities || opportunities.length === 0) return [];

  const scored = opportunities.map((opp) => ({ 
    ...opp.toObject(), 
    id: opp._id.toString(),
    relevance: scoreOpportunityForUser(user, opp) 
  })).filter((o) => o.relevance > 0);

  scored.sort((a, b) => b.relevance - a.relevance);
  return scored;
}

module.exports = { findOpportunitiesForUser };
