module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^~/(.*)$': '<rootDir>/$1',
    '^vue$': 'vue/dist/vue.common.js'
  },
  moduleFileExtensions: [
    'js',
    'vue',
    'json'
  ],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '.*\\.(vue)$': 'vue-jest'
  },
  collectCoverage: true,
  coverageDirectory: 'coverage', // Ordner, in dem die Berichte gespeichert werden
  coverageReporters: ['html', 'text', 'lcov'], // 'html' für den HTML-Bericht
  collectCoverageFrom: [
    //'<rootDir>/components/**/*.vue',
    //'<rootDir>/pages/**/*.vue'
    '<rootDir>/static/**/*.js',
    '<rootDir>/serverMiddleware/**/*.js'
  ],
  testEnvironment: 'node'
}
