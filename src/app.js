const Koa = require('koa');
const { logger } = require('./middleware');
const { port } = require('./config');

const app = new Koa();

logger(app);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
