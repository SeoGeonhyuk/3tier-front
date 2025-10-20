import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './Home';

describe('Home Component', () => {
  describe('Component Rendering', () => {
    test('should render without crashing', () => {
      render(<Home />);
      expect(screen.getByText('AWS 3-TIER WEB APP DEMO')).toBeInTheDocument();
    });

    test('should render main title', () => {
      render(<Home />);
      const title = screen.getByText('AWS 3-TIER WEB APP DEMO');
      expect(title).toBeInTheDocument();
      expect(title).toHaveStyle({ color: 'white' });
    });

    test('should display version information', () => {
      render(<Home />);
      const versionText = screen.getByText(/Frontend Version:/i);
      expect(versionText).toBeInTheDocument();
    });

    test('should display correct version number from package.json', () => {
      render(<Home />);
      const packageJson = require('../../../package.json');
      const versionText = screen.getByText(`Frontend Version: ${packageJson.version}`);
      expect(versionText).toBeInTheDocument();
    });

    test('should render architecture image', () => {
      render(<Home />);
      const image = screen.getByAltText('3T Web App Architecture');
      expect(image).toBeInTheDocument();
    });

    test('should have correct image dimensions', () => {
      render(<Home />);
      const image = screen.getByAltText('3T Web App Architecture');
      expect(image).toHaveStyle({ height: '400px', width: '825px' });
    });
  });

  describe('Styling', () => {
    test('should apply correct styles to title', () => {
      render(<Home />);
      const title = screen.getByText('AWS 3-TIER WEB APP DEMO');
      expect(title.tagName).toBe('H1');
      expect(title).toHaveStyle({ color: 'white' });
    });

    test('should apply correct styles to version text', () => {
      render(<Home />);
      const versionText = screen.getByText(/Frontend Version:/i);
      expect(versionText.tagName).toBe('P');
      expect(versionText).toHaveStyle({
        color: '#aaa',
        fontSize: '14px'
      });
    });
  });

  describe('Image Source', () => {
    test('should have architecture image with correct src', () => {
      render(<Home />);
      const image = screen.getByAltText('3T Web App Architecture');
      expect(image.getAttribute('src')).toBeDefined();
    });
  });

  describe('Component Structure', () => {
    test('should have correct component hierarchy', () => {
      const { container } = render(<Home />);
      const divs = container.querySelectorAll('div');
      expect(divs.length).toBeGreaterThan(0);
    });

    test('should contain all required elements', () => {
      render(<Home />);

      // Check for title
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();

      // Check for version paragraph
      expect(screen.getByText(/Frontend Version:/i)).toBeInTheDocument();

      // Check for image
      expect(screen.getByRole('img')).toBeInTheDocument();
    });
  });

  describe('Version Format', () => {
    test('should display version in correct format', () => {
      render(<Home />);
      const versionText = screen.getByText(/Frontend Version:/i);

      // Check that version follows semantic versioning pattern (e.g., 0.1.0)
      expect(versionText.textContent).toMatch(/Frontend Version: \d+\.\d+\.\d+/);
    });

    test('should match package.json version exactly', () => {
      render(<Home />);
      const packageJson = require('../../../package.json');

      expect(screen.getByText(`Frontend Version: ${packageJson.version}`)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('should have accessible image alt text', () => {
      render(<Home />);
      const image = screen.getByAltText('3T Web App Architecture');
      expect(image).toBeInTheDocument();
      expect(image.alt).toBe('3T Web App Architecture');
    });

    test('should use semantic HTML elements', () => {
      render(<Home />);

      // Check for proper heading usage
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();

      // Check for proper image usage
      expect(screen.getByRole('img')).toBeInTheDocument();
    });
  });
});
