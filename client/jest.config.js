module.exports = {
  testEnvironment: "jsdom",
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    // aliases
    '^@assets': '<rootDir>/src/assets',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@custom_types/(.*)$': '<rootDir>/src/types/$1',
    '^@utilities/(.*)$': '<rootDir>/src/utilities/$1',


    // mocks
    '\\.(s)?css$': '<rootDir>/test/jest/__mocks__/styleMock.js',
  }
};