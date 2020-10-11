const food = {
  get: (ctx) => {
    ctx.body = {
      message: 'Get food'
    };
  },
  post: (ctx) => {
    ctx.body = {
      message: 'Post food'
    };
  }
};

module.exports = food;
