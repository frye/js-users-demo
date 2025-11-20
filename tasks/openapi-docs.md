//AI_start
# Add Swagger/OpenAPI Documentation (`frye/js-users-demo` #14)

- **Source issue:** https://github.com/frye/js-users-demo/issues/14
- **Intent:** Provide interactive API documentation (Swagger UI) for the Express service so it aligns with the upstream documentation expectations in `frye/js-users-demo`.

## Proposed Scope
- Adopt `swagger-jsdoc` + `swagger-ui-express` (or equivalent) to generate docs from JSDoc annotations.
- Annotate all route handlers in `routes.js`/`users.js` with request/response schemas.
- Serve docs at `/docs` (or similar) and ensure static assets are bundled.
- Add integration test asserting the docs endpoint responds with 200 and returns the correct `content-type`.
- Include CI check (e.g., `npm run lint:openapi`) that ensures the generated spec stays valid.

## Acceptance Criteria
- [ ] OpenAPI spec generated during build/start and checked into repo if needed.
- [ ] `/docs` (or configured path) renders Swagger UI with all endpoints.
- [ ] Tests confirm endpoint availability.
- [ ] README updated with instructions for regenerating/updating docs.

## Notes
- Mirror field names/types from `src/openapi.yaml` if already defined to avoid drift.
- Consider CI check that fails when spec validation errors occur.
- Document how to regenerate the spec so contributors do not accidentally commit stale docs.

```js
// src/index.js
// Mounts Swagger UI with the generated spec
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const swaggerSpec = YAML.load(path.join(__dirname, 'openapi.yaml'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```
//AI_end