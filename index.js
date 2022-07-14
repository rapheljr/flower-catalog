const { createApp } = require('./src/app.js');

const main = () => {
  const app = createApp();
  const PORT = 8000;
  app.listen(PORT, () => console.log('starts listening', PORT))
};

main();
