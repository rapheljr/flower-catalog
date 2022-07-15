const fs = require('fs');

const { createApp } = require('./src/app.js');

const main = () => {
  const config = {
    path: 'public',
    file: './data/comments.json',
    read: fs.readFileSync,
    write: fs.writeFileSync
  }
  const app = createApp(config);
  const PORT = 8000;
  app.listen(PORT, () => console.log('starts listening', PORT))
};

main();
