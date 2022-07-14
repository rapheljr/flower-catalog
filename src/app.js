const fs = require('fs');
const express = require('express');

const { injectCookies, injectSession } = require('./cookie.js');
const { serveFileContents, bodyParser, guestBookHandler, log, loginHandler, commentHandler, apiHandler, injectComments, logoutHandler } = require('./handlers.js');

const comments = injectComments('./data/comments.json', fs.readFileSync, fs.writeFileSync);

const createApp = (logger = log, sessions = {}, path = './public') => {
  const app = express();
  app.use(bodyParser);
  app.use(injectCookies);
  app.use(injectSession(sessions));
  app.use(comments);
  app.get('/guest-book.html', guestBookHandler);
  app.use(logger(sessions));
  app.post('/login', loginHandler(sessions));
  app.get('/logout', logoutHandler(sessions));
  app.post('/comment', commentHandler);
  app.get('/', serveFileContents(path));
  app.get('/api', apiHandler);
  app.use(express.static(path));

  return app;
};

module.exports = { createApp };
