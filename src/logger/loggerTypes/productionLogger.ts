import winston from "winston";
import {
  LoggerBaseConfig,
  customLoggerOutputFormat,
} from "./../util/loggerConfiguration";

/**
 * Creates a production logger instance.
 * @returns The created logger instance.
 */
export function productionLogger() {
  /*
    Destructure the format methods from winston.format
    - combine: Combine multiple format methods
    - timestamp: Add timestamp to log entries
    - prettyPrint: Format log entries in a readable way
  */
  const { combine, timestamp, prettyPrint } = winston.format;

  // Create a logger instance with desired configuration
  const logger = winston.createLogger({
    level: "http", // Set the minimum logging level to 'http' / everything higher (towards error will be logged.)
    format: combine(timestamp(), prettyPrint(), customLoggerOutputFormat), // Use custom log format and include timestamp
    transports: [
      new winston.transports.Console(), // Output logs to the console
      new winston.transports.File({
        ...LoggerBaseConfig,
        level: "error", // Only log error messages to the file
        filename: "error.log", // Set the filename for the log file
      }),
      new winston.transports.File({
        ...LoggerBaseConfig,
        level: "http", // Only log error messages to the file
        filename: "http.log", // Set the filename for the log file
      }),
    ],
  });

  return logger; // Return the created logger instance
}
