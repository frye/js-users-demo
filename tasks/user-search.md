//AI_start
# Implement User Search and Filtering (`frye/js-users-demo` #12)

- **Source issue:** https://github.com/frye/js-users-demo/issues/12
- **Intent:** Allow clients to filter `GET /users` results by name query parameters, matching the requirements captured in `frye/js-users-demo`.

## Proposed Scope
- Add optional `name` query param handling in `routes.js`/`users.js` that performs case-insensitive matching via Sequelize.
- Ensure DB queries are parameterized to avoid injection and support partial matches (`%needle%`).
- Extend tests to cover matching, non-matching, and missing parameter cases.
- Add pagination-friendly structure to responses so filters can scale later.

## Acceptance Criteria
- [ ] `GET /users?name=John` returns only matching rows.
- [ ] Empty `name` parameter falls back to returning all users.
- [ ] Tests cover positive/negative permutations.
- [ ] API docs updated to describe filtering behavior.

## Notes
- Consider adding indexes/virtual columns if filtering needs performance tuning later.
- Keep query parsing logic simple and well-documented.
- Log filter usage at debug level to assist troubleshooting while keeping PII safe.

```js
// src/routes.js
// Applies case-insensitive filtering while preventing SQL injection
const { Op } = require('sequelize');

router.get('/db/users', async(req, res) => {
	const { name } = req.query;
	const where = name ? { name: { [Op.like]: `%${name}%` } } : undefined;

	const records = await db.user.findAll({ where, order: [['name', 'ASC']] });
	res.json(records);
});
```
//AI_end