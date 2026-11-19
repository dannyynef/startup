const express = require('express');
const path = require('node:path');
const app = express();
const cookieParser = require('cookie-parser');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const DB = require('./database');

app.use(express.json());
app.use(cookieParser());

app.post('/api/auth', async (req, res) => {
  const { email, password } = req.body || {};
  if (typeof email !== 'string' || !email.trim() || typeof password !== 'string' || !password) {
    return res.status(400).send({ msg: 'Email and password are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  try {
    if (await DB.getUser(normalizedEmail)) {
      return res.status(409).send({ msg: 'Existing user' });
    }

    const user = await createUser(normalizedEmail, password);
    await setAuthCookie(res, user);

    res.send(publicProfile(user));
  } catch (error) {
    // The unique email index also handles simultaneous registration attempts.
    if (error.code === 11000) {
      return res.status(409).send({ msg: 'Existing user' });
    }
    res.status(500).send({ msg: 'Unable to create account.' });
  }
});

app.put('/api/auth', async (req, res) => {
  const { email, password } = req.body || {};
  if (typeof email !== 'string' || !email.trim() || typeof password !== 'string' || !password) {
    return res.status(400).send({ msg: 'Email and password are required.' });
  }

  const user = await getUser('email', email.trim().toLowerCase());
  if (user && (await bcrypt.compare(password, user.password))) {
    await setAuthCookie(res, user);

    res.send(publicProfile(user));
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

app.delete('/api/auth', async (req, res) => {
  const token = req.cookies['token'];
  if (typeof token === 'string' && token) {
    await DB.removeUserToken(token);
  }
  res.clearCookie('token');

  res.send({});
});

app.get('/api/user/me', async (req, res) => {
  const token = req.cookies['token'];
  const user = await getUser('token', token);
  if (user) {
    res.send(publicProfile(user));
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

// Authenticate profile changes using the cookie, never a client-supplied email.
app.put('/api/user/me', async (req, res) => {
  const user = await getUser('token', req.cookies.token);
  if (!user) {
    return res.status(401).send({ msg: 'Unauthorized' });
  }

  const displayName = req.body?.displayName;
  if (typeof displayName !== 'string' || !displayName.trim() || displayName.trim().length > 40) {
    return res.status(400).send({ msg: 'Username must contain 1 to 40 characters.' });
  }

  user.displayName = displayName.trim();
  res.send(publicProfile(user));
});

// Statistics belong to the authenticated user, not an email supplied by the client.
async function requireAuth(req, res, next) {
  const user = await getUser('token', req.cookies.token);
  if (!user) return res.status(401).send({ msg: 'Unauthorized' });
  req.user = user;
  next();
}

app.get('/api/stats', requireAuth, (req, res) => {
  res.send(req.user.stats);
});

app.post('/api/results', requireAuth, (req, res) => {
  const result = req.body?.result;
  if (!['win', 'loss', 'draw'].includes(result)) {
    return res.status(400).send({ msg: 'Result must be win, loss, or draw.' });
  }

  const stats = req.user.stats;
  if (result === 'win') {
    stats.wins++;
    stats.currentWinStreak++;
  } else {
    if (result === 'loss') stats.losses++;
    if (result === 'draw') stats.draws++;
    stats.currentWinStreak = 0;
  }
  res.send(stats);
});

// Explicitly omit password hashes and authentication tokens from responses.
function publicProfile(user) {
  return { email: user.email, displayName: user.displayName, joined: user.joined };
}

async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    email: email,
    password: passwordHash,
    displayName: email.split('@')[0],
    joined: new Date().toISOString(),
    stats: { wins: 0, losses: 0, draws: 0, currentWinStreak: 0 },
  };

  await DB.addUser(user);

  return user;
}

async function getUser(field, value) {
  if (typeof value !== 'string' || !value) return null;
  return field === 'token' ? DB.getUserByToken(value) : DB.getUser(value);
}

async function setAuthCookie(res, user) {
  const token = uuid.v4();
  await DB.setUserToken(user.email, token);

  res.cookie('token', token, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

// Keep unknown API requests from falling through to the React application.
app.use('/api', (req, res) => {
  res.status(404).send({ msg: 'API endpoint not found' });
});

const publicDirectory = path.join(__dirname, 'public');
app.use(express.static(publicDirectory));

// React Router chooses the view when a frontend URL is opened directly.
app.get(/.*/, (req, res, next) => {
  res.sendFile(path.join(publicDirectory, 'index.html'), (error) => {
    if (error) next(error);
  });
});

const port = process.argv.length > 2 ? process.argv[2] : 4000;
DB.connect().then(() => {
  const server = app.listen(port, function () {
    console.log(`Listening on port ${server.address().port}`);
  });
}).catch(() => {
  // Keep database credentials and connection strings out of the logs.
  console.error('Unable to connect to MongoDB. Check dbConfig.json and Atlas network access.');
  process.exit(1);
});
