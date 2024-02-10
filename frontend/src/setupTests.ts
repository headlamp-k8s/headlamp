// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import 'jest-canvas-mock';

jest.mock('./constants/envs', () => ({
  NODE_ENV: 'test',
  VITE_SKIP_A11Y: true,
  UNDER_TEST: true,
  FLATPAK_ID: '',
  VITE_DEBUG_VERBOSE: 'k8s/apiProxy',
  PUBLIC_URL: '.',
  VITE_HEADLAMP_VERSION: '',
  VITE_HEADLAMP_GIT_VERSION: '',
  VITE_HEADLAMP_PRODUCT_NAME: '',
  VITE_HEADLAMP_BACKEND_TOKEN: '',
}));

if (typeof TextDecoder === 'undefined' && typeof require !== 'undefined') {
  (global as any).TextDecoder = require('util').TextDecoder;
}
if (typeof TextEncoder === 'undefined' && typeof require !== 'undefined') {
  (global as any).TextEncoder = require('util').TextEncoder;
}
if (typeof ResizeObserver === 'undefined' && typeof require !== 'undefined') {
  (global as any).ResizeObserver = require('resize-observer-polyfill');
}

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

beforeEach(() => {
  // Clears the database and adds some testing data.
  // Jest will wait for this promise to resolve before running tests.
  localStorage.clear();
});
