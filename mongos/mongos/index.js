const mongodb = require('mongodb');
const modelFactory = require('./model');
const Schema = require('./schema');

const clientDatabaseMap = new Map();

module.exports = {
  connect(connectionString, options) {
    const connectionStringArray = connectionString.split('/');
    const databaseName = connectionStringArray[connectionStringArray.length - 1];
    const client = new mongodb.MongoClient(connectionString, options);
    return client.connect().then(client => {
      clientDatabaseMap.set(client, client.db(databaseName));
      return client;
    });
  },
  Schema,
  model(name, schema, client) {

    // This code needs to be in a function so it can get called whenever we are doing CRUD ops
    // from our model in order to get the proper collection (lazy evaluation). It has to be 
    // done like so in order to allow for models to be set before we are connected to the database
    // (the connect method is still not called here). The reason is that models (inside the main 
    // app file - index.js) are required before the connect is called :)

    function getCollection() {
      const db = client ? clientDatabaseMap.get(client) : clientDatabaseMap.values().next().value;
      if (!db) { throw new Error('No connection to database!'); }
      return db.collection(name);
    }

    return modelFactory(getCollection, schema);
  }
}