# JavaScript Users Demo — Workflow Guide

This guide shows how to accomplish the requested tasks using GitHub Copilot agents in VS Code: **Copilot Plan Mode** (for structured planning), **Copilot Agent Mode** (for executing changes), **Mission Control** (to observe agent runs), and **Copilot Chat** (to review changes). You'll work in a fork of `js-users-demo`, plan unit tests and delete functionality, create a tracking issue, implement tests via Agent Mode, observe execution, and review changes.

## How Copilot Agents Help

- **Copilot Plan Mode**: Produces clear, sequenced plans for features and tests before implementation.
- **Copilot Agent Mode**: Executes changes in your fork (editing files, running builds/tests) following your plans.
- **Mission Control**: Observes the Agent's actions, tool calls, diffs, and test runs in real time.
- **Copilot Chat**: Assists with code reviews, summarizes diffs, explains failures, and suggests fixes.

## Quick Start

- **Fork and clone**: Create a fork on GitHub, then `git clone` your fork; set upstream to original.
- **Branch**: `git checkout -b feature/tests-and-delete`.
- **Build check**: Verify Node.js and npm are installed (`node -v`, `npm -v`), then run `npm install` to install dependencies.

## Repository Summary and Gaps

### Structure

- **`src/index.js`**: Express server entrypoint that serves the web UI and loads API routes.
- **`src/routes.js`**: Express router defining REST endpoints (`/api/users`, `/api/users/:id`).
- **`src/users.js`**: In-memory user store with hardcoded sample data (Bramble Fright 👻, Sylvie Scream 🎃, Eve Eerie 🧙).
- **`src/db.js`**: SQLite database helper (for persistence - currently unused in main flow).
- **`src/redoc.js`**: ReDoc endpoint serving OpenAPI documentation from `openapi.yaml`.
- **`src/openapi.yaml`**: OpenAPI 3 spec defining the API contract.
- **`package.json`**: Dependencies include Express, Sequelize, sqlite3, uuid, @faker-js/faker.

### Implemented Endpoints

- **`GET /api/users`**: Returns array of all users (200 OK).
- **`GET /api/users/:id`**: Returns single user by UUID or 404 if not found.
- **`POST /api/users`**: Creates new user, returns created user with generated UUID (201 Created).
- **`PUT /api/users/:id`**: Updates existing user, returns updated user (200 OK) or 404 if not found.

### Constraints

- **Node.js 16+**, Express.js; minimal dependencies for core functionality.
- **In-memory storage**: Users stored in a plain JavaScript array in `users.js`.
- **Default values**: When creating users, missing `name` defaults to `"Anonymous"`, missing `emoji` defaults to wave `"👋"`.

### Gaps

- **No DELETE method**: No endpoint or handler for deleting users.
- **No unit tests**: No Jest/Supertest tests for routes or user service logic.
- **No CI**: No GitHub Actions workflow for automated testing.

## Tasks and Agent Usage (with Sample Prompts)

Use these agents and prompts to drive each task efficiently. Run prompts in **Copilot Plan Mode** for planning and **Copilot Agent Mode** for execution. Observe runs with **Mission Control** and review with **Copilot Chat**.

### Task 1: Plan Unit Test Generation (Plan Mode)

- **Purpose**: Produce the unit test strategy before coding.
- **Sample prompt (Plan Mode)**:
  
  > "Plan unit tests for routes.js and users.js in js-users-demo per project guidance. Include files, coverage points, status codes (200, 201, 404), default values for missing fields, and minimal dependencies using Jest and Supertest."

### Task 2: Plan Delete Functionality (Plan Mode)

- **Purpose**: Define service and API changes for delete.
- **Sample prompt (Plan Mode)**:
  
  > "Plan DELETE /api/users/:id implementation: add delete function to users.js, create @delete route in routes.js returning 204 No Content on success and 404 on missing user, update README with endpoint documentation, and create test plan."

