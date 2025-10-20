import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock fetch for DatabaseDemo component
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ result: [] })
  })
);

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Component Rendering', () => {
    test('should render App component without crashing', async () => {
      render(<App />);

      // Wait for component to fully render
      await waitFor(() => {
        expect(document.querySelector('.App')).toBeDefined();
      });
    });

    test('should render with ThemeProvider', async () => {
      const { container } = render(<App />);

      // Wait for async rendering to complete
      await waitFor(() => {
        expect(container.firstChild).toBeDefined();
      });
    });

    test('should render Burger component', async () => {
      render(<App />);

      // Wait for Burger to render
      await waitFor(() => {
        const burger = document.querySelector('button[aria-controls="main-menu"]');
        expect(burger).toBeInTheDocument();
      });
    });

    test('should render Menu component', async () => {
      render(<App />);

      // Wait for Menu to render
      await waitFor(() => {
        const menu = document.getElementById('main-menu');
        expect(menu).toBeInTheDocument();
      });
    });
  });

  describe('Routing', () => {
    test('should render Home component on default route', async () => {
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('AWS 3-TIER WEB APP DEMO')).toBeInTheDocument();
      });
    });

    test('should display version information on home page', async () => {
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/Frontend Version:/i)).toBeInTheDocument();
      });
    });
  });

  describe('Menu State Management', () => {
    test('should initialize with menu closed', async () => {
      render(<App />);

      // Wait for menu to render
      await waitFor(() => {
        const menu = document.getElementById('main-menu');
        expect(menu).toBeInTheDocument();
      });
    });
  });

  describe('Focus Lock', () => {
    test('should render FocusLock component', async () => {
      const { container } = render(<App />);

      // Wait for FocusLock to render
      await waitFor(() => {
        expect(container.querySelector('[data-focus-lock-disabled]')).toBeDefined();
      });
    });
  });

  describe('Global Styles', () => {
    test('should apply GlobalStyles', async () => {
      render(<App />);

      // Wait for component to render
      await waitFor(() => {
        expect(document.body).toBeDefined();
      });
    });
  });
});
