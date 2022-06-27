const fs = require('fs');

const serveFile = (fileName, response) => {
  if (fs.existsSync(fileName)) {
    const content = fs.readFileSync(fileName);
    // response.setHeader('content-type', 'text/html');
    response.send(content);
    return true;
  }
  return false;
};

const serveFileContents = (request, response, path) => {
  let { uri } = request;
  if (uri === '/') {
    uri = '/home.html';
  }
  if (uri === '/guest-book.html') {
    return commentsHandler(request, response);
  }
  return serveFile(path + uri, response);
};

const writeComment = (name, comment) => {
  const date = new Date();
  const content = `${date.toLocaleString()} ${name} ${comment}`;
  console.log(content);
  if (name && comment) {
    fs.appendFileSync('./public/comments.txt', '\n' + content);
  }
};

const commentsHandler = (request, response) => {
  const { uri, query } = request;
  const { name, comment } = query;
  writeComment(name, comment);
  if (uri === '/guest-book.html') {
    if (name) {
      response.statusCode = 302;
      response.setHeader('Location', '/guest-book.html');
    }
    response.send(makeContent('./public' + uri));
    return true;
  }
  return false;
};

const commentsMaker = () => {
  let comments = fs.readFileSync('./public/comments.txt', 'utf-8');
  comments = comments.split('\n');
  comments = comments.map(comment => `<li>${comment}</li>`);
  comments.reverse();
  comments.pop();
  return comments.join('');
};

const makeContent = (fileName) => {
  const content = fs.readFileSync(fileName, 'utf-8');
  const comments = commentsMaker();
  const html = content.replace('_COMMENTS_', comments);
  // console.log('here', html);
  return html;
};

module.exports = { serveFileContents, commentsHandler };
