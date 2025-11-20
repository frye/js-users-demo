//AI_start
# Implement Unit Tests (Parity with `frye/js-users-demo` #18)

- **Source issue:** https://github.com/frye/js-users-demo/issues/18
- **Intent:** Guarantee this Express/Sequelize codebase has comprehensive Jest coverage across handlers, services, and SQLite helpers so it matches the expectations tracked upstream in `frye/js-users-demo`.

## Proposed Scope
- Audit existing Jest/Supertest coverage for `routes`, `users`, and DB helpers.
- Add regression tests for happy-path and failure scenarios, mirroring behaviors that exist in the upstream issue (validation, persistence edge cases, error propagation).
- Document how to run the suite (`npm test`, `npm run test:watch`, CI integration) so contributors can align on the same workflow.
- Enforce linting/formatting in tests (ESLint + Prettier) to keep style consistent with production modules.

## Acceptance Criteria
- [ ] Every public controller has both success and failure-path tests.
- [ ] Database helper logic is validated using the SQLite test harness.
- [ ] Test guidance README section updated if gaps exist.
- [ ] CI status badge or coverage metric reflects new tests.

## Notes
- Keep scope focused on testing; do not introduce new features while adding coverage.
- Prefer Supertest for HTTP flows and plain Jest mocks/spies for service layers to stay idiomatic to the Node ecosystem.
- Snapshot tests should be limited to payloads that rarely change to avoid brittle expectations.

```js
// __tests__/routes.test.js
// Ensures GET /api/users always returns sanitized payloads
const express = require('express');
const request = require('supertest');
const routes = require('../src/routes');

const app = express();
app.use(express.json());
app.use('/api', routes);

describe('GET /api/users', () => {
	it('responds with a user list', async() => {
		const response = await request(app).get('/api/users').expect(200);

		expect(response.body).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					id: expect.any(String),
					name: expect.any(String),
				}),
			])
		);
	});
});
```
//AI_end