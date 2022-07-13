const { startServer } = require('server');
const { app } = require('./src/app.js');

startServer(8000, app());
