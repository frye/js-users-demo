//AI_start
// users.test.js:
// Unit tests for the users module to verify user data structure and functionality

const { users } = require('../src/users');

describe('Users Module', () => {
  // Test that users array exists and is an array
  test('users should be an array', () => {
    expect(Array.isArray(users)).toBe(true);
  });

  // Test that users array is not empty
  test('users array should not be empty', () => {
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

  // Test that each user has a valid UUID for id
  test('each user id should be a valid string', () => {
    users.forEach((user) => {
      expect(typeof user.id).toBe('string');
      expect(user.id.length).toBeGreaterThan(0);
    });
  });

  // Test that each user has a valid name
  test('each user name should be a non-empty string', () => {
    users.forEach((user) => {
      expect(typeof user.name).toBe('string');
      expect(user.name.length).toBeGreaterThan(0);
    });
  });

  // Test that each user has a valid emoji
  test('each user emoji should be a non-empty string', () => {
    users.forEach((user) => {
      expect(typeof user.emoji).toBe('string');
      expect(user.emoji.length).toBeGreaterThan(0);
    });
  });

  // Test that all user IDs are unique
  test('all user IDs should be unique', () => {
    const ids = users.map((user) => user.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});
//AI_end
