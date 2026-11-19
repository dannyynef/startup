const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const userName = encodeURIComponent(config.userName);
const password = encodeURIComponent(config.password);
const url = `mongodb+srv://${userName}:${password}@${config.hostname}`;
const client = new MongoClient(url, { serverSelectionTimeoutMS: 10000 });
const db = client.db('connect4');
const userCollection = db.collection('user');

async function connect() {
  try {
    await client.connect();
    await db.command({ ping: 1 });
    await userCollection.createIndex({ email: 1 }, { unique: true });
    console.log('Connected to the connect4 database');
  } catch (error) {
    await client.close();
    throw error;
  }
}

function getUser(email) {
  return userCollection.findOne({ email });
}

async function addUser(user) {
  await userCollection.insertOne(user);
}

function getUserByToken(token) {
  return userCollection.findOne({ token });
}

async function setUserToken(email, token) {
  await userCollection.updateOne({ email }, { $set: { token } });
}

async function removeUserToken(token) {
  await userCollection.updateOne({ token }, { $unset: { token: 1 } });
}

async function updateDisplayName(email, displayName) {
  await userCollection.updateOne({ email }, { $set: { displayName } });
}

async function recordResult(email, result) {
  const update = result === 'win'
    ? { $inc: { 'stats.wins': 1, 'stats.currentWinStreak': 1 } }
    : {
        $inc: { [result === 'loss' ? 'stats.losses' : 'stats.draws']: 1 },
        $set: { 'stats.currentWinStreak': 0 },
      };
  const user = await userCollection.findOneAndUpdate({ email }, update, { returnDocument: 'after' });
  return user?.stats;
}

module.exports = { connect, db, getUser, addUser, getUserByToken, setUserToken, removeUserToken, updateDisplayName, recordResult };
