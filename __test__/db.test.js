const { v4: uuidv4 } = require('uuid');
const { db, user } = require('../src/db');

// Mock UUID to have consistent IDs in tests
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-db-uuid-12345')
}));

describe('Database Operations', () => {
  // Use a test database connection
  let testUser;
  
  beforeAll(async () => {
    // Ensure the database is synced
    await db.sync({ force: true }); // This will recreate tables
  });
  
  afterAll(async () => {
    // Close the database connection
    await db.close();
  });
  
  beforeEach(async () => {
    // Create a test user before each test
    testUser = await user.create({
      id: uuidv4(),
      name: 'Test Database User',
      emoji: '🗃️'
    });
  });
  
  afterEach(async () => {
    // Clean up database after each test
    await user.destroy({ where: {}, truncate: true });
  });
  
  describe('User Model', () => {
    test('should create a new user', async () => {
      const newUser = {
        id: 'custom-id-123',
        name: 'New Database User',
        emoji: '💾'
      };
      
      const createdUser = await user.create(newUser);
      
      expect(createdUser.id).toBe('custom-id-123');
      expect(createdUser.name).toBe('New Database User');
      expect(createdUser.emoji).toBe('💾');
      
      // Verify user was persisted to database
      const foundUser = await user.findByPk('custom-id-123');
      expect(foundUser).not.toBeNull();
      expect(foundUser.name).toBe('New Database User');
    });
    
    test('should find a user by primary key (id)', async () => {
      const foundUser = await user.findByPk(testUser.id);
      
      expect(foundUser).not.toBeNull();
      expect(foundUser.id).toBe(testUser.id);
      expect(foundUser.name).toBe('Test Database User');
      expect(foundUser.emoji).toBe('🗃️');
    });
    
    test('should update a user', async () => {
      const updatedName = 'Updated Database User';
      
      await user.update({ name: updatedName }, {
        where: { id: testUser.id }
      });
      
      const updatedUser = await user.findByPk(testUser.id);
      expect(updatedUser.name).toBe(updatedName);
      expect(updatedUser.emoji).toBe('🗃️'); // Unchanged
    });
    
    test('should delete a user', async () => {
      await user.destroy({
        where: { id: testUser.id }
      });
      
      const deletedUser = await user.findByPk(testUser.id);
      expect(deletedUser).toBeNull();
    });
  });
  
  describe('Database Queries', () => {
    test('should find users by name', async () => {
      // Create additional users with same name
      await user.create({
        id: 'same-name-1',
        name: 'Same Name User',
        emoji: '👤'
      });
      
      await user.create({
        id: 'same-name-2',
        name: 'Same Name User',
        emoji: '👥'
      });
      
      const query = "SELECT * FROM users WHERE name = 'Same Name User'";
      const result = await db.query(query, {
        type: db.QueryTypes.SELECT
      });
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      expect(result.some(u => u.id === 'same-name-1')).toBe(true);
      expect(result.some(u => u.id === 'same-name-2')).toBe(true);
    });
  });
});