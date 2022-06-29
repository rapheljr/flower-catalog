const { serveFileContents, commentsHandler, notFoundHandler } =
  require('./src/handlers.js');
const { startServer, handle } = require('./src/server.js');
const handlers = [commentsHandler, serveFileContents, notFoundHandler];

startServer(8000, handle(handlers));
