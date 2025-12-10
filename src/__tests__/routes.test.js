//AI_start
/**
 * Unit tests for routes.js module
 * Tests all API endpoints using supertest
 */

const request = require('supertest');
const express = require('express');
const router = require('../routes');
const { users } = require('../users');

// Create a test Express app
const app = express();
app.use(express.json());
app.use('/api', router);

describe('routes API endpoints', () => {
  // Store original users length
  let originalUsersLength;

  beforeEach(() => {
    // Store the original number of users before each test
    originalUsersLength = users.length;
  });

  describe('GET /api/users', () => {
    test('should return all users', async() => {
      const response = await request(app)
        .get('/api/users')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    test('should return users with correct properties', async() => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);

      response.body.forEach((user) => {
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('emoji');
      });
    });
  });

  describe('GET /api/users/:id', () => {
    test('should return a specific user by id', async() => {
      // Get the first user id
      const firstUser = users[0];

      const response = await request(app)
        .get(`/api/users/${firstUser.id}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.id).toBe(firstUser.id);
      expect(response.body.name).toBe(firstUser.name);
      expect(response.body.emoji).toBe(firstUser.emoji);
    });

    test('should return 404 for non-existent user id', async() => {
      const response = await request(app)
        .get('/api/users/non-existent-id')
        .expect(404);

      expect(response.text).toBe('User not found');
    });
  });

  describe('POST /api/users', () => {
    test('should create a new user with provided data', async() => {
      const newUser = {
        name: 'Test User',
        emoji: '🧪',
      };

      const response = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newUser.name);
      expect(response.body.emoji).toBe(newUser.emoji);
      expect(typeof response.body.id).toBe('string');
    });

    test('should create a user with custom id when provided', async() => {
      const newUser = {
        id: 'custom-test-id',
        name: 'Custom ID User',
        emoji: '🎯',
      };

      const response = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(201);

      expect(response.body.id).toBe(newUser.id);
      expect(response.body.name).toBe(newUser.name);
      expect(response.body.emoji).toBe(newUser.emoji);
    });

    test('should create a user with default emoji when not provided', async() => {
      const newUser = {
        name: 'Default Emoji User',
      };

      const response = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(201);

      expect(response.body.emoji).toBe('👋');
    });

    test('should add user to users array', async() => {
      const newUser = {
        name: 'Array Test User',
        emoji: '📝',
      };

      await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(201);

      // Verify user was added to the array
      expect(users.length).toBe(originalUsersLength + 1);
    });
  });

  describe('PUT /api/users/:id', () => {
    test('should update an existing user', async() => {
      const firstUser = users[0];
      const updatedData = {
        name: 'Updated Name',
      };

      const response = await request(app)
        .put(`/api/users/${firstUser.id}`)
        .send(updatedData)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.id).toBe(firstUser.id);
      expect(response.body.name).toBe(updatedData.name);
    });

    test('should return 404 when updating non-existent user', async() => {
      const updatedData = {
        name: 'Updated Name',
      };

      const response = await request(app)
        .put('/api/users/non-existent-id')
        .send(updatedData)
        .expect(404);

      expect(response.text).toBe('User not found');
    });

    test('should update user in users array', async() => {
      const firstUser = users[0];
      const originalName = firstUser.name;
      const updatedData = {
        name: 'Array Update Test',
      };

      await request(app)
        .put(`/api/users/${firstUser.id}`)
        .send(updatedData)
        .expect(200);

      // Verify the name was actually updated in the array
      const updatedUser = users.find((u) => u.id === firstUser.id);
      expect(updatedUser.name).toBe(updatedData.name);
    });
  });

  describe('POST /api/db/users', () => {
    test('should accept user data for database creation', async() => {
      const newUser = {
        name: 'DB Test User',
        emoji: '💾',
      };

      const response = await request(app)
        .post('/api/db/users')
        .send(newUser)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newUser.name);
      expect(response.body.emoji).toBe(newUser.emoji);
    });

    test('should use default emoji for database user when not provided', async() => {
      const newUser = {
        name: 'DB Default Emoji User',
      };

      const response = await request(app)
        .post('/api/db/users')
        .send(newUser)
        .expect(201);

      expect(response.body.emoji).toBe('👋');
    });
  });

  describe('GET /api/db/users', () => {
    test('should return 400 when no name or id is provided', async() => {
      const response = await request(app)
        .get('/api/db/users')
        .expect(400);

      expect(response.text).toBe('Please provide a name or ID');
    });

    test('should accept name query parameter', async() => {
      // This test just verifies the endpoint accepts the parameter
      // Actual database queries are tested separately
      await request(app)
        .get('/api/db/users?name=test')
        .expect((res) => {
          // Accept either 200 (found) or 404 (not found) as valid responses
          expect([200, 404]).toContain(res.status);
        });
    });

    test('should accept id query parameter', async() => {
      // This test just verifies the endpoint accepts the parameter
      // Actual database queries are tested separately
      await request(app)
        .get('/api/db/users?id=test-id')
        .expect((res) => {
          // Accept either 200 (found) or 404 (not found) as valid responses
          expect([200, 404]).toContain(res.status);
        });
    });
  });
});
//AI_end
