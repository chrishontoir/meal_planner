const td = require('testdouble');
const assert = require('assert');

const generateError = (status, data) => {
  const error = new Error();
  error.status = status;
  error.reason = data?.reason;
  error.stack = data?.stack;
  return error;
}

describe('middleware / response-handler.js', () => {
  beforeEach(() => {
    this.next = td.function();
    this.ctx = {
      log: {
        success: td.function(),
        noContent: td.function(),
        badRequest: td.function(),
        unauthorized: td.function(),
        forbidden: td.function(),
        internalServerError: td.function()
      }
    };

    this.sut = require('../../../src/middleware/response-handler');
  });
  afterEach(td.reset);

  describe('when ctx.response.status is 200', () => {
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

  describe('when ctx.response.status is 204', () => {
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

    it('should set ctx.body to an empty array', () => {
      assert.deepStrictEqual(this.ctx.body, []);
    });

    it('should call ctx.log.noContent()', () => {
      td.verify(this.ctx.log.noContent(this.ctx));
    });
  });

  describe('when error.status is 400', () => {
    beforeEach(async () => {
      td.when(this.next()).thenThrow(generateError(400, { reason: 'Bad request reason' }))
      await this.sut(this.ctx, this.next);
    })

    it('should set ctx.body to the Bad Request response', () => {
      assert.deepStrictEqual(this.ctx.body, { code: '010', message: 'Bad Request', status: 400 });
    });

    it('should call ctx.log.badRequest()', () => {
      td.verify(this.ctx.log.badRequest(this.ctx, 'Bad request reason'));
    });
  })

  describe('when error.status is 401', () => {
    beforeEach(async () => {
      td.when(this.next()).thenThrow(generateError(401))
      await this.sut(this.ctx, this.next);
    })

    it('should set ctx.body to the Unauthorized response', () => {
      assert.deepStrictEqual(this.ctx.body, { code: '011', message: 'Unauthorized', status: 401 });
    });

    it('should call ctx.log.unauthorized()', () => {
      td.verify(this.ctx.log.unauthorized(this.ctx));
    });
  })

  describe('when error.status is 403', () => {
    beforeEach(async () => {
      td.when(this.next()).thenThrow(generateError(403))
      await this.sut(this.ctx, this.next);
    })

    it('should set ctx.body to the Forbidden response', () => {
      assert.deepStrictEqual(this.ctx.body, { code: '012', message: 'Forbidden', status: 403 });
    });

    it('should call ctx.log.forbidden()', () => {
      td.verify(this.ctx.log.forbidden(this.ctx));
    });
  })

  describe('when error.status is anything else', () => {
    beforeEach(async () => {
      td.when(this.next()).thenThrow(generateError())
      await this.sut(this.ctx, this.next);
    })

    it('should set ctx.body to the Internal Server Error response', () => {
      assert.deepStrictEqual(this.ctx.body, { code: '013', message: 'Internal Server Error', status: 500 });
    });

    it('should call ctx.log.internalServerError()', () => {
      td.verify(this.ctx.log.internalServerError(this.ctx, undefined, undefined));
    });
  })
});
