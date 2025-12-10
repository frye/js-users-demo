//AI_start
# Implement Unit Tests for User Profile REST API (`frye/js-users-demo` #16)

- **Source issue:** https://github.com/frye/js-users-demo/issues/16
- **Intent:** Provide controller-level coverage (HomePageHandler, GetUsers, GetUser, CreateUser, UpdateUser) for the Express implementation so it satisfies the upstream tracking issue in `frye/js-users-demo`.

## Proposed Scope
- Mirror upstream scenarios with Jest + Supertest: success, not-found, and validation errors.
- Stub DB interactions with the SQLite memory database or a Sequelize mock adapter to keep tests deterministic.
- Exclude delete-related flows until feature parity exists locally (same constraint as upstream).
- Use factory helpers/fixtures to reduce duplication across controller suites.

## Acceptance Criteria
- [ ] Dedicated spec files per controller exporting clear GIVEN/WHEN/THEN cases.
- [ ] Negative-path tests assert HTTP status codes and payload shape.
- [ ] Test run documented (`npm test -- users`) so contributors know how to execute this subset.

## Notes
- Reuse fixtures from existing tests to limit duplication.
- Align naming conventions with upstream so issue tracking stays consistent.
- Prefer `describe` blocks that match the HTTP verb + path to keep reports skimmable.

```js
// __tests__/users.controller.test.js
// Validates the GET /api/users/:id controller handles missing IDs
const express = require('express');
const request = require('supertest');
const routes = require('../src/routes');

const app = express();
app.use(express.json());
app.use('/api', routes);

describe('GET /api/users/:id', () => {
	it('returns 404 when the user does not exist', async() => {
		await request(app).get('/api/users/non-existent-id').expect(404);
	});
});
```
//AI_end