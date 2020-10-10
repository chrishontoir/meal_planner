const food = {
  get: (ctx) => {
    ctx.body = {
      message: 'Get food'
    };
  }
};

module.exports = food;