### Task 3: Create GitHub Issue (Agent Mode + GitHub MCP)

- **Purpose**: Track delete implementation in your fork.
- **Sample prompt (Agent Mode, GitHub MCP)**:
  
  > "Create an issue in my fork your-username/js-users-demo titled 'Add DELETE /api/users/:id endpoint and user delete function' with requirements, files, and acceptance criteria as specified. Label enhancement, backend; assign to me."

### Task 4: Implement Unit Test Plan (Agent Mode, read upstream issue with MCP)

- **Purpose**: Execute the unit test plan using the tracking issue as the exact prompt via GitHub MCP.
- **How to read and use the issue with MCP**:
  - Ensure GitHub MCP is connected with a PAT (`repo` scope) in VS Code.
  - Ask the Agent: "Fetch the latest open issue titled 'Add DELETE /api/users/:id endpoint and user delete function' from my fork and display its body."
  - Copy the full issue body and use it verbatim as the Agent prompt for implementation.
- **Sample prompt (Agent Mode)**:
  
  > "Using the upstream tracking issue content verbatim, implement the unit test plan: add jest and supertest to package.json as devDependencies; create __tests__/routes.test.js and __tests__/users.test.js with the specified coverage; run npm test and fix failures aligned with default value semantics (name defaults to 'Anonymous', emoji to '👋'). Commit and push a PR referencing the issue."

### Task 5: Observe Agent Execution (Mission Control)

- **Purpose**: Monitor the agent's actions and test runs.
- **Sample prompt (Mission Control context)**:
  
  > "Start observing the unit test implementation run. Mark checkpoints after package.json edit, after each test file creation, and after successful npm test. Surface failures and suggest corrections."

### Task 6: Code Review with Copilot (Copilot Chat)

- **Purpose**: Review changes, summarize diffs, and suggest fixes.
- **Sample prompts (Copilot Chat)**:
  
  > "Summarize changes in users.js, routes.js, and test files. Identify potential issues and suggest minimal fixes."
  
  > "Explain failing tests and propose corrections consistent with project guidance (status codes, default values, minimal dependencies)."
  
  > "Generate a review checklist covering service/route paths (create/update/find/delete), 404 handling, 201/200/204 status codes, and README updates."

## Detailed Steps

### Task 1: Copilot Plan Mode — Unit Test Generation

- **Add test dependencies** in `package.json`: Include `jest` and `supertest` in `devDependencies`.
- **Update test script** in `package.json`: Set `"test": "jest"` or `"test": "jest --coverage"`.
- **Create test files**:
  - `__tests__/users.test.js`
  - `__tests__/routes.test.js`

#### `users.test.js` coverage

- `getAllUsers()` returns all seeded users in array.
- `getUserById(id)` returns user object when found, `undefined` when missing.
- `createUser(userData)` generates UUID, applies defaults: name `"Anonymous"`, emoji `"👋"` when absent/blank.
- `updateUser(id, updates)` updates provided fields, retains others; returns `undefined` if id missing.
- Seed users exist: "Bramble Fright" 👻, "Sylvie Scream" 🎃, "Eve Eerie" 🧙.

#### `routes.test.js` coverage (with Supertest)

- **`GET /api/users`**: Returns 200, JSON array of users.
- **`GET /api/users/:id`**: Returns 200 with user object for existing UUID, 404 for missing.
- **`POST /api/users`**: Returns 201 Created with user object; tests default values.
- **`PUT /api/users/:id`**: Returns 200 with updated user for existing UUID, 404 for missing.

- Align tests with default value semantics. Keep dependencies minimal (Jest, Supertest).

### Task 2: Copilot Plan Mode — Delete Functionality

