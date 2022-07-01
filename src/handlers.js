const fs = require('fs');
const { Comments } = require('./comments.js');
const mime = require('mime-types');

const serveFile = (file, res, next) => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file);
    res.setHeader('Content-Type', mime.lookup(file));
    res.end(content);
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

const redirect = (res) => {
  const file = '/guest-book.html';
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

const commentsHandler = ({ url }, res, next) => {
  const { searchParams, pathname } = url;
  console.log(pathname, url);
  if (pathname === '/guest-book.html') {
    // console.log('comments');
    const [name, comment] = getParams(searchParams);
    if (name && comment) {
      writeComment(name, comment);
      redirect(res);
    }
    res.end(makeContent('./public' + pathname));
    return true;
  }
  return next();
};

const makeContent = (file) => {
  const content = fs.readFileSync(file, 'utf-8');
  const html = content.replaceAll('_COMMENTS_', readComment());
  return html;
};

const notFoundHandler = ({ url }, res) => {
  const { pathname } = url;
  res.statusCode = 404;
  res.end(pathname + ' not found');
  return true;
};

module.exports = {
  serveFileContents, commentsHandler,
  apiHandler, notFoundHandler
};
