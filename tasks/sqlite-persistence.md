//AI_start
# Implement SQLite Database Persistence (`frye/js-users-demo` #15)

- **Source issue:** https://github.com/frye/js-users-demo/issues/15
- **Intent:** Replace any in-memory data structures with persistent SQLite storage (via Sequelize) to match the persistence requirements captured in `frye/js-users-demo`.

## Proposed Scope
- Introduce migrations/models to back the `users` table with proper constraints and timestamps.
- Update `db.js` and `users.js` service layers to perform CRUD via Sequelize instead of arrays.
- Ensure seed/test data flows through SQLite (including `sqlite::memory:` for tests) so Jest + Supertest suites continue to pass.
- Centralize configuration via `dotenv` so local and CI environments stay in sync.

## Acceptance Criteria
- [ ] Application boots with SQLite connection and auto-migrates schema.
- [ ] CRUD endpoints operate solely against the database helper.
- [ ] New/updated tests cover DB reads, writes, and rollback scenarios.
- [ ] README documents setup (e.g., `DATABASE_URL`, migration steps).

## Notes
- Consider using an in-memory SQLite database for tests to keep runs fast.
- Keep API contract unchanged while swapping persistence details.
- Run migrations automatically during CI to catch schema drift early.

```js
// src/db.js
// Initializes Sequelize against SQLite with safe defaults
const { Sequelize, DataTypes } = require('sequelize');

const db = new Sequelize({
	dialect: 'sqlite',
	storage: process.env.DATABASE_URL || 'users.sqlite',
	logging: false,
});

const User = db.define('user', {
	id: {
		type: DataTypes.STRING,
		primaryKey: true,
	},
	name: DataTypes.STRING,
	emoji: DataTypes.STRING,
});

async function initialize() {
	await db.authenticate();
	await db.sync();
}

module.exports = { db, User, initialize };
```
//AI_end