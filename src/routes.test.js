//AI_start
// routes.test.js:
// This file contains unit tests for the users API routes.
// Tests cover all CRUD operations: Create (POST), Read (GET), Update (PUT), and Delete (DELETE)

const request = require('supertest');
const app = require('./index');
const { users } = require('./users');

describe('Users API', () => {
  // Store the initial users array to reset after each test
  let initialUsers;

  beforeEach(() => {
    // Save a copy of the initial users array
    initialUsers = [...users];
  });

  afterEach(() => {
    // Reset the users array to its initial state after each test
    users.length = 0;
    users.push(...initialUsers);
  });

  describe('GET /api/users', () => {
    it('should return all users', async () => {
      const response = await request(app).get('/api/users');
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return users with correct properties', async () => {
      const response = await request(app).get('/api/users');
      expect(response.status).toBe(200);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('emoji');
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a specific user by ID', async () => {
      // Get the first user from the users array
      const firstUser = users[0];
      
      const response = await request(app).get(`/api/users/${firstUser.id}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', firstUser.id);
      expect(response.body).toHaveProperty('name', firstUser.name);
    });

    it('should return 404 if user is not found', async () => {
      const response = await request(app).get('/api/users/nonexistent-id');
      expect(response.status).toBe(404);
      expect(response.text).toBe('User not found');
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const newUser = {
        name: 'Test User',
        emoji: '🧪'
      };

      const response = await request(app)
        .post('/api/users')
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', newUser.name);
      expect(response.body).toHaveProperty('emoji', newUser.emoji);
    });

    it('should create a user with default emoji if not provided', async () => {
      const newUser = {
        name: 'Test User Without Emoji'
      };

      const response = await request(app)
        .post('/api/users')
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('emoji', '👋');
    });

    it('should create a user with custom ID if provided', async () => {
      const customId = 'custom-test-id-123';
      const newUser = {
        id: customId,
        name: 'Test User With Custom ID',
        emoji: '🆔'
      };

      const response = await request(app)
        .post('/api/users')
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id', customId);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update an existing user', async () => {
      // Get the first user from the users array
      const firstUser = users[0];
      const updatedName = 'Updated User Name';

      const response = await request(app)
        .put(`/api/users/${firstUser.id}`)
        .send({ name: updatedName });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', firstUser.id);
      expect(response.body).toHaveProperty('name', updatedName);
    });

    it('should return 404 if user to update is not found', async () => {
      const response = await request(app)
        .put('/api/users/nonexistent-id')
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(404);
      expect(response.text).toBe('User not found');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete an existing user', async () => {
      // Get the first user from the users array
      const firstUser = users[0];
      const initialLength = users.length;

      const response = await request(app).delete(`/api/users/${firstUser.id}`);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
      
      // Verify the user was actually deleted from the array
      expect(users.length).toBe(initialLength - 1);
      expect(users.find(u => u.id === firstUser.id)).toBeUndefined();
    });

    it('should return 404 if user to delete is not found', async () => {
      const response = await request(app).delete('/api/users/nonexistent-id');

      expect(response.status).toBe(404);
      expect(response.text).toBe('User not found');
    });

    it('should not affect other users when deleting one user', async () => {
      // Get the first user from the users array
      const firstUser = users[0];
      const secondUser = users[1];
      const initialLength = users.length;

      await request(app).delete(`/api/users/${firstUser.id}`);

      // Verify the second user still exists
      expect(users.length).toBe(initialLength - 1);
      expect(users.find(u => u.id === secondUser.id)).toBeDefined();
    });
  });
});
//AI_end
