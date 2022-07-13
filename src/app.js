const { injectCookies, injectSession } = require('./cookie.js');
const { createRouter } = require('server');

const { serveFileContents, bodyParser, guestBookHandler, log, loginHandler, handleSession, dataHandler,
  apiHandler, notFoundHandler, logoutHandler } = require('./handlers.js');

const handlers = [bodyParser, injectCookies, injectSession, guestBookHandler, loginHandler, logoutHandler, dataHandler, serveFileContents, apiHandler, notFoundHandler];

const app = createRouter(handlers);

module.exports = { app };
