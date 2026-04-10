/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/src/__tests__/**/*.test.js'],
  clearMocks: true,
  resetModules: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/controllers/**/*.js',
    'src/middleware/**/*.js',
    '!src/__tests__/**',
  ],
};
