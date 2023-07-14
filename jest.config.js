"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
  testEnvironment: "node",
  verbose: true,
  forceExit: true,

  // Other Jest configuration options
  coveragePathIgnorePatterns: [
    "./node_modules/",
    "./dist/logger",
    "./dist/types",
    "./dist/utils/Constants.js",
  ],
  collectCoverage: true,
  /*
  Open handles can include resources like open database connections,
  timers, file handles, network sockets, and other resources that should be closed or released
  to prevent resource leaks and ensure proper cleanup. */
  detectOpenHandles: true,
  verbose: true,
  moduleFileExtensions: ["js"],
  testTimeout: 60000,
  // Each setupFile will be run once per test file.
  setupFiles: ["./dist/testing/setupTests.js"],
};
