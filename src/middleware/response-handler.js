const responseLogger = async (ctx, next) => {
  try {
    await next();
    switch (ctx.response.status) {
      case 200:
        ctx.body = { ...ctx.body, code: '020' };
        ctx.log.success(ctx);
        break;
      case 204:
        ctx.body = [];
        ctx.log.noContent(ctx);
        break;
    }
  } catch (error) {
    const status = error.status || 500;
    switch (status) {
      case 400:
        ctx.body = { code: '010', message: 'Bad Request', status };
        ctx.log.badRequest(ctx, error.reason);
        break;
      case 401:
        ctx.body = { code: '011', message: 'Unauthorized', status };
        ctx.log.unauthorized(ctx);
        break;
      case 403:
        ctx.body = { code: '012', message: 'Forbidden', status };
        ctx.log.forbidden(ctx);
        break;
      default:
        ctx.body = { code: '013', message: 'Internal Server Error', status };
        ctx.log.internalServerError(ctx, error.stack, error.reason);
    }
  }
};

module.exports = responseLogger;
