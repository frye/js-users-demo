// users.test.js:
// Unit tests for the users module

//AI_start
const { users } = require('../src/users');

describe('Users Module', () => {
  test('users array should be defined', () => {
    expect(users).toBeDefined();
  });

  test('users array should be an array', () => {
    expect(Array.isArray(users)).toBe(true);
  });

  test('users array should contain at least one user', () => {
    expect(users.length).toBeGreaterThan(0);
  });

  test('each user should have required properties', () => {
    users.forEach((user) => {
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('emoji');
    });
  });

  test('each user id should be a string', () => {
    users.forEach((user) => {
      expect(typeof user.id).toBe('string');
    });
  });

  test('each user name should be a string', () => {
    users.forEach((user) => {
      expect(typeof user.name).toBe('string');
    });
  });

  test('each user emoji should be a string', () => {
    users.forEach((user) => {
      expect(typeof user.emoji).toBe('string');
    });
  });

  test('user ids should be unique', () => {
    const ids = users.map((user) => user.id);
    const uniqueIds = [...new Set(ids)];
    expect(ids.length).toBe(uniqueIds.length);
  });
});
//AI_end
