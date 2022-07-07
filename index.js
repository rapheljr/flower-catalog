const { startServer, createRouter } = require('server');
const { serveFileContents, guestBookHandler, log, loginHandler,
  apiHandler, notFoundHandler, injectCookies } = require('./src/handlers.js');
const handlers = [log, injectCookies, guestBookHandler, loginHandler, serveFileContents,
  apiHandler, notFoundHandler];

startServer(8000, createRouter(...handlers));
