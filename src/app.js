const Koa = require('koa');
const { elapsedTime, logger, responseHandler } = require('./middleware');
const { port } = require('./config');
const router = require('./router');

const app = new Koa();

logger(app);

app.use(elapsedTime);
app.use(responseHandler);

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
