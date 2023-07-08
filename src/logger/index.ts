import winston from "winston";
import { productionLogger } from "./loggerTypes/productionLogger";
import { developmentLogger } from "./loggerTypes/developmentLogger";
import { testLogger } from "./loggerTypes/testLogger";

/**
 * Configured Winston Logger instance.
 * The logger is created based on the environment:
 * - In production environment, a production logger is created.
 * - In test environment, a test logger is created.
 * - In development environment, a development logger is created.
 */
let logger: winston.Logger;
if (process.env.NODE_ENV === "production") {
  // Create a production logger instance
  logger = productionLogger();
} else if (process.env.NODE_ENV === "test") {
  // Create a test logger instance
  logger = testLogger();
} else {
  // Create a development logger instance
  logger = developmentLogger();
}

export default logger as winston.Logger;
