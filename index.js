const { serveFileContents, commentsHandler, apiHandler, notFoundHandler } =
  require('./src/handlers.js');
const { startServer, handle } = require('./src/server.js');
const handlers = [commentsHandler, serveFileContents,
  apiHandler, notFoundHandler];

startServer(8000, handle(handlers));
