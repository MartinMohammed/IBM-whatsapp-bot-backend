import "dotenv/config";

// Mock the logger module
// Since every test runs in its own environment,
// these scripts will be executed in the testing environment before executing setupFilesAfterEnv and before the test code itself.
jest.mock("../logger", () => ({
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  http: jest.fn(),
  verbose: jest.fn(),
  debug: jest.fn(),
  silly: jest.fn(),
}));

// ------------------ MOCKING ------------------

/**  Special setup file used by Jest for configuring the test environment before running the tests. It allows you to set up global configurations, mock modules, or load additional dependencies that are required for your tests. */
import Constants from "../utils/Constants";

// ------------------ CHANGE VALUES OF CONSTANTS ------------------
Constants.phoneNumber = "123456789011";
// ------------------ CHANGE VALUES OF CONSTANTS ------------------

// ------------------ CHANGE VALUES OF ENV VARIABLES ------------------

// ------------------ CHANGE VALUES OF ENV VARIABLES ------------------
