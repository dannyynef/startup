const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');

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

const port = process.argv.length > 2 ? process.argv[2] : 4000;
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
