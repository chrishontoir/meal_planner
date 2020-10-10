const td = require('testdouble');
const assert = require('assert');

describe('app.js', () => {
    beforeEach(() => {
        console.log = message => this.log = message;

        this.app = { listen: td.function() };
        td.when(this.app.listen("3000")).thenCallback();

        this.koa = td.function();
        td.replace('koa', this.koa);
        td.when(this.koa()).thenReturn(this.app);

        this.middleware = { logger: td.function() };
        td.replace('../../src/middleware', this.middleware);

        this.config = { port: "3000" };
        td.replace('../../src/config', this.config);

        this.sut = require('../../src/app');
    });
    afterEach(td.reset);
    
    it('should create a new Koa app on port 3000', () => {
        td.verify(this.app.listen("3000", td.matchers.anything()));
    });

    it('should set up the logger', () => {
        td.verify(this.middleware.logger(this.app));
    });

    it('should console log that the server has started', async () => {
        assert.deepStrictEqual(this.log, 'Server started on port 3000');
    });
});
