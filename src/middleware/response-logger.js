const responseLogger = async (ctx, next) => {
    await next();
    if (ctx.response.status === 200) {
        ctx.log.success(ctx);
    }
    if (ctx.response.status === 204) {
        ctx.log.noContent(ctx);
    }
};

module.exports = responseLogger;
