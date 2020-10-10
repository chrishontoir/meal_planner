console.log('A', process.env.NODE_ENV)

const config = ['dev', 'test'].includes(process.env.NODE_ENV)
  ? require('./config.dev.json')
  : require('./config.prod.json');

module.exports = config;
