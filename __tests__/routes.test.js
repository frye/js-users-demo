// routes.test.js:
// Integration tests for the API routes

//AI_start
const request = require('supertest');
const app = require('../src/index');
const { users } = require('../src/users');

// Set test environment
process.env.NODE_ENV = 'test';

describe('API Routes', () => {
  describe('GET /api/users', () => {
    test('should return all users', async() => {
      const response = await request(app).get('/api/users');
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('should return users with correct properties', async() => {
      const response = await request(app).get('/api/users');
      expect(response.status).toBe(200);
      response.body.forEach((user) => {
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('emoji');
      });
    });
  });

  describe('GET /api/users/:id', () => {
    test('should return a specific user by id', async() => {
      const userId = users[0].id;
      const response = await request(app).get(`/api/users/${userId}`);
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.id).toBe(userId);
    });

    test('should return 404 for non-existent user', async() => {
      const response = await request(app).get('/api/users/non-existent-id');
      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/users', () => {
    test('should create a new user with name and emoji', async() => {
      const newUser = {
        name: 'Test User',
        emoji: '🧪',
      };
      const response = await request(app)
        .post('/api/users')
        .send(newUser);
      
      expect(response.status).toBe(201);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newUser.name);
      expect(response.body.emoji).toBe(newUser.emoji);
    });

    test('should create a new user with only name (default emoji)', async() => {
      const newUser = {
        name: 'Test User 2',
      };
      const response = await request(app)
        .post('/api/users')
        .send(newUser);
      
      expect(response.status).toBe(201);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newUser.name);
      expect(response.body.emoji).toBe('👋');
    });

    test('should accept custom id if provided', async() => {
      const newUser = {
        id: 'custom-test-id',
        name: 'Test User 3',
        emoji: '🎯',
      };
      const response = await request(app)
        .post('/api/users')
        .send(newUser);
      
      expect(response.status).toBe(201);
      expect(response.body.id).toBe(newUser.id);
    });
  });

  describe('PUT /api/users/:id', () => {
    test('should update an existing user', async() => {
      const userId = users[0].id;
      const updatedData = {
        name: 'Updated Name',
      };
      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send(updatedData);
      
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.id).toBe(userId);
      expect(response.body.name).toBe(updatedData.name);
    });

    test('should return 404 when updating non-existent user', async() => {
      const updatedData = {
        name: 'Updated Name',
      };
      const response = await request(app)
        .put('/api/users/non-existent-id')
        .send(updatedData);
      
      expect(response.status).toBe(404);
    });
  });

  describe('GET /', () => {
    test('should return the index page', async() => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.text).toContain('Users API');
    });
  });

  describe('GET /openapi.json', () => {
    test('should return OpenAPI specification', async() => {
      const response = await request(app).get('/openapi.json');
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('application/json');
    });
  });

  describe('GET /redoc', () => {
    test('should return ReDoc page', async() => {
      const response = await request(app).get('/redoc');
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('text/html');
    });
  });
});
//AI_end
