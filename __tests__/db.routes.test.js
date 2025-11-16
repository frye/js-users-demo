// db.routes.test.js:
// Integration tests for database routes

//AI_start
const request = require('supertest');
const app = require('../src/index');
const db = require('../src/db');

// Set test environment
process.env.NODE_ENV = 'test';

// Mock database to avoid actual database operations during tests
jest.mock('../src/db', () => {
  return {
    db: {
      query: jest.fn(),
    },
    user: {
      create: jest.fn(),
      findAll: jest.fn(),
      SELECT: 'SELECT',
    },
  };
});

describe('Database Routes', () => {
  // Clear mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/db/users', () => {
    test('should create a new user in the database', async() => {
      const newUser = {
        name: 'Database Test User',
        emoji: '💾',
      };

      // Mock successful create
      db.user.create.mockResolvedValue({
        id: expect.any(String),
        name: newUser.name,
        emoji: newUser.emoji,
      });

      const response = await request(app)
        .post('/api/db/users')
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newUser.name);
      expect(response.body.emoji).toBe(newUser.emoji);
      expect(db.user.create).toHaveBeenCalled();
    });

    test('should use default emoji if not provided', async() => {
      const newUser = {
        name: 'Database Test User 2',
      };

      db.user.create.mockResolvedValue({
        id: expect.any(String),
        name: newUser.name,
        emoji: '👋',
      });

      const response = await request(app)
        .post('/api/db/users')
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body.emoji).toBe('👋');
    });
  });

  describe('GET /api/db/users', () => {
    test('should fetch user by name from database', async() => {
      const mockUser = [
        {
          id: 'test-id',
          name: 'Test User',
          emoji: '🎯',
        },
      ];

      db.db.query.mockResolvedValue(mockUser);

      const response = await request(app)
        .get('/api/db/users')
        .query({ name: 'Test User' });

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(db.db.query).toHaveBeenCalled();
    });

    test('should fetch user by id from database', async() => {
      const mockUser = [
        {
          id: 'test-id-123',
          name: 'Test User',
          emoji: '🎯',
        },
      ];

      db.user.findAll.mockResolvedValue(mockUser);

      const response = await request(app)
        .get('/api/db/users')
        .query({ id: 'test-id-123' });

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(db.user.findAll).toHaveBeenCalledWith({
        where: {
          id: 'test-id-123',
        },
      });
    });

    test('should return 400 if neither name nor id is provided', async() => {
      const response = await request(app).get('/api/db/users');

      expect(response.status).toBe(400);
      expect(response.text).toContain('Please provide a name or ID');
    });
  });
});
//AI_end
