module.exports = () => {
  process.env.NODE_ENV = 'TEST';
  process.env.TZ = 'UTC';
  process.env.LOG_LEVEL = 'silent';
};
