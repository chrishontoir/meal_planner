const td = require('testdouble');

describe('middleware / elapsed-time.js', () => {
  beforeEach(async () => {
    this.ctx = {
      log: {
        apiElapsedTime: td.function()
      }
    };

    this.next = td.function();

    this.sut = require('../../../src/middleware/elapsed-time');
    await this.sut(this.ctx, this.next);
  });

  it('should call next()', () => {
    td.verify(this.next());
  });

  it('should call ctx.log.apiElapsedTime()', () => {
    td.verify(this.ctx.log.apiElapsedTime(this.ctx, td.matchers.isA(Date), td.matchers.isA(Date)));
  });
});
