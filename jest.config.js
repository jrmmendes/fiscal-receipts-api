const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require('./tsconfig.json')

/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: 'ts-jest',
  globalSetup: '<rootDir>/jest.global-setup.js',
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/tests/**/*.spec.ts',
  ],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, {
      prefix: '<rootDir>',
    }),
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/*.(module|config).ts',
    '!<rootDir>/src/(handler|main|application).ts',
    '!<rootDir>/src/**/index.ts',
  ],
  coverageDirectory: './coverage',
  fakeTimers: {
    enableGlobally: false,
  }
}
