/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: 'jest-fixed-jsdom',
  transform: {
    '^.+.tsx?$': ['ts-jest', {}],
  },
};
