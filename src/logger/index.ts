import winston from "winston";
import productionLogger from "./productionLogger";
import developmentLogger from "./developmentLogger";

let logger: winston.Logger | null = null;

// Based on the current node environment choose a different logger with different levels.
if (process.env.NODE_ENV === "production") {
  logger = productionLogger(); // Create a production logger instance
} else {
  logger = developmentLogger(); // Create a development logger instance
}

export default logger as winston.Logger;
