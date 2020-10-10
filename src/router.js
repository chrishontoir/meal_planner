const Router = require('@koa/router');
const { meals } = require('./controllers');

const router = new Router();

router.get(
    '/get-meals',
    meals.get
);

module.exports = router;