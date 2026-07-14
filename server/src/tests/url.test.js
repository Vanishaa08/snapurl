const request = require('supertest');
const app = require('../app');
const { connectTestDB, closeTestDB, clearTestDB } = require('./test-db');

describe('URL API', () => {

  let accessToken;

  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: `url_test_${Date.now()}@test.com`, password: 'password123' });
    accessToken = res.body.accessToken;
  });

  test('POST /api/urls -- should shorten a valid URL anonymously', async () => {
    const res = await request(app)
      .post('/api/urls')
      .send({ originalUrl: 'https://google.com' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('shortCode');
    expect(res.body).toHaveProperty('shortUrl');
    expect(res.body.shortCode).toHaveLength(7);
  });

  test('POST /api/urls -- should reject invalid URL', async () => {
    const res = await request(app)
      .post('/api/urls')
      .send({ originalUrl: 'not-a-url' });
    expect(res.statusCode).toBe(400);
  });

  test('POST /api/urls -- should shorten URL when authenticated', async () => {
    const res = await request(app)
      .post('/api/urls')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ originalUrl: 'https://github.com' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('shortCode');
  });

  test('GET /api/urls/my -- should return user URLs when authenticated', async () => {
    const res = await request(app)
      .get('/api/urls/my')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/urls/my -- should reject unauthenticated request', async () => {
    const res = await request(app)
      .get('/api/urls/my');
    expect(res.statusCode).toBe(401);
  });

  test('GET /:shortCode -- should redirect valid short URL', async () => {
    const createRes = await request(app)
      .post('/api/urls')
      .send({ originalUrl: 'https://example.com' });
    const { shortCode } = createRes.body;

    const res = await request(app)
      .get(`/${shortCode}`);
    expect([301, 302]).toContain(res.statusCode);
  });

});