const nano = require('nano');
require('dotenv').config();

const couch = nano(process.env.COUCHDB_URL);

// Use or create a database
const dbName = 'codash'; 
const db = couch.db.use(dbName);


async function initDB() {
  try {
    const dbList = await couch.db.list();
    if (!dbList.includes(dbName)) {
      await couch.db.create(dbName);
      console.log(`Database '${dbName}' created.`);
    } else {
      console.log(`Database '${dbName}' already exists.`);
    }
  } catch (err) {
    console.error('CouchDB init error:', err.message);
  }
}

module.exports = { db, initDB };
