//AI_start
/**
 * Unit tests for users.js module
 * Tests the users array structure and exports
 */

const { users } = require('../users');

describe('users module', () => {
  describe('users array', () => {
    // Test that users array exists and is exported
    test('should export users array', () => {
      expect(users).toBeDefined();
      expect(Array.isArray(users)).toBe(true);
    });

    // Test that users array contains at least one user
    test('should contain at least one user', () => {
      expect(users.length).toBeGreaterThan(0);
    });

    // Test that each user has required properties
    test('each user should have id, name, and emoji properties', () => {
      users.forEach((user) => {
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('emoji');
      });
    });

    // Test that each user's id is a string
    test('each user id should be a string', () => {
      users.forEach((user) => {
        expect(typeof user.id).toBe('string');
        expect(user.id.length).toBeGreaterThan(0);
      });
    });

    // Test that each user's name is a non-empty string
    test('each user name should be a non-empty string', () => {
      users.forEach((user) => {
        expect(typeof user.name).toBe('string');
        expect(user.name.length).toBeGreaterThan(0);
      });
    });

    // Test that each user's emoji is a non-empty string
    test('each user emoji should be a non-empty string', () => {
      users.forEach((user) => {
        expect(typeof user.emoji).toBe('string');
        expect(user.emoji.length).toBeGreaterThan(0);
      });
    });

    // Test that all user ids are unique
    test('all user ids should be unique', () => {
      const ids = users.map((user) => user.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });
  });
});
//AI_end
