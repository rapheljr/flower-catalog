const { startServer, createRouter } = require('server');
const { serveFileContents, commentsHandler, apiHandler, notFoundHandler } =
  require('./src/handlers.js');
const handlers = [commentsHandler, serveFileContents,
  apiHandler, notFoundHandler];

startServer(8000, createRouter(...handlers));
