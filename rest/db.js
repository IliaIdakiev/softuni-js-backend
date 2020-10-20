const mongoose = require('mongoose');

module.exports.connect = (connectionString, databaseName) => mongoose.connect(
  `${connectionString}/${databaseName}`,
  { useNewUrlParser: true, useUnifiedTopology: true }
);