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

const cookieParser = (cookie) => {
  const cookies = {};
  if (!cookie) {
    return;
  }
  cookie.split(';').forEach(cookieString => {
    const [name, value] = cookieString.split('=');
    cookies[name.trim()] = value.trim();
  });
  return cookies;
};

const sessions = {

};

const handleLogin = (req, res) => {
  let data = '';
  req.on('data', (chunk) => {
    data += chunk;
  });
  req.on('end', () => {
    const bodyParams = new URLSearchParams(data);
    const [name] = getParams(bodyParams);
    console.log(name);
    setCookie(req, res, name);
    res.end(makeContent('./public/guest-book.html', name));
  });
};

// const injectSection = (req, res, next) => {
//   return next();
// };

const loginHandler = (req, res, next) => {
  const { pathname } = req.url;
  const { method } = req;
  if (pathname === '/login') {
    if (method === 'POST') {
      handleLogin(req, res);
    }
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

const redirectGuest = (res) => {
  const file = '/guest-book.html';
  res.statusCode = 302;
  res.setHeader('Location', file);
  res.setHeader('Content-Type', mime.lookup(file));
};

const redirectLogin = (res) => {
  const file = '/login.html';
  res.statusCode = 302;
  res.setHeader('Location', file);
  res.setHeader('Content-Type', mime.lookup(file));
};

const getParams = (searchParams) => {
  const name = searchParams.get('name');
  const comment = searchParams.get('comment');
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
  let data = '';
  req.on('data', (chunk) => {
    data += chunk;
  });
  req.on('end', () => {
    const bodyParams = new URLSearchParams(data);
    const [name, comment] = getParams(bodyParams);
    console.log(req.cookies.name, comment);
    writeComment(req.cookies.name, comment);
  });
};

const addComments = (req, res) => {
  if (req.cookies) {
    handleComments(req, res);
    redirectGuest(res);
  } else {
    redirectLogin(res);
  }
};

const guestBookHandler = (req, res, next) => {
  const { pathname } = req.url;
  const { method } = req;
  if (pathname === '/guest-book.html') {
    if (method === 'POST') {
      handleComments(req, res);
      redirectGuest(res);
      res.end(makeContent('./public' + pathname, req.cookies.name));
    } else if (req.cookies) {
      res.end(makeContent('./public' + pathname, req.cookies.name));
    } else {
      redirectLogin(res);
      res.end();
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

// const getCookie = () => {
//   sessions[]
// };

const setCookie = (req, res, name) => {
  if (req.cookies) {
    return;
  }
  res.setHeader('set-cookie', 'name=' + name);
  return true;
};

const injectCookies = (req, res, next) => {
  req.cookies = cookieParser(req.headers.cookie);
  console.log(req.cookies);
  return next();
};

const log = (req, res, next) => {
  // console.log(req.url);
  return next();
};

module.exports = {
  serveFileContents, guestBookHandler, injectCookies, setCookie,
  apiHandler, notFoundHandler, loginHandler, log
};
