//AI_start
// routes.test.js:
// Unit tests for the API routes to verify endpoint functionality

const request = require('supertest');
const express = require('express');
const routes = require('../src/routes');

// Create a test Express app
const app = express();
app.use(express.json());
app.use('/api', routes);

describe('API Routes', () => {
  describe('GET /api/users', () => {
    // Test that GET /api/users returns a 200 status code
    test('should return 200 status code', async () => {
      const response = await request(app).get('/api/users');
      expect(response.status).toBe(200);
    });

    // Test that GET /api/users returns an array
    test('should return an array of users', async () => {
      const response = await request(app).get('/api/users');
      expect(Array.isArray(response.body)).toBe(true);
    });

    // Test that GET /api/users returns users with correct properties
    test('should return users with id, name, and emoji properties', async () => {
      const response = await request(app).get('/api/users');
      response.body.forEach((user) => {
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('emoji');
      });
    });
  });

  describe('GET /api/users/:id', () => {
    let testUserId;

    // Get a user ID before running tests
    beforeAll(async () => {
      const response = await request(app).get('/api/users');
      testUserId = response.body[0].id;
    });

    // Test that GET /api/users/:id returns a 200 status code for valid ID
    test('should return 200 status code for valid user ID', async () => {
      const response = await request(app).get(`/api/users/${testUserId}`);
      expect(response.status).toBe(200);
    });

    // Test that GET /api/users/:id returns the correct user
    test('should return the correct user object', async () => {
      const response = await request(app).get(`/api/users/${testUserId}`);
      expect(response.body).toHaveProperty('id', testUserId);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('emoji');
    });

    // Test that GET /api/users/:id returns 404 for invalid ID
    test('should return 404 status code for invalid user ID', async () => {
      const response = await request(app).get('/api/users/invalid-id');
      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/users', () => {
    // Test that POST /api/users creates a new user
    test('should create a new user with name and emoji', async () => {
      const newUser = {
        name: 'Test User',
        emoji: '🧪',
      };

      const response = await request(app)
        .post('/api/users')
        .send(newUser)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', 'Test User');
      expect(response.body).toHaveProperty('emoji', '🧪');
    });

    // Test that POST /api/users creates a user with default emoji when not provided
    test('should create a new user with default emoji when not provided', async () => {
      const newUser = {
        name: 'Test User 2',
      };

      const response = await request(app)
        .post('/api/users')
        .send(newUser)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', 'Test User 2');
      expect(response.body).toHaveProperty('emoji', '👋');
    });

    // Test that POST /api/users accepts custom ID
    test('should create a new user with custom ID when provided', async () => {
      const customId = 'custom-test-id';
      const newUser = {
        id: customId,
        name: 'Test User 3',
        emoji: '🎯',
      };

      const response = await request(app)
        .post('/api/users')
        .send(newUser)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id', customId);
    });
  });

  describe('PUT /api/users/:id', () => {
    let testUserId;

    // Get a user ID before running tests
    beforeAll(async () => {
      const response = await request(app).get('/api/users');
      testUserId = response.body[0].id;
    });

    // Test that PUT /api/users/:id updates a user
    test('should update an existing user', async () => {
      const updatedUser = {
        name: 'Updated Name',
      };

      const response = await request(app)
        .put(`/api/users/${testUserId}`)
        .send(updatedUser)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', testUserId);
      expect(response.body).toHaveProperty('name', 'Updated Name');
    });

    // Test that PUT /api/users/:id returns 404 for invalid ID
    test('should return 404 status code for invalid user ID', async () => {
      const updatedUser = {
        name: 'Updated Name',
      };

      const response = await request(app)
        .put('/api/users/invalid-id')
        .send(updatedUser)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(404);
    });
  });
});
//AI_end
