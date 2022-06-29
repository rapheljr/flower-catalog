const fs = require('fs');
const { Comments } = require('./comments.js');
const mime = require('mime-types');

const serveFile = (file, res) => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file);
    res.setHeader('Content-Type', mime.lookup(file));
    res.end(content);
    return true;
  }
  return false;
};

const serveFileContents = (req, res, path = './public') => {
  let { pathname } = req.url;
  if (pathname === '/') {
    pathname = '/home.html';
  }
  return serveFile(path + pathname, res);
};

const writeComment = (name, text) => {
  const comment = new Comments('./data/comments.json');
  comment.addComment(name, text);
};

const readComment = () => {
  const comments = new Comments('./data/comments.json');
  return comments.toHtmlTable();
};

const redirect = (res) => {
  const file = '/guest-book.html';
  res.statusCode = 302;
  res.setHeader('Location', file);
  res.setHeader('Content-Type', mime.lookup(file));
};

const commentsHandler = ({ url }, res) => {
  const { searchParams, pathname } = url;
  if (pathname === '/guest-book.html') {
    const name = searchParams.get('name');
    const comment = searchParams.get('comment');
    if (name && comment) {
      writeComment(name, comment);
      redirect(res);
    }
    res.end(makeContent('./public' + pathname));
    return true;
  }
  return false;
};

const makeContent = (file) => {
  const content = fs.readFileSync(file, 'utf-8');
  const html = content.replaceAll('_COMMENTS_', readComment());
  return html;
};

module.exports = { serveFileContents, commentsHandler };
