// Setup file for Jest tests
// This file runs before tests and can be used to configure Jest

// Set timeout for tests (optional)
jest.setTimeout(10000);

// Suppress console.log during tests
global.console = {
  ...console,
  // Uncomment below to silence logs in tests
  // log: jest.fn(),
};