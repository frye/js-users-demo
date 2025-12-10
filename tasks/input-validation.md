//AI_start
# Implement Input Validation for User Creation (`frye/js-users-demo` #13)

- **Source issue:** https://github.com/frye/js-users-demo/issues/13
- **Intent:** Enforce required fields (e.g., `fullName`) when creating/updating users to satisfy the validation goals recorded in `frye/js-users-demo`.

## Proposed Scope
- Add validation middleware (e.g., `express-validator` or `zod-express-middleware`) for POST/PUT routes.
- Return `400 Bad Request` responses with actionable error messages when validation fails.
- Cover validation logic with Jest + Supertest to prevent regressions.
- Normalize validation errors into a single format (`{ errors: [{ field, message }] }`).

## Acceptance Criteria
- [ ] `fullName` (and other critical fields) cannot be empty or missing.
- [ ] Error payload structure documented and consistent across endpoints.
- [ ] Tests cover missing fields, invalid types, and happy path.
- [ ] README/API docs updated to mention validation rules.

## Notes
- Keep logic centralized so additional fields/constraints can be added easily.
- Align status codes/messages with what upstream service returns for parity.
- Surface validation rules inside README/API docs for quick reference.

```js
// src/routes.js
// Validates request bodies before using the existing handler
const { body, validationResult } = require('express-validator');

router.post(
	'/users',
	body('name').trim().notEmpty().withMessage('name is required'),
	(req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const id = req.body.id || uuidv4();
		const emoji = req.body.emoji || '👋';
		const user = { id, name: req.body.name, emoji };

		users.push(user);
		res.status(201).json(user);
	}
);
```
//AI_end