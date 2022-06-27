const fs = require('fs');

const serveFileContents = (request, response, path) => {
  let { uri } = request;
  if (uri === '/') {
    uri = '/home.html';
  }
  const fileName = path + uri;
  if (fs.existsSync(fileName)) {
    const content = fs.readFileSync(fileName);
    // response.setHeader('content-type', 'text/html');
    response.send(content);
    return true;
  }
  return false;
};

module.exports = { serveFileContents };
