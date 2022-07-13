const { createRouter } = require('server');

const { injectCookies, injectSession } = require('./cookie.js');
const { serveFileContents, bodyParser, guestBookHandler, log, loginHandler, commentHandler, apiHandler, notFoundHandler, logoutHandler } = require('./handlers.js');

const app = (path = './public', sessions = {}, logger = log) => {
  const handlers = [bodyParser, injectCookies, injectSession(sessions), guestBookHandler, logger(sessions), loginHandler(sessions), logoutHandler(sessions), commentHandler, serveFileContents(path), apiHandler, notFoundHandler];
  return createRouter(handlers);
};

module.exports = { app };
