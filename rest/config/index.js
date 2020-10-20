const environment = process.env.NODE_ENV || 'dev';
let config = require('./dev.config.json');
if (environment !== 'dev') {
  config = require(`${environment}.config.json`);
}

module.exports = config;