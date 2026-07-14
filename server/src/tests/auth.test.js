const request = require('supertest');
const app = require('../app');
const { connectTestDB, closeTestDB, clearTestDB } = require('./test-db');

describe('Auth API', () => {

  const testUser = {
    email: `test_${Date.now()}@test.com`,
    password: 'password123'
  };

  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  // Only clear DB before each test, not after
  beforeEach(async () => {
    await clearTestDB();
  });

  test('POST /api/auth/register — should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
  });

  test('POST /api/auth/register — should reject duplicate email', async () => {
    // First register the user
    await request(app)
      .post('/api/auth/register')
      .send(testUser);
    
    // Then try to register again with same email
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    expect(res.statusCode).toBe(409);
  });

  test('POST /api/auth/login — should login with valid credentials', async () => {
    // First register the user
    await request(app)
      .post('/api/auth/register')
      .send(testUser);
    
    // Then login
    const res = await request(app)
      .post('/api/auth/login')
      .send(testUser);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
  });

  test('POST /api/auth/login — should reject invalid password', async () => {
    // First register the user
    await request(app)
      .post('/api/auth/register')
      .send(testUser);
    
    // Then try to login with wrong password
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'wrongpassword' });
    expect(res.statusCode).toBe(401);
  });

  test('POST /api/auth/register — should reject invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'notanemail', password: 'password123' });
    expect(res.statusCode).toBe(400);
  });

});