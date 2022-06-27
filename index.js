const { startServer } = require('./src/server.js');

startServer(8000, process.argv[2]);
console.log(process.argv[2]);
