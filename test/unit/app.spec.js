const td = require('testdouble');
const assert = require('assert');

describe('app.js', () => {
  before(() => {
    console.log = message => { this.log = message; };

    const Koa = td.constructor(['listen', 'use']);
    td.replace('koa', Koa);

    this.app = new Koa();
    td.when(this.app.listen('3000')).thenCallback();

    this.middleware = {
      elapsedTime: td.function(),
      logger: td.function(),
      responseHandler: td.function()
    };
    td.replace('../../src/middleware', this.middleware);

    this.config = {
      port: '3000'
    };
    td.replace('../../src/config', this.config);

    this.router = {
      routes: td.function(),
      allowedMethods: td.function()
    };
    td.replace('../../src/router', this.router);

    this.sut = require('../../src/app');
    this.sut();
  });
  after(td.reset);

  it('should create a new Koa app on port 3000', () => {
    td.verify(this.app.listen('3000', td.matchers.anything()));
  });

  it('should set up the logger', () => {
    td.verify(this.middleware.logger(this.app));
  });

  it('should set up the middleware', () => {
    td.verify(this.app.use(this.middleware.elapsedTime));
    td.verify(this.app.use(this.middleware.responseHandler));
  });

  it('should set up the router', () => {
    td.verify(this.app.use(this.router.routes()));
    td.verify(this.app.use(this.router.allowedMethods()));
  });

  it('should console log that the server has started', () => {
    assert.deepStrictEqual(this.log, 'Server started on port 3000');
  });
});
