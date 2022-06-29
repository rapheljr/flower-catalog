const http = require('http');

const handle = (handlers) => {
  return (req, res) => {
    req.url = new URL(req.url, `http://${req.headers.host}`);
    for (const handler of handlers) {
      if (handler(req, res)) {
        return true;
      }
    }
    return false;
  };
};

const startServer = (PORT, handlers) => {
  const server = http.createServer(handlers);
  server.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
  });
};

module.exports = { startServer, handle };
