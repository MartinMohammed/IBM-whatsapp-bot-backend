"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
  // Other Jest configuration options
  coveragePathIgnorePatterns: [
    "./node_modules/",
    "./dist/logger",
    "./dist/types",
    "./dist/utils/Constants.js",
  ],
  collectCoverage: true,
  verbose: true,
  moduleFileExtensions: ["js"],
  testTimeout: 10000,
};
