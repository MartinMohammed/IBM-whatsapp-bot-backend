"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
  // Other Jest configuration options
  coveragePathIgnorePatterns: [
    "../node_modules/",
    "/logger/",
    "./dist/utils/telegramBot/listenerHandlers/ErrorHandlers",
  ],
  collectCoverage: true,
  verbose: true,
  moduleFileExtensions: ["js"],
};
