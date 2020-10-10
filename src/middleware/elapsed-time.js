const elapsedTime = async (ctx, next) => {
  const start = new Date();
  await next();
  const end = new Date();
  ctx.log.apiElapsedTime(ctx, start, end);
};

module.exports = elapsedTime;
