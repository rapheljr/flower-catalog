const fs = require('fs');
const { Comments } = require('./comments.js');

const serveFile = (fileName, response) => {
  if (fs.existsSync(fileName)) {
    const content = fs.readFileSync(fileName);
    response.end(content);
    return true;
  }
  return false;
};

const serveFileContents = (request, response, path = './public') => {
  let { pathname } = request.url;
  if (pathname === '/') {
    pathname = '/home.html';
  }
  return serveFile(path + pathname, response);
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
  res.statusCode = 302;
  res.setHeader('Location', '/guest-book.html');
};

const commentsHandler = ({ url }, res) => {
  const { searchParams, pathname } = url;
  const name = searchParams.get('name');
  const comment = searchParams.get('comment');
  writeComment(name, comment);
  if (pathname === '/guest-book.html') {
    if (name && comment) {
      redirect(res);
    }
    res.end(makeContent('./public' + pathname));
    return true;
  }
  return false;
};

const makeContent = (fileName) => {
  const content = fs.readFileSync(fileName, 'utf-8');
  const html = content.replaceAll('_COMMENTS_', readComment());
  return html;
};

module.exports = { serveFileContents, commentsHandler };
