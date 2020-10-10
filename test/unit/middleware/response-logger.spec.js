const td = require('testdouble');
const assert = require('assert');

describe('middleware / response-logger.js', () => {
  beforeEach(() => {
    this.next = td.function();
    this.ctx = {
      log: {
        success: td.function(),
        noContent: td.function()
      }
    };

    this.sut = require('../../../src/middleware/response-logger');
  });
  afterEach(td.reset);

  describe('when called with a status of 200', () => {
    beforeEach(async () => {
      this.ctx = {
        ...this.ctx,
        response: { status: 200 },
        body: { message: 'Success' }
      };
      await this.sut(this.ctx, this.next);
    });

    it('should call next()', () => {
      td.verify(this.next());
    });

    it('should add code 020 to the ctx.body', () => {
      assert.deepStrictEqual(this.ctx.body, { message: 'Success', code: '020' });
    });

    it('should call ctx.log.success()', () => {
      td.verify(this.ctx.log.success(this.ctx));
    });
  });

  describe('when called with a status of 204', () => {
    beforeEach(async () => {
      this.ctx = {
        ...this.ctx,
        response: { status: 204 },
        body: { message: 'No Content' }
      };
      await this.sut(this.ctx, this.next);
    });

    it('should call next()', () => {
      td.verify(this.next());
    });

    it('should add code 021 to the ctx.body', () => {
      assert.deepStrictEqual(this.ctx.body, { message: 'No Content', code: '021' });
    });

    it('should call ctx.log.noContent()', () => {
      td.verify(this.ctx.log.noContent(this.ctx));
    });
  });
});
