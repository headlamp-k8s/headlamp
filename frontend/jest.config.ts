export default {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|webp|svg|ttf)$': '<rootDir>/src/test/__mocks__/fileMock.js',
    '\\.(css|less)$': '<rootDir>/src/test/__mocks__/styleMock.js',
  },
  modulePaths: ['<rootDir>/src'],
};
