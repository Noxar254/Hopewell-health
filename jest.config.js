/**
 * Jest configuration file for Hopewell Health website testing
 */
module.exports = {
  // The test environment that will be used for testing
  testEnvironment: 'jsdom',
  
  // Indicates whether each individual test should be reported during the run
  verbose: true,
  
  // Files to ignore when testing
  testPathIgnorePatterns: ['/node_modules/'],
  
  // Setup files to run before each test
  setupFilesAfterEnv: ['./tests/setup.js'],
  
  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',
  
  // Collect coverage from these files
  collectCoverageFrom: [
    'script.js',
    'hero-buttons.js',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
  
  // Minimum coverage threshold percentage
  coverageThreshold: {
    global: {
      statements: 50,
      branches: 40,
      functions: 50,
      lines: 50,
    },
  },
};