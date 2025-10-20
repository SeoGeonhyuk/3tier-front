// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Suppress specific React warnings and debug logs that are expected in test environment
const originalError = console.error;
const originalWarn = console.warn;
const originalLog = console.log;

beforeAll(() => {
  console.error = (...args) => {
    // Suppress ReactDOMTestUtils.act deprecation warning - this is from React Testing Library internals
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('`ReactDOMTestUtils.act` is deprecated') ||
       args[0].includes('Warning: An update to') && args[0].includes('inside a test was not wrapped in act'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };

  console.warn = (...args) => {
    // Suppress any React-specific test warnings if needed
    if (typeof args[0] === 'string' && args[0].includes('Warning:')) {
      return;
    }
    originalWarn.call(console, ...args);
  };

  console.log = (...args) => {
    // Suppress debug console.log statements from components during tests
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('SERVER_URL') ||
       args[0] === 'state set' ||
       args[0] === '150' ||
       args[0] === 'New Transaction')
    ) {
      return;
    }
    // Allow arrays/objects and other log statements
    originalLog.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
  console.log = originalLog;
});
