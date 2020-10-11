const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');

const { food } = require('./controllers');

const router = new Router();

router.get(
  '/food',
  food.get
);

router.post(
  '/food',
  bodyParser(),
  food.post
);

module.exports = router;
