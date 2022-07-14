const fs = require('fs');
const { GuestBook } = require('./comments.js');
const { createSession, setCookie } = require('./cookie.js');
const mime = require('mime-types');

const serveFile = (file, res, next) => {
  if (fs.existsSync(file)) {
    fs.readFile(file, (error, content) => {
      res.setHeader('Content-Type', mime.lookup(file));
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
    if (req.matches('POST', '/login')) {
      const { id } = createSession(req, sessions);
      setCookie(res, id);
      redirectPage(res, '/guest-book.html');
      return true;
    }
    return next();
  };

const logoutHandler = (sessions) =>
  (req, res, next) => {
    if (req.matches('GET', '/logout')) {
      delete sessions[req.cookies.id];
      res.setHeader('set-cookie', 'id=0;max-age=0');
      redirectPage(res, '/');
      return true;
    }
    return next();
  };

const serveFileContents = (path = './public') =>
  (req, res, next) => {
    let { pathname } = req.url;
    if (req.matches('GET', '/')) {
      pathname = '/home.html';
    }
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
  res.setHeader('Content-Type', mime.lookup(page));
  res.end();
  return true;
};

const getParams = (params) => {
  const name = params.get('name');
  const comment = params.get('comment');
  return [name, comment];
};

const apiHandler = (req, res, next) => {
  const { searchParams } = req.url;
  if (req.matches('GET', '/api')) {
    const [name, comment] = getParams(searchParams);
    res.end(filterComments(req, name, comment));
    return true;
  }
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
  if (req.matches('GET', '/guest-book.html')) {
    if (req.session) {
      const { name } = req.session;
      const { pathname } = req.url;
      res.end(makeContent(req, pathname, name));
    } else {
      redirectPage(res, '/login.html');
    }
    return true;
  }
  return next();
};

const makeContent = (req, file, name) => {
  const content = fs.readFileSync('./public' + file, 'utf-8');
  let html = content.replaceAll('_COMMENTS_', req.comments.toHtmlTable());
  html = html.replaceAll('_USER_', name);
  return html;
};

const commentHandler = (req, res, next) => {
  if (req.matches('POST', '/comment')) {
    handleComments(req, res);
    res.end(req.comments.toHtmlTable());
    return true;
  }
  return next();
};

const notFoundHandler = ({ url }, res) => {
  const { pathname } = url;
  res.statusCode = 404;
  res.end(pathname + ' not found');
  return true;
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
  apiHandler, notFoundHandler, loginHandler, logoutHandler, log, commentHandler
};
