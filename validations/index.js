global.__basedir = __dirname;

const app = require('express')();
const config = require('./config/config');
const globalErrorHandler = require('./global-error-handler');

require('./config/express')(app);
require('./config/routes')(app);

const dbConnectionPromise = require('./config/database')();

dbConnectionPromise.then(() => {
  app.use(globalErrorHandler); // this should always be in the bottom :)
  app.listen(config.port, console.log(`Listening on port ${config.port}! Now its up to you...`));
});
