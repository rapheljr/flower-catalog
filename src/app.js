const { createRouter } = require('server');
const fs = require('fs');

const { injectCookies, injectSession } = require('./cookie.js');
const { serveFileContents, bodyParser, guestBookHandler, log, loginHandler, commentHandler, apiHandler, injectComments, notFoundHandler, logoutHandler } = require('./handlers.js');

const comments = injectComments('./data/comments.json', fs.readFileSync, fs.writeFileSync);

const app = (logger = log, sessions = {}, path = './public') => {
  const handlers = [bodyParser, injectCookies, injectSession(sessions), comments, guestBookHandler, logger(sessions), loginHandler(sessions), logoutHandler(sessions), commentHandler, serveFileContents(path), apiHandler, notFoundHandler];
  return createRouter(handlers);
};

module.exports = { app };
