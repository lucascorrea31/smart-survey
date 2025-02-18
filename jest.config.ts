import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: './src',
  detectOpenHandles: true,
  coverageDirectory: '../coverage',
  coverageReporters: [
    'json-summary',
    'clover',
    'json',
    'lcov',
    ['text', {skipFull: true}],
  ],
  collectCoverageFrom: [
    '<rootDir>/data/repository/adapters/**/*.(t|j)s',
    '<rootDir>/domain/usecases/**/*.(t|j)s',
    '<rootDir>/domain/validators/**/*.(t|j)s',
    '<rootDir>/infrastructure/controllers/**/*.(t|j)s',
    '<rootDir>/infrastructure/middlewares/**/*.(t|j)s',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/out/',
    '<rootDir>/infrastructure/constants/*',
    '<rootDir>/infrastructure/middlewares/index.ts',
    '<rootDir>/infrastructure/middlewares/log-request.ts',
    '<rootDir>/infrastructure/middlewares/not-found.ts',
    '<rootDir>/infrastructure/middlewares/not-found-handler.ts',
    '<rootDir>/infrastructure/middlewares/validate-feature-flag.ts',
    '<rootDir>/data/gateway/*',
    '<rootDir>/domain/entities/*',
    '<rootDir>/data/repository/dtos/*',
    '<rootDir>/domain/dto/*',
    '<rootDir>/domain/repositories/*',
    '<rootDir>/infrastructure/config-manager/*',
    '<rootDir>/infrastructure/migrations/*',
    '<rootDir>/infrastructure/port/*',
    '<rootDir>/infrastructure/routers/*',
  ],
  testRegex: '.*\\.(spec|test)\\.ts$',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

export default config;
