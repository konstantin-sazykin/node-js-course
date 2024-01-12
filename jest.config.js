module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '.e2e.test.ts$',
  setupFiles: ['./__tests__/setup.ts']
};
