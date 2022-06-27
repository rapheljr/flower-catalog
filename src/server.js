const { createServer } = require('net');
const { parseRequest } = require('./parser.js');
const { Response } = require('./response.js');
const { serveFileContents, commentsHandler } = require('./handlers.js');

const handle = (request, response, path) => {
  for (const handler of handlers) {
    if (handler(request, response, path)) {
      return true;
    }
  }
  return false;
};

const onConnection = (socket, path) => {
  socket.setEncoding('utf-8');
  socket.on('data', (chunk) => {
    const response = new Response(socket);
    const request = parseRequest(chunk);
    handle(request, response, path);
  });
};

const handlers = [commentsHandler, serveFileContents];

const startServer = (PORT, path) => {
  const server = createServer((socket) => {
    onConnection(socket, path);
  });
  server.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
  });
};

module.exports = { startServer };
