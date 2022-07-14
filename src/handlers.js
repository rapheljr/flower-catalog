const fs = require('fs');
const { GuestBook } = require('./comments.js');
const { createSession, setCookie } = require('./cookie.js');

const serveFile = (file, res, next) => {
  if (fs.existsSync(file)) {
    fs.readFile(file, (error, content) => {
      res.end(content);
    });
    return true;
  }
  return next();
};

const injectComments = (file, readFile, writeFile) =>
  (req, res, next) => {
    req.comments = new GuestBook(file, readFile, writeFile);
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
    redirectPage(res, '/guest-book.html');
    return next();
  };

const logoutHandler = (sessions) =>
  (req, res, next) => {
    delete sessions[req.cookies.id];
    res.setHeader('set-cookie', 'id=0;max-age=0');
    redirectPage(res, '/');
    return next();
  };

const serveFileContents = (path = './public') =>
  (req, res, next) => {
    pathname = '/home.html';
    return serveFile(path + pathname, res, next);
  };

const filterComments = (req, user, comment) => {
  const filtered = req.comments.getComments().filter(({ name, text }) => {
    return name.includes(user) || text.includes(comment);
  }
  );
  return JSON.stringify(filtered);
};

const redirectPage = (res, page) => {
  res.statusCode = 302;
  res.setHeader('Location', page);
  res.end();
  return true;
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
  console.log(name, comment);
  req.comments.addComment(name, comment);
};

const guestBookHandler = (req, res, next) => {
  if (req.session) {
    const { name } = req.session;
    res.end(makeContent(req, req.url, name));
  } else {
    redirectPage(res, '/login.html');
  }
};

const makeContent = (req, file, name) => {
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
  serveFileContents, guestBookHandler, bodyParser, injectComments,
  apiHandler, loginHandler, logoutHandler, log, commentHandler
};
