const { startServer, createRouter } = require('server');
const { injectCookies, injectSession } = require('./src/cookie.js');
const { serveFileContents, bodyParser, guestBookHandler, log, loginHandler, handleSession, dataHandler,
  apiHandler, notFoundHandler, logoutHandler } = require('./src/handlers.js');
const handlers = [bodyParser, injectCookies, injectSession, log, guestBookHandler, loginHandler, logoutHandler, dataHandler, serveFileContents, apiHandler, notFoundHandler];

startServer(8000, createRouter(...handlers));
