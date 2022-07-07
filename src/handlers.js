const fs = require('fs');
const { Comments } = require('./comments.js');
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

const bodyParser = (req, res, next) => {
  let data = '';
  req.setEncoding('utf-8');
  req.on('data', (chunk) => data += chunk);
  req.on('end', () => {
    req.bodyParams = new URLSearchParams(data);
    return next();
  });
};

const loginHandler = (req, res, next) => {
  const { pathname } = req.url;
  const { method } = req;
  if (pathname === '/login') {
    if (method === 'POST') {
      const { id } = createSession(req);
      setCookie(res, id);
      redirectPage(res, '/guest-book.html');
    }
    return true;
  }
  return next();
};

const logoutHandler = (req, res, next) => {
  const { pathname } = req.url;
  if (pathname === '/logout') {
    res.setHeader('set-cookie', 'id=0;max-age=0');
    redirectPage(res, '/');
    return true;
  }
  return next();
};

const serveFileContents = (req, res, next, path = './public') => {
  let { pathname } = req.url;
  if (pathname === '/') {
    pathname = '/home.html';
  }
  return serveFile(path + pathname, res, next);
};

const writeComment = (name, text) => {
  const comment = new Comments('./data/comments.json');
  comment.addComment(name, text);
};

const readComment = () => {
  const comments = new Comments('./data/comments.json');
  return comments.toHtmlTable();
};

const filterComments = (user, comment) => {
  const comments = new Comments('./data/comments.json');
  const filtered = comments.getComments().filter(({ name, text }) => {
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

const apiHandler = ({ url }, res, next) => {
  const { searchParams, pathname } = url;
  if (pathname === '/api') {
    const [name, comment] = getParams(searchParams);
    res.end(filterComments(name, comment));
    return true;
  }
  return next();
};

const handleComments = (req) => {
  const comment = req.bodyParams.get('comment');
  const { name } = req.session;
  console.log(name, comment);
  writeComment(name, comment);
};

const handleSession = (req, res, next) => {
  const { pathname } = req.url;
  const { method } = req;
  if (pathname === '/guest-book.html') {
    if (method === 'POST') {
      handleComments(req, res);
    } else {
      return redirectPage(res, '/login.html');
    }
    const { name } = req.session;
    res.end(makeContent('./public' + pathname, name));
    return true;
  }
  return next();
};

const guestBookHandler = (req, res, next) => {
  const { pathname } = req.url;
  const { method } = req;
  if (pathname === '/guest-book.html') {
    if (method === 'POST') {
      handleComments(req, res);
      redirectPage(res, '/guest-book.html');
    } else if (req.session) {
      const { name } = req.session;
      res.end(makeContent('./public' + pathname, name));
    } else {
      redirectPage(res, '/login.html');
    }
    return true;
  }
  return next();
};

const makeContent = (file, name) => {
  const content = fs.readFileSync(file, 'utf-8');
  let html = content.replaceAll('_COMMENTS_', readComment());
  html = html.replaceAll('_USER_', name);
  return html;
};

const notFoundHandler = ({ url }, res) => {
  const { pathname } = url;
  res.statusCode = 404;
  res.end(pathname + ' not found');
  return true;
};

const sessions = {};

const createSession = (req) => {
  const name = req.bodyParams.get('name');
  const time = new Date();
  const id = time.getTime();

  const session = { name, id, time };
  sessions[id] = session;
  return session;
};

const injectSession = (req, res, next) => {
  const { id } = req.cookies;
  if (!id) {
    return next();
  }
  req.session = sessions[id];
  return next();
};

const cookieParser = (cookie) => {
  const cookies = {};
  if (!cookie) {
    return cookies;
  }
  cookie.split(';').forEach(cookieString => {
    const [name, value] = cookieString.split('=');
    cookies[name.trim()] = value.trim();
  });
  return cookies;
};

const getName = (req) => {
  console.log(sessions, req.cookies.id);
  return sessions[req.cookies.id].name;
};

const setCookie = (res, id) => {
  res.setHeader('set-cookie', 'id=' + id);
  return true;
};

const injectCookies = (req, res, next) => {
  req.cookies = cookieParser(req.headers.cookie);
  return next();
};

const log = (req, res, next) => {
  console.log(req.bodyParams, 'bodyParams');
  console.log(req.cookies, 'cookies');
  console.log(sessions, 'sessions');
  return next();
};

module.exports = {
  serveFileContents, guestBookHandler, injectSession, bodyParser, injectCookies, setCookie, handleSession,
  apiHandler, notFoundHandler, loginHandler, logoutHandler, log
};
