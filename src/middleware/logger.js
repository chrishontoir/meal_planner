const fs = require('fs');
const { LOG_TO_FILE, FORMAT_LOGS } = process.env;

const generateLog = (ctx, code, message, data) => {
  const origin = ctx.API_NAME;
  const method = ctx.request.method;
  const endpoint = ctx.request.path;
  const timestamp = new Date();
  const log = { code, message, origin, method, endpoint, timestamp, data };
  if (LOG_TO_FILE === 'true') {
    fs.appendFileSync('./app.log', JSON.stringify(log) + '\n');
  } else {
    console.log(FORMAT_LOGS === 'true'
      ? JSON.stringify(log, null, 4)
      : JSON.stringify(log)
    );
  }
};

const logger = (app) => {
  if (LOG_TO_FILE === 'true' && fs.existsSync('./app.log')) {
    fs.unlinkSync('./app.log');
  }
  app.context.log = {
    apiElapsedTime: (ctx, start, end) => {
      const elapsed = end - start;
      const data = { start, end, elapsed };
      generateLog(ctx, '001', 'API Elapsed Time', data);
    },
    dbElapsedTime: (ctx, start, end) => {
      const elapsed = end - start;
      const data = { start, end, elapsed };
      generateLog(ctx, '002', 'DB Elapsed Time', data);
    },
    badRequest: (ctx, reason) => {
      const data = { reason };
      generateLog(ctx, '010', 'Bad Request', data);
    },
    unauthorized: (ctx) => {
      generateLog(ctx, '011', 'Unauthorized');
    },
    forbidden: (ctx) => {
      generateLog(ctx, '012', 'Forbidden');
    },
    internalServerError: (ctx, stack, reason) => {
      const data = { stack, reason };
      generateLog(ctx, '013', 'Internal Server Error', data);
    },
    success: (ctx) => {
      generateLog(ctx, '020', 'Success');
    },
    noContent: (ctx) => {
      generateLog(ctx, '021', 'No Content');
    }
  };
};

module.exports = logger;
