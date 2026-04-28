# Valkyrie Backend — Intelligence, Matching, Marketplace, Network

This document describes the new DB-driven Founder Intelligence features, sample data and example API requests.

Prerequisites
- MongoDB running and accessible
- Set environment variable `MONGO_URI` to your MongoDB connection string
- Start backend: `npm install` then `npm run dev` (or `node src/server.js`)

API Endpoints
- GET /api/intelligence/:userId  -> Returns intelligence profile for user
- GET /api/matches/:userId       -> Returns match candidates for user
- GET /api/marketplace/:userId   -> Returns marketplace opportunities relevant to user
- GET /api/network/:userId       -> Returns relationship graph centered on user

Sample MongoDB user documents
Insert these into the `users` collection to test the endpoints (use mongo shell or Compass):

{
  name: "Alice Founder",
  email: "alice@example.com",
  passwordHash: "changeme", // hashed automatically if saved through Mongoose model
  role: "founder",
  bio: "Built two startups. Passionate about AI and marketplaces.",
  skills: ["Product", "Machine Learning", "Go-to-Market"],
  interests: ["AI", "Marketplaces", "SaaS"],
  goals: ["raise_seed", "scale_users"]
}

{
  name: "Bob Investor",
  email: "bob@example.com",
  passwordHash: "changeme",
  role: "investor",
  skills: ["Finance", "Strategy"],
  interests: ["AI", "FinTech"],
  goals: ["deploy_capital"]
}

Example requests (curl)

# Get intelligence for a user
curl -s "http://localhost:5000/api/intelligence/<USER_ID>" | jq

# Get matches for a user
curl -s "http://localhost:5000/api/matches/<USER_ID>" | jq

# Get marketplace opportunities
curl -s "http://localhost:5000/api/marketplace/<USER_ID>" | jq

# Get network graph
curl -s "http://localhost:5000/api/network/<USER_ID>" | jq

Expected outputs (examples)
- Intelligence: JSON containing `score`, `traits`, `strengths`, `weaknesses`, and `recommendedRoles`. Values are deterministic based on stored user data.
- Matches: Array of candidate users with `matchScore` and `compatibility` breakdown.
- Marketplace: Array of `opportunities` with `relevance` scores based on user's skills and goals.
- Network: `nodes` and `edges` arrays describing nearby users by similarity.

Notes
- All outputs are computed from stored MongoDB user records. No dummy user data is returned.
- If a userId is not found, endpoints return a 404 and a meaningful message.
- Services are implemented under `src/services/` and routes under `src/modules/*/routes.js`.

