module.exports = {
    development: {
        port: process.env.PORT || 3000,
        dbConnectionString: 'mongodb://localhost:27017/test'
    },
    production: {}
};