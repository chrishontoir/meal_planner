const Router = require('@koa/router');
const { food } = require('./controllers');

const router = new Router();

router.get(
  '/food',
  food.get
);

module.exports = router;
