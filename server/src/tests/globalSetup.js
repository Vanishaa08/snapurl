module.exports = async () => {
  console.log('Global setup starting...');
  process.env.NODE_ENV = 'test';
};