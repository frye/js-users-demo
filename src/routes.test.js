const request = require('supertest');
const express = require('express');
const router = require('./routes');
const { users } = require('./users');
const db = require('./db');

// filepath: /Users/frye/Repos/Demo/copilot-demo/src/routes.test.js

const app = express();
app.use(express.json());
app.use('/', router);

jest.mock('./db');

describe('Users API', () => {
  beforeEach(() => {
    users.length = 0; // Clear the users array before each test
  });

  test('POST /users - should create a new user', async () => {
    const response = await request(app)
      .post('/users')
      .send({ name: 'John Doe' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('John Doe');
    expect(response.body.emoji).toBe('👋');
  });

  test('GET /users - should get all users', async () => {
    users.push({ id: '1', name: 'John Doe', emoji: '👋' });

    const response = await request(app).get('/users');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(users);
  });

  test('GET /users/:id - should get a user by ID', async () => {
    users.push({ id: '1', name: 'John Doe', emoji: '👋' });

    const response = await request(app).get('/users/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(users[0]);
  });

  test('PUT /users/:id - should update a user by ID', async () => {
    users.push({ id: '1', name: 'John Doe', emoji: '👋' });

    const response = await request(app)
      .put('/users/1')
      .send({ name: 'Jane Doe' });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Jane Doe');
  });

  test('DELETE /users/:id - should delete a user by ID', async () => {
    users.push({ id: '1', name: 'John Doe', emoji: '👋' });

    const response = await request(app).delete('/users/1');

    expect(response.status).toBe(204);
    expect(users.length).toBe(0);
  });

  test('POST /db/users - should create a new user in the database', async () => {
    db.user.create.mockResolvedValue({ id: '1', name: 'John Doe', emoji: '👋' });

    const response = await request(app)
      .post('/db/users')
      .send({ name: 'John Doe' });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ id: '1', name: 'John Doe', emoji: '👋' });
  });

  test('GET /db/users - should fetch a user from the database by name', async () => {
    db.db.query.mockResolvedValue([{ id: '1', name: 'John Doe', emoji: '👋' }]);

    const response = await request(app).get('/db/users?name=John Doe');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: '1', name: 'John Doe', emoji: '👋' }]);
  });

  test('GET /db/users - should fetch a user from the database by ID', async () => {
    db.user.findAll.mockResolvedValue([{ id: '1', name: 'John Doe', emoji: '👋' }]);

    const response = await request(app).get('/db/users?id=1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: '1', name: 'John Doe', emoji: '👋' }]);
  });
});