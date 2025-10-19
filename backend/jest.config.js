module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/?(*.)+(spec|test).js'
  ],
  moduleFileExtensions: ['js', 'json'],
  clearMocks: true,
  coverageProvider: 'v8',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/server.js',
    '!src/**/config/**'
  ],
  setupFiles: ['dotenv-flow/config'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  testTimeout: 10000
};