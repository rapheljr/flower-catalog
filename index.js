const { startServer, createRouter } = require('server');
const { serveFileContents, guestBookHandler, apiHandler, notFoundHandler } =
  require('./src/handlers.js');
const handlers = [guestBookHandler, serveFileContents,
  apiHandler, notFoundHandler];

startServer(8000, createRouter(...handlers));
