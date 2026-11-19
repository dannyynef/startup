const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const { test } = require('node:test');
const { MongoClient } = require('mongodb');
const config = require('../dbConfig.json');
const bcrypt = require('bcryptjs');

// Uses the configured Atlas database and deletes only the account created here.
test('accounts, sessions, profiles, and statistics survive a backend restart', { timeout: 60000 }, async (t) => {
  const url = `mongodb+srv://${encodeURIComponent(config.userName)}:${encodeURIComponent(config.password)}@${config.hostname}`;
  const client = new MongoClient(url, { serverSelectionTimeoutMS: 10000 });
  const users = client.db('connect4').collection('user');
  const email = `database-test-${randomUUID()}@example.com`;
  const password = randomUUID();
  let child;
  let port;

  async function stopBackend() {
    if (child && child.exitCode === null && child.signalCode === null) {
      const exited = once(child, 'exit');
      child.kill('SIGTERM');
      await exited;
    }
  }

  t.after(async () => {
    try {
      await stopBackend();
      await users.deleteOne({ email });
    } finally {
      await client.close();
    }
  });

  await client.connect();
  async function startBackend() {
    child = spawn(process.execPath, [path.join(__dirname, '../index.js'), '0'], {
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    port = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Backend startup timed out')), 20000);
      let output = '';
      child.stdout.on('data', (chunk) => {
        output += chunk.toString();
        const match = output.match(/Listening on port (\d+)/);
        if (match) {
          clearTimeout(timer);
          resolve(Number(match[1]));
        }
      });
      child.once('error', () => {
        clearTimeout(timer);
        reject(new Error('Unable to start test backend'));
      });
      child.once('exit', () => {
        clearTimeout(timer);
        reject(new Error('Test backend exited before listening'));
      });
    });
  }
  await startBackend();

  async function request(method, endpoint, token, body) {
    return fetch(`http://127.0.0.1:${port}${endpoint}`, {
      method,
      headers: {
        ...(token ? { Cookie: `token=${token}` } : {}),
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal: AbortSignal.timeout(10000),
    });
  }

  function readToken(response) {
    const cookie = response.headers.get('set-cookie');
    assert.ok(cookie?.includes('HttpOnly'));
    assert.ok(cookie.includes('Secure'));
    const match = cookie.match(/token=([^;]+)/);
    assert.ok(match, 'Authentication must set a token cookie');
    return match[1];
  }

  const registration = await request('POST', '/api/auth', null, { email, password });
  assert.equal(registration.status, 200);
  const oldToken = readToken(registration);
  const registered = await users.findOne({ email });
  assert.notEqual(registered.password, password);
  assert.equal(await bcrypt.compare(password, registered.password), true);
  assert.equal((await registration.json()).password, undefined);
  assert.equal((await request('POST', '/api/auth', null, { email: email.toUpperCase(), password })).status, 409);
  assert.equal((await request('POST', '/api/auth', null, { email: { $ne: null }, password })).status, 400);
  assert.equal((await users.findOne({ email })).token, oldToken);
  assert.equal((await request('GET', '/api/stats', oldToken)).status, 200);

  assert.equal((await request('PUT', '/api/user/me', null, { displayName: 'Unauthorized edit' })).status, 401);
  for (const displayName of ['', '   ', 'x'.repeat(41), { $ne: null }]) {
    assert.equal((await request('PUT', '/api/user/me', oldToken, { displayName })).status, 400);
  }
  const original = await users.findOne({ email });
  const profileUpdate = await request('PUT', '/api/user/me', oldToken, {
    displayName: '  Updated player  ', email: 'someone-else@example.com',
  });
  assert.equal(profileUpdate.status, 200);
  const profile = await profileUpdate.json();
  assert.equal(profile.displayName, 'Updated player');
  assert.equal(profile.email, email);
  assert.equal(profile.password, undefined);
  assert.equal(profile.token, undefined);
  const saved = await users.findOne({ email });
  assert.equal(saved.displayName, 'Updated player');
  assert.equal(saved.password, original.password);
  assert.equal(saved.token, oldToken);
  assert.deepEqual(saved.stats, original.stats);
  assert.equal((await (await request('GET', '/api/user/me', oldToken)).json()).displayName, 'Updated player');

  assert.equal((await request('POST', '/api/results', null, { result: 'win' })).status, 401);
  assert.equal((await request('POST', '/api/results', oldToken, { result: 'invalid' })).status, 400);
  assert.deepEqual((await users.findOne({ email })).stats, original.stats);
  const outcomes = [
    ['win', { wins: 1, losses: 0, draws: 0, currentWinStreak: 1 }],
    ['win', { wins: 2, losses: 0, draws: 0, currentWinStreak: 2 }],
    ['loss', { wins: 2, losses: 1, draws: 0, currentWinStreak: 0 }],
    ['win', { wins: 3, losses: 1, draws: 0, currentWinStreak: 1 }],
    ['draw', { wins: 3, losses: 1, draws: 1, currentWinStreak: 0 }],
  ];
  for (const [result, expected] of outcomes) {
    const response = await request('POST', '/api/results', oldToken, { result, email: 'someone-else@example.com' });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), expected);
    assert.deepEqual((await users.findOne({ email })).stats, expected);
  }
  // Simultaneous updates must not overwrite one another's counters or streaks.
  const concurrent = await Promise.all(Array.from({ length: 10 }, () => request('POST', '/api/results', oldToken, { result: 'win' })));
  assert.ok(concurrent.every(response => response.status === 200));
  const expectedStats = { wins: 13, losses: 1, draws: 1, currentWinStreak: 10 };
  assert.deepEqual((await users.findOne({ email })).stats, expectedStats);
  assert.deepEqual(await (await request('GET', '/api/stats', oldToken)).json(), expectedStats);

  // A new process has no in-memory accounts or sessions from the first one.
  await stopBackend();
  await startBackend();
  const restoredProfile = await request('GET', '/api/user/me', oldToken);
  assert.equal(restoredProfile.status, 200);
  assert.equal((await restoredProfile.json()).displayName, 'Updated player');
  assert.deepEqual(await (await request('GET', '/api/stats', oldToken)).json(), expectedStats);
  assert.equal((await request('PUT', '/api/auth', null, { email, password: 'wrong-password' })).status, 401);
  assert.equal((await request('PUT', '/api/auth', null, { email: `missing-${email}`, password })).status, 401);
  assert.equal((await request('GET', '/api/stats', 'invalid-token')).status, 401);
  assert.equal((await users.findOne({ email })).token, oldToken);

  const logout = await request('DELETE', '/api/auth', oldToken);
  assert.equal(logout.status, 200);
  assert.match(logout.headers.get('set-cookie'), /token=;/);
  assert.equal(Object.hasOwn(await users.findOne({ email }), 'token'), false);
  assert.equal((await request('GET', '/api/user/me', oldToken)).status, 401);
  assert.equal((await request('GET', '/api/stats', oldToken)).status, 401);
  assert.equal((await request('DELETE', '/api/auth', oldToken)).status, 200);
  assert.equal((await request('DELETE', '/api/auth')).status, 200);

  const login = await request('PUT', '/api/auth', null, { email: ` ${email.toUpperCase()} `, password });
  assert.equal(login.status, 200);
  assert.equal((await login.json()).displayName, 'Updated player');
  const newToken = readToken(login);
  assert.notEqual(newToken, oldToken);
  assert.equal((await users.findOne({ email })).token, newToken);
  assert.equal((await request('GET', '/api/user/me', newToken)).status, 200);
  assert.equal((await request('GET', '/api/stats', newToken)).status, 200);
  assert.deepEqual(await (await request('GET', '/api/stats', newToken)).json(), expectedStats);
  assert.equal((await request('GET', '/api/stats', oldToken)).status, 401);
});
