const { startServer } = require('./src/server.js');

startServer(8000, './public/');
console.log(process.argv[2]);
