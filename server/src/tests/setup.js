require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

jest.mock('ioredis', () => {
  const mockRedis = {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue('OK'),
    del: jest.fn().mockResolvedValue(1),
    expire: jest.fn().mockResolvedValue(1),
    rpush: jest.fn().mockResolvedValue(1),
    lrange: jest.fn().mockResolvedValue([]),
    ltrim: jest.fn().mockResolvedValue('OK'),
    quit: jest.fn().mockResolvedValue(),
    on: jest.fn(),
    status: 'ready'
  };
  
  return jest.fn(() => mockRedis);
});

jest.setTimeout(30000);

beforeAll(() => {
  console.log('Starting test suite...');
});

afterAll(() => {
  console.log('Test suite completed');
});