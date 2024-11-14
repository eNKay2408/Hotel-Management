export default {
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.mjs?(x)', '**/?(*.)+(spec|test).mjs?(x)'],
  moduleFileExtensions: ['js', 'json', 'jsx', 'node', 'mjs'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['clover', 'json', 'lcov', 'text'],
  transform: {},
  transformIgnorePatterns: ['/node_modules/'],
};
