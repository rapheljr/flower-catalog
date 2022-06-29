const { serveFileContents, commentsHandler } = require('./src/handlers.js');
const { startServer, handle } = require('./src/server.js');
const handlers = [commentsHandler, serveFileContents];

startServer(8000, handle(handlers));
