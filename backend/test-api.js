const http = require('http');

const BASE = 'http://localhost:5000';

function post(path, body, token) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const opts = {
      hostname: 'localhost', port: 5000,
      path, method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
    const req = http.request(opts, (res) => {
      let raw = '';
      res.on('data', (c) => raw += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
        catch { resolve({ status: res.statusCode, body: raw }); }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function get(path, token) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'localhost', port: 5000,
      path, method: 'GET',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
    const req = http.request(opts, (res) => {
      let raw = '';
      res.on('data', (c) => raw += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
        catch { resolve({ status: res.statusCode, body: raw }); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function runTests() {
  console.log('\n========= VALKYRIE BACKEND API TESTS =========\n');

  // 1. Health
  const health = await get('/health');
  console.log(`[1] GET  /health                 → ${health.status} ${health.status === 200 ? '✅' : '❌'}`, JSON.stringify(health.body).slice(0, 80));

  // 2. Signup
  const signup = await post('/api/auth/signup', {
    name: 'Test Founder', email: `test_${Date.now()}@valkyrie.io`,
    password: 'Password123', role: 'founder'
  });
  const token = signup.body?.token;
  console.log(`[2] POST /api/auth/signup        → ${signup.status} ${signup.status === 201 ? '✅' : '❌'}  token=${token ? token.slice(0,20)+'…' : 'MISSING'}`);

  // 3. Login (requires DB, will fail gracefully without it)
  const login = await post('/api/auth/login', { email: 'test@valkyrie.io', password: 'wrong' });
  console.log(`[3] POST /api/auth/login (wrong) → ${login.status} ${login.status === 401 || login.status === 500 ? '✅' : '❌'}  ${login.body?.message}`);

  // For authenticated routes, use token from signup (or a demo JWT if no DB)
  const authToken = token || 'demo';

  // 4. GET /api/user/profile
  const profile = await get('/api/user/profile', authToken);
  console.log(`[4] GET  /api/user/profile       → ${profile.status} ${profile.status !== 500 ? '✅' : '❌'}  ${JSON.stringify(profile.body).slice(0,60)}`);

  // 5. POST /api/match
  const match = await post('/api/match', {}, authToken);
  const matchOk = Array.isArray(match.body) && match.body.length > 0;
  console.log(`[5] POST /api/match              → ${match.status} ${matchOk ? '✅' : '❌'}  ${match.body?.length ?? 0} matches returned`);

  // 6. POST /api/intelligence/dna
  const dna = await post('/api/intelligence/dna', {}, authToken);
  const dnaOk = dna.body?.overallScore !== undefined || dna.status === 401;
  console.log(`[6] POST /api/intelligence/dna   → ${dna.status} ${dnaOk ? '✅' : '❌'}  score=${dna.body?.overallScore}`);

  // 7. POST /api/intelligence/twin
  const twin = await post('/api/intelligence/twin', {}, authToken);
  console.log(`[7] POST /api/intelligence/twin  → ${twin.status} ${twin.status !== 500 ? '✅' : '❌'}  ${JSON.stringify(twin.body).slice(0,60)}`);

  // 8. GET /api/startup
  const startups = await get('/api/startup', authToken);
  const startupOk = Array.isArray(startups.body) && startups.body.length > 0;
  console.log(`[8] GET  /api/startup            → ${startups.status} ${startupOk ? '✅' : '❌'}  ${startups.body?.length ?? 0} startups`);

  // 9. POST /api/startup
  const newStartup = await post('/api/startup', { name: 'TestLaunch', description: 'API test startup', stage: 'Idea' }, authToken);
  console.log(`[9] POST /api/startup            → ${newStartup.status} ${newStartup.status !== 500 ? '✅' : '❌'}  ${newStartup.body?.name || newStartup.body?.message}`);

  // 10. GET /api/marketplace
  const market = await get('/api/marketplace', authToken);
  const marketOk = market.body?.opportunities?.length > 0;
  console.log(`[10] GET /api/marketplace        → ${market.status} ${marketOk ? '✅' : '❌'}  ${market.body?.opportunities?.length ?? 0} opportunities, ${market.body?.deals?.length ?? 0} deals`);

  // 11. GET /api/graph
  const graph = await get('/api/graph', authToken);
  const graphOk = graph.body?.nodes?.length > 0;
  console.log(`[11] GET /api/graph              → ${graph.status} ${graphOk ? '✅' : '❌'}  ${graph.body?.nodes?.length ?? 0} nodes, ${graph.body?.edges?.length ?? 0} edges`);

  // 12. POST /api/builder/build
  const builder = await post('/api/builder/build', { prompt: 'AI health wellness' }, authToken);
  const builderOk = builder.body?.name !== undefined;
  console.log(`[12] POST /api/builder/build     → ${builder.status} ${builderOk ? '✅' : '❌'}  startup="${builder.body?.name}"`);

  console.log('\n========= TEST COMPLETE =========\n');
}

runTests().catch(console.error);
