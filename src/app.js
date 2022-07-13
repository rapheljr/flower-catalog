const { injectCookies, injectSession } = require('./cookie.js');
const { createRouter } = require('server');

const { serveFileContents, bodyParser, guestBookHandler, noOp, log, loginHandler, dataHandler,
  apiHandler, notFoundHandler, logoutHandler } = require('./handlers.js');

const getHandlers = (logger = log) => {
  const handlers = [bodyParser, injectCookies, injectSession, guestBookHandler, logger, loginHandler, logoutHandler, dataHandler, serveFileContents(), apiHandler, notFoundHandler];
  return handlers;
};

const app = createRouter(getHandlers(noOp));

module.exports = { app };
