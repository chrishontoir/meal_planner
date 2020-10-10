const td = require('testdouble');

describe('router.js', () => {
  beforeEach(() => {
    this.router = {
      get: td.function()
    };

    this.Router = td.function();
    td.replace('@koa/router', this.Router);
    td.when(this.Router()).thenReturn(this.router);

    this.controllers = {
      food: {
        get: td.function()
      }
    };
    td.replace('../../src/controllers', this.controllers);

    this.sut = require('../../src/router');
  });
  afterEach(td.reset);

  it('should set up the GET /food route', () => {
    td.verify(this.router.get('/food', this.controllers.food.get));
  });
});
