const request = require('supertest');
const express = require('express');
const routes = require('../src/routes');
const { users } = require('../src/users');

// Create a test app with the routes
const app = express();
app.use(express.json());
app.use('/', routes);

// Store original users for restoration after tests
const originalUsers = [...users];

// Mock UUID to have consistent IDs in tests
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-12345')
}));

describe('User API Routes', () => {
  // Reset users after each test to avoid test pollution
  afterEach(() => {
    // Reset the users array to its original state
    users.length = 0;
    originalUsers.forEach(user => users.push({...user}));
  });

  describe('GET /users', () => {
    test('should return all users', async () => {
      const res = await request(app).get('/users');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(originalUsers.length);
    });
  });

  describe('GET /users/:id', () => {
    test('should return a specific user by ID', async () => {
      const userId = users[0].id;
      const res = await request(app).get(`/users/${userId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe(userId);
      expect(res.body.name).toBe(users[0].name);
    });

    test('should return 404 if user not found', async () => {
      const res = await request(app).get('/users/nonexistent-id');
      expect(res.statusCode).toBe(404);
      expect(res.text).toBe('User not found');
    });
  });

  describe('POST /users', () => {
    test('should create a new user', async () => {
      const newUser = { name: 'Test User', emoji: '🧪' };
      const res = await request(app)
        .post('/users')
        .send(newUser)
        .set('Accept', 'application/json');

      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe(newUser.name);
      expect(res.body.emoji).toBe(newUser.emoji);
      expect(res.body.id).toBe('test-uuid-12345');

      // Verify the user was added to the array
      const addedUser = users.find(u => u.id === 'test-uuid-12345');
      expect(addedUser).toBeTruthy();
    });

    test('should assign default emoji if not provided', async () => {
      const newUser = { name: 'Test User No Emoji' };
      const res = await request(app)
        .post('/users')
        .send(newUser)
        .set('Accept', 'application/json');

      expect(res.statusCode).toBe(201);
      expect(res.body.emoji).toBe('👋'); // Default emoji
    });
  });

  describe('PUT /users/:id', () => {
    test('should update an existing user', async () => {
      const userToUpdate = users[0];
      const updatedName = 'Updated User Name';

      const res = await request(app)
        .put(`/users/${userToUpdate.id}`)
        .send({ name: updatedName })
        .set('Accept', 'application/json');

      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe(userToUpdate.id);
      expect(res.body.name).toBe(updatedName);

      // Verify the user was updated in the array
      const updatedUserInArray = users.find(u => u.id === userToUpdate.id);
      expect(updatedUserInArray.name).toBe(updatedName);
    });

    test('should return 404 if user to update not found', async () => {
      const res = await request(app)
        .put('/users/nonexistent-id')
        .send({ name: 'Updated Name' })
        .set('Accept', 'application/json');

      expect(res.statusCode).toBe(404);
      expect(res.text).toBe('User not found');
    });
  });

  describe('DELETE /users/:id', () => {
    test('should delete a user', async () => {
      // Create a temporary user for deletion
      const tempUser = {
        id: 'temp-delete-id',
        name: 'Temporary User',
        emoji: '👾'
      };
      users.push(tempUser);
      
      // Delete the temporary user
      const res = await request(app)
        .delete(`/users/temp-delete-id`);

      expect(res.statusCode).toBe(204);
      
      // Verify the user was removed from the array
      expect(users.find(u => u.id === 'temp-delete-id')).toBeUndefined();
    });

    test('should return 404 if user to delete not found', async () => {
      const res = await request(app)
        .delete('/users/nonexistent-id');

      expect(res.statusCode).toBe(404);
      expect(res.text).toBe('User not found');
    });
  });
});