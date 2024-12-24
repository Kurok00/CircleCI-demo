const request = require('supertest');
const mongoose = require('mongoose');
const { app, closeServer, connectDB } = require('../server');

beforeAll(async () => {
  await connectDB();
});

describe('GET /', () => {
  it('should return Hello World message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Hello World! test 1nd');
  });
});

describe('GET /api/status', () => {
  it('should return status OK', async () => {
    const res = await request(app).get('/api/status');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('OK');
    expect(res.body).toHaveProperty('timestamp');
  });
});

describe('GET /health', () => {
  it('should return healthy status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('healthy');
  });
});

describe('POST /webhook/circle-ci', () => {
  it('should handle successful build notification', async () => {
    const mockSuccessPayload = {
      outcome: 'success',
      build_num: '123',
      reponame: 'test-repo'
    };
    
    const res = await request(app)
      .post('/webhook/circle-ci')
      .send(mockSuccessPayload);
      
    expect(res.statusCode).toBe(200);
  });

  it('should handle failed build notification', async () => {
    const mockFailPayload = {
      outcome: 'failed',
      build_num: '124',
      reponame: 'test-repo'
    };
    
    const res = await request(app)
      .post('/webhook/circle-ci')
      .send(mockFailPayload);
      
    expect(res.statusCode).toBe(200);
  });
});

// Thêm afterAll để đóng server sau khi tests hoàn thành
afterAll(async () => {
  await closeServer();
});