//AI_start
/**
 * Unit tests for db.js module
 * Tests database connection and user model
 */

const { db, user } = require('../db');
const { Sequelize } = require('sequelize');

describe('db module', () => {
  // Test database connection
  describe('database connection', () => {
    test('should export db object', () => {
      expect(db).toBeDefined();
      expect(db).toBeInstanceOf(Sequelize);
    });

    test('should be configured with sqlite dialect', () => {
      expect(db.options.dialect).toBe('sqlite');
    });

    test('should have storage configured', () => {
      expect(db.options.storage).toBeDefined();
    });
  });

  // Test user model
  describe('user model', () => {
    test('should export user model', () => {
      expect(user).toBeDefined();
    });

    test('should have correct table name', () => {
      expect(user.tableName).toBe('users');
    });

    test('should have id field defined', () => {
      const idAttribute = user.rawAttributes.id;
      expect(idAttribute).toBeDefined();
      expect(idAttribute.primaryKey).toBe(true);
      expect(idAttribute.type.constructor.name).toBe('STRING');
    });

    test('should have name field defined', () => {
      const nameAttribute = user.rawAttributes.name;
      expect(nameAttribute).toBeDefined();
      expect(nameAttribute.type.constructor.name).toBe('STRING');
    });

    test('should have emoji field defined', () => {
      const emojiAttribute = user.rawAttributes.emoji;
      expect(emojiAttribute).toBeDefined();
      expect(emojiAttribute.type.constructor.name).toBe('STRING');
    });
  });

  // Test database operations
  describe('database operations', () => {
    beforeAll(async() => {
      // Sync database before running tests
      await db.sync({ force: true });
    });

    afterAll(async() => {
      // Clean up and close connection after tests
      await db.close();
    });

    test('should be able to create a user', async() => {
      const testUser = {
        id: 'test-id-123',
        name: 'Test User',
        emoji: '🧪',
      };

      const createdUser = await user.create(testUser);
      expect(createdUser).toBeDefined();
      expect(createdUser.id).toBe(testUser.id);
      expect(createdUser.name).toBe(testUser.name);
      expect(createdUser.emoji).toBe(testUser.emoji);
    });

    test('should be able to find a user by id', async() => {
      const testUser = {
        id: 'test-id-456',
        name: 'Find Test User',
        emoji: '🔍',
      };

      await user.create(testUser);
      const foundUser = await user.findOne({ where: { id: testUser.id } });
      
      expect(foundUser).toBeDefined();
      expect(foundUser.id).toBe(testUser.id);
      expect(foundUser.name).toBe(testUser.name);
    });

    test('should be able to update a user', async() => {
      const testUser = {
        id: 'test-id-789',
        name: 'Update Test User',
        emoji: '✏️',
      };

      await user.create(testUser);
      await user.update(
        { name: 'Updated Name' },
        { where: { id: testUser.id } }
      );

      const updatedUser = await user.findOne({ where: { id: testUser.id } });
      expect(updatedUser.name).toBe('Updated Name');
    });

    test('should be able to delete a user', async() => {
      const testUser = {
        id: 'test-id-delete',
        name: 'Delete Test User',
        emoji: '🗑️',
      };

      await user.create(testUser);
      await user.destroy({ where: { id: testUser.id } });

      const deletedUser = await user.findOne({ where: { id: testUser.id } });
      expect(deletedUser).toBeNull();
    });
  });
});
//AI_end
