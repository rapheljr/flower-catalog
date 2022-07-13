const { injectCookies, injectSession } = require('./cookie.js');
const { createRouter } = require('server');

const { serveFileContents, bodyParser, guestBookHandler, log, loginHandler, dataHandler, apiHandler, notFoundHandler, logoutHandler } = require('./handlers.js');

const sessions = {};

const getHandlers = (logger = log) => {
  const handlers = [bodyParser, injectCookies, injectSession(sessions), guestBookHandler, logger(sessions), loginHandler(sessions), logoutHandler(sessions), dataHandler, serveFileContents('./public'), apiHandler, notFoundHandler];
  return handlers;
};

const app = createRouter(getHandlers());

module.exports = { app };
