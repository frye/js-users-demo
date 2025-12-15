//AI_start
// db.test.js:
// Unit tests for the database module to verify database connection and user model

const db = require('../src/db');

describe('Database Module', () => {
  // Test that db object is exported
  test('should export db object', () => {
    expect(db).toHaveProperty('db');
    expect(db.db).toBeDefined();
  });

  // Test that user model is exported
  test('should export user model', () => {
    expect(db).toHaveProperty('user');
    expect(db.user).toBeDefined();
  });

  // Test that database connection is authenticated
  test('should authenticate database connection', async () => {
    await expect(db.db.authenticate()).resolves.not.toThrow();
  });

  // Test that user model has correct attributes
  test('user model should have id, name, and emoji attributes', () => {
    const attributes = db.user.getAttributes();
    expect(attributes).toHaveProperty('id');
    expect(attributes).toHaveProperty('name');
    expect(attributes).toHaveProperty('emoji');
  });

  // Test that id is the primary key
  test('id should be the primary key', () => {
    const attributes = db.user.getAttributes();
    expect(attributes.id.primaryKey).toBe(true);
  });
});
//AI_end
