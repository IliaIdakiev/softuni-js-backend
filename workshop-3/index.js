global.__basedir = __dirname;

const app = require('express')();
const config = require('./config/config');

require('./config/express')(app);
require('./config/routes')(app);

const dbConnectionPromise = require('./config/database')();

dbConnectionPromise.then(() => {
  app.listen(config.port, console.log(`Listening on port ${config.port}! Now its up to you...`));
});
