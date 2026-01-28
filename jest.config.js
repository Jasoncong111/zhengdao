const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'lib/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!__tests__/**', // 排除测试文件本身
  ],
  testMatch: [
    '<rootDir>/**/__tests__/**/*.{spec,test}.{js,jsx,ts,tsx}',
    '<rootDir>/**/__tests__/**/*.test.{js,jsx,ts,tsx}',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/__tests__/utils/', // 排除工具文件夹（这些是辅助函数，不需要测试）
    '<rootDir>/__tests__/unit/', // 排除单元测试（依赖实际功能模块，待实现后启用）
  ],
  // 覆盖率阈值
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  // 忽略某些文件和目录
  transformIgnorePatterns: [
    '/node_modules/',
    '/.next/',
  ],
};

module.exports = createJestConfig(customJestConfig);
