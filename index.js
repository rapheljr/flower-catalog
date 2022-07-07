const { startServer, createRouter } = require('server');
const { serveFileContents, bodyParser, injectSession, guestBookHandler, log, loginHandler, handleSession,
  apiHandler, notFoundHandler, logoutHandler, injectCookies } = require('./src/handlers.js');
const handlers = [bodyParser, injectCookies, injectSession, log, guestBookHandler, loginHandler, logoutHandler, serveFileContents, apiHandler, notFoundHandler];

startServer(8000, createRouter(...handlers));
