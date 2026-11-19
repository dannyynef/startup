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
  if (await getUser('email', req.body.email)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await createUser(req.body.email, req.body.password);
    setAuthCookie(res, user);

    res.send(publicProfile(user));
  }
});

app.put('/api/auth', async (req, res) => {
  const user = await getUser('email', req.body.email);
  if (user && (await bcrypt.compare(req.body.password, user.password))) {
    setAuthCookie(res, user);

    res.send(publicProfile(user));
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

app.delete('/api/auth', async (req, res) => {
  const token = req.cookies['token'];
  const user = await getUser('token', token);
  if (user) {
    clearAuthCookie(res, user);
  }

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

const users = [];

async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    email: email,
    password: passwordHash,
    displayName: email.split('@')[0],
    joined: new Date().toISOString(),
    stats: { wins: 0, losses: 0, draws: 0, currentWinStreak: 0 },
  };

  users.push(user);

  return user;
}

async function getUser(field, value) {
  if (value) {
    return users.find((user) => user[field] === value);
  }
  return null;
}

function setAuthCookie(res, user) {
  user.token = uuid.v4();

  res.cookie('token', user.token, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

function clearAuthCookie(res, user) {
  delete user.token;
  res.clearCookie('token');
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
  app.listen(port, function () {
    console.log(`Listening on port ${port}`);
  });
}).catch(() => {
  // Keep database credentials and connection strings out of the logs.
  console.error('Unable to connect to MongoDB. Check dbConfig.json and Atlas network access.');
  process.exit(1);
});