- **Service**: Add `deleteUser(id)` function in `users.js` to remove existing user from array or return `undefined` if not found.
- **Route**: Add `router.delete('/users/:id', ...)` in `routes.js` returning 204 No Content on success; 404 on missing user.
- **Documentation**: Update `README.md` with DELETE endpoint behavior and status codes.
- **Optional UI**: Add delete button and `fetch('/api/users/${id}', { method: 'DELETE' })` in `index.js` HTML template.
- **Tests**: Plan service and route delete tests (added in Task 4 execution).

### Task 3: Agent Mode + GitHub MCP — Create Issue

- **Configure GitHub MCP** with PAT (`repo` scope) in VS Code.
- **Start Copilot Agent Mode** with GitHub MCP provider.
- **Create issue** in `your-username/js-users-demo`:
  - **Title**: `Add DELETE /api/users/:id endpoint and user delete function`
  - **Body**: Summary, requirements (deleteUser function, router.delete mapping, README updates, unit tests), files, acceptance criteria.
  - **Labels**: `enhancement`, `backend`. **Assignee**: yourself. Verify on GitHub.

### Task 4: Agent Mode — Implement Unit Test Plan (Read Upstream Issue as Prompt)

- **Start by reading** the upstream tracking issue content (created in Task 3) and use it verbatim as the Agent Mode prompt. This ensures the agent executes exactly against the acceptance criteria and file targets from the issue.
- **Validate Node.js/npm**: `node -v`, `npm -v`; install if needed.
- **Update `package.json`**: Add `jest` and `supertest` in `devDependencies`. Set `"test": "jest"` script.
- **Implement `users.test.js`**: Test seed data, `getUserById`, `createUser` defaults, `updateUser` behavior.
- **Implement `routes.test.js`**: Use Supertest to test all REST endpoints (GET, POST, PUT).
- **Run tests**: `npm test`; fix failures aligned with default value semantics.
- **Commit/push**: `git add package.json __tests__/` → commit → push → open PR referencing the issue.

### Task 5: Mission Control — Observe Agent Execution

- **Open Mission Control** panel; start Agent run for Task 4.
- **Observe** file edits (`package.json`, test files), tool calls, and `npm test` execution.
- **Checkpoints**: After dependency addition, after each test file creation, after successful test run.
- **Intervene** with guidance if the agent stalls or assertions fail.
- **Export logs/diffs** for review.

### Task 6: Code Review — Review with Copilot

- **Enable Copilot Chat**.
- **Summarize diffs** in `users.js`, `routes.js`, and tests; ask Copilot for potential issues.
- **Validate**: `npm test`; ask Copilot to explain failures and propose minimal fixes.
- **Checklist**: Coverage (create/update/find/delete), 404 handling and status codes (201/200/204), minimal deps, README updates.
- **Provide PR feedback** using Copilot suggestions; request changes or approve when criteria are met.

## Troubleshooting

- **Node.js/npm not found**: Install Node.js (version 16+) from [nodejs.org](https://nodejs.org).
- **npm install fails**: Check network/proxy settings; clear npm cache (`npm cache clean --force`).
- **Test failures due to default values**: Verify `createUser` applies `"Anonymous"` for missing name, `"👋"` for missing emoji; adjust tests accordingly.
- **404/response mismatches**: Confirm routes return proper status codes; for DELETE, return 204 on success, 404 on missing user.
- **Jest not found**: Ensure `jest` is in `devDependencies` and installed (`npm install`); run `npx jest` if PATH issues persist.
- **Express server issues**: Check port 3000 is not in use; verify `src/index.js` starts correctly (`npm start`).

## Additional Resources

- **Express.js Documentation**: [expressjs.com](https://expressjs.com)
- **Jest Documentation**: [jestjs.io](https://jestjs.io)
- **Supertest Documentation**: [github.com/visionmedia/supertest](https://github.com/visionmedia/supertest)
- **GitHub Copilot**: [docs.github.com/copilot](https://docs.github.com/copilot)
- **OpenAPI Specification**: [spec.openapis.org/oas/v3.0.3](https://spec.openapis.org/oas/v3.0.3)
