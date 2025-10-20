# 3tier-front Test Documentation

## Overview
This document provides information about the test suite for the 3tier-front React application.

## Test Coverage

### App Component Tests (`App.test.js`)
- Component rendering and initialization
- Theme provider integration
- Burger menu and navigation
- Routing functionality
- Focus lock implementation
- Global styles application
- Version information display on home page

### DatabaseDemo Component Tests (`DatabaseDemo.test.js`)
- Component rendering with table structure
- Data fetching from backend API
- Transaction display functionality
- Adding new transactions
- Deleting all transactions
- Input field handling
- Error handling and retry logic
- API call mocking

### Home Component Tests (`Home.test.js`)
- Component rendering
- Version information display
- Title and styling
- Architecture image display
- Semantic HTML usage
- Accessibility features

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

### Run Tests with Coverage Report
```bash
npm test -- --coverage
```

### Run Tests Without Watch Mode (CI)
```bash
CI=true npm test
```

## Test Structure

```
3tier-front/
├── src/
│   ├── App.test.js                              # App component tests
│   ├── components/
│   │   ├── DatabaseDemo/
│   │   │   ├── DatabaseDemo.test.js            # DatabaseDemo tests
│   │   │   └── DatabaseDemo.js
│   │   └── Home/
│   │       ├── Home.test.js                    # Home component tests
│   │       └── Home.js
│   └── setupTests.js                            # Test setup
└── package.json                                 # Test configuration
```

## Testing Framework
- **Jest**: JavaScript testing framework (comes with Create React App)
- **React Testing Library**: Testing utilities for React components
- **@testing-library/jest-dom**: Custom matchers for DOM assertions
- **@testing-library/user-event**: User interaction simulation

## Mock Strategy
- API calls are mocked using `jest.fn()` for `global.fetch`
- Config module is mocked to use test server URL
- All HTTP requests are intercepted and mocked responses are provided

## Test Environment
Tests run in a jsdom environment that simulates a browser environment in Node.js.

## Version Information Feature

### Home Component Version Display
The Home component now displays the frontend version from `package.json`:

**Visual Display:**
```
AWS 3-TIER WEB APP DEMO
Frontend Version: 0.1.0
[Architecture Image]
```

**Implementation:**
```javascript
const version = require('../../../package.json').version;
<p style={{color:"#aaa", fontSize:"14px"}}>Frontend Version: {version}</p>
```

## Key Testing Patterns

### Component Rendering Tests
```javascript
test('should render without crashing', () => {
  render(<Component />);
  expect(screen.getByText('Expected Text')).toBeInTheDocument();
});
```

### Async Data Fetching Tests
```javascript
test('should fetch and display data', async () => {
  global.fetch.mockResolvedValueOnce({
    json: async () => ({ result: mockData })
  });

  render(<Component />);

  await waitFor(() => {
    expect(screen.getByText('Data')).toBeInTheDocument();
  });
});
```

### User Interaction Tests
```javascript
test('should handle button click', async () => {
  render(<Component />);

  const button = screen.getByRole('button', { name: 'Click Me' });
  fireEvent.click(button);

  await waitFor(() => {
    expect(mockFunction).toHaveBeenCalled();
  });
});
```

## Accessibility Testing
Tests include checks for:
- Proper semantic HTML elements
- Alt text for images
- ARIA attributes
- Keyboard navigation support

## Notes
- All tests are isolated and do not depend on external services
- Mock data is used to simulate backend responses
- Tests cover both success and error scenarios
- Component styling is verified where applicable
- Tests follow the Arrange-Act-Assert pattern

## Troubleshooting

### Test Fails with "Cannot find module"
Ensure all dependencies are installed:
```bash
npm install
```

### Tests Timeout
Increase the timeout in specific tests:
```javascript
test('long running test', async () => {
  // test code
}, 10000); // 10 second timeout
```

### Mock Not Working
Ensure mocks are cleared between tests:
```javascript
beforeEach(() => {
  jest.clearAllMocks();
});
```
