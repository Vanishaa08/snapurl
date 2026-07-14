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

  beforeEach(async () => {
    await clearTestDB();
  });

  test('POST /api/auth/register -- should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
  });

  test('POST /api/auth/register -- should reject duplicate email', async () => {
    await request(app)
      .post('/api/auth/register')
      .send(testUser);
    
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    expect(res.statusCode).toBe(409);
  });

  test('POST /api/auth/login -- should login with valid credentials', async () => {
    await request(app)
      .post('/api/auth/register')
      .send(testUser);
    
    const res = await request(app)
      .post('/api/auth/login')
      .send(testUser);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
  });

  test('POST /api/auth/login -- should reject invalid password', async () => {
    await request(app)
      .post('/api/auth/register')
      .send(testUser);
    
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'wrongpassword' });
    expect(res.statusCode).toBe(401);
  });

  test('POST /api/auth/register -- should reject invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'notanemail', password: 'password123' });
    expect(res.statusCode).toBe(400);
  });

});