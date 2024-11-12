export default {
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.mjs?(x)', '**/?(*.)+(spec|test).mjs?(x)'],
    moduleFileExtensions: ['js', 'json', 'jsx', 'node', 'mjs'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],
    transform: {
        '^.+\\.mjs$': 'babel-jest',
    },
};