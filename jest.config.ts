import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './',
})

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  testMatch: [
    "**/?(*.)+(spec|test).[jt]s?(x)"
  ],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',

    '^.+\\.(svg|png|jpg|jpeg|gif|webp)$': '<rootDir>/__mocks__/fileMock.js',
  },
}

export default createJestConfig(config)