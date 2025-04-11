/**
 * Jest setup file for Hopewell Health website tests
 * This file runs before each test to set up the testing environment
 */

// Import necessary testing libraries
require('@testing-library/jest-dom');

// Mock browser objects and functions that aren't available in Jest
global.MutationObserver = class {
  constructor(callback) {}
  disconnect() {}
  observe(element, initObject) {}
};

// Mock window.scrollTo
window.scrollTo = jest.fn();

// Mock window.alert
window.alert = jest.fn();

// Mock document functions
document.createRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  },
});

// Create a mock for localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  
  // Reset the document body
  document.body.innerHTML = '';
  
  // Reset any handlers
  jest.restoreAllMocks();
});