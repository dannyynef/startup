const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const userName = encodeURIComponent(config.userName);
const password = encodeURIComponent(config.password);
const url = `mongodb+srv://${userName}:${password}@${config.hostname}`;
const client = new MongoClient(url, { serverSelectionTimeoutMS: 10000 });
const db = client.db('connect4');

async function connect() {
  try {
    await client.connect();
    await db.command({ ping: 1 });
    console.log('Connected to the connect4 database');
  } catch (error) {
    await client.close();
    throw error;
  }
}

module.exports = { connect, db };
