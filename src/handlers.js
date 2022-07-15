const fs = require('fs');
const { GuestBook } = require('./comments.js');
const { createSession, setCookie } = require('./cookie.js');

const injectComments = (file, read, write) =>
  (req, res, next) => {
    req.comments = new GuestBook(file, read, write);
    return next();
  };

const bodyParser = (req, res, next) => {
  let data = '';
  req.setEncoding('utf-8');
  req.on('data', (chunk) => data += chunk);
  req.on('end', () => {
    req.bodyParams = new URLSearchParams(data);
    return next();
  });
};

const loginHandler = (sessions) =>
  (req, res, next) => {
    const { id } = createSession(req, sessions);
    setCookie(res, id);
    redirect(res, '/guest-book.html');
    return next();
  };

const logoutHandler = (sessions) =>
  (req, res, next) => {
    delete sessions[req.cookies.id];
    res.setHeader('set-cookie', 'id=0;max-age=0');
    redirect(res, '/');
    return next();
  };

const filterComments = (req, user, comment) => {
  const filtered = req.comments.getComments().filter(({ name, text }) => {
    return name.includes(user) || text.includes(comment);
  }
  );
  return JSON.stringify(filtered);
};

const redirect = (res, page) => {
  res.redirect(page);
  res.end();
};

const getParams = (params) => {
  const name = params.get('name');
  const comment = params.get('comment');
  return [name, comment];
};

const apiHandler = (req, res, next) => {
  req.url = new URL(req.url, `http://${req.headers.host}`);
  const { searchParams } = req.url;
  const [name, comment] = getParams(searchParams);
  res.end(filterComments(req, name, comment));
  return next();
};

const handleComments = (req) => {
  const { bodyParams } = req;
  const comment = bodyParams.get('comment');
  const { name } = req.session;
  req.comments.addComment(name, comment);
};

const guestBookHandler = (req, res, next) => {
  if (req.session) {
    const { name } = req.session;
    res.end(createGuestBook(req, req.url, name));
  } else {
    redirect(res, '/login.html');
  }
};

const createGuestBook = (req, file, name) => {
  const content = fs.readFileSync('./public' + file, 'utf-8');
  let html = content.replaceAll('_COMMENTS_', req.comments.toHtmlTable());
  html = html.replaceAll('_USER_', name);
  return html;
};

const commentHandler = (req, res, next) => {
  handleComments(req, res);
  res.end(req.comments.toHtmlTable());
  return next();
};

const log = (sessions) =>
  (req, res, next) => {
    console.log(req.bodyParams, 'bodyParams');
    console.log(req.cookies, 'cookies');
    console.log(sessions, 'sessions');
    return next();
  };

module.exports = {
  guestBookHandler, bodyParser, injectComments,
  apiHandler, loginHandler, logoutHandler, log, commentHandler
};
