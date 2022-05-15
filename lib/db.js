const MongoClient = require('mongodb').MongoClient;
const DATABASE_NAME = 'datn'
const DATABASE_URL = `mongodb://localhost:27017/`

const loadDB = async () => {
  try {
    let connection = await MongoClient.connect(DATABASE_URL);
    let db = connection.db(DATABASE_NAME)
    return {connection, db};
  } catch (err) {
    console.log(err)
  }
};

module.exports = loadDB;
