const { startServer } = require('server');
const { app } = require('./src/app');

startServer(8000, app);
