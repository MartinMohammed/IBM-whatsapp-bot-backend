import winston from "winston";
import {
  LoggerBaseConfig,
  customLoggerOutputFormat,
} from "../util/loggerConfiguration";

/**
 * Creates a development logger instance.
 * @returns The created logger instance.
 */
export function developmentLogger() {
  /*
    Destructure the format methods from winston.format
    - combine: Combine multiple format methods
    - timestamp: Add timestamp to log entries
    - prettyPrint: Format log entries in a readable way
    - colorize: Colorize log output in the console
  */
  const { combine, timestamp, prettyPrint, colorize } = winston.format;

  // Create a logger instance for the development environment
  const logger = winston.createLogger({
    level: "debug", // Log all levels from "debug" and higher (towards error)
    format: combine(
      timestamp({ format: "HH:mm:ss" }), // Add timestamp in "HH:mm:ss" format
      colorize(), // Colorize log output in the console
      prettyPrint(), // Format log entries in a human-readable way
      customLoggerOutputFormat // Apply custom log format
    ),
    transports: [
      new winston.transports.Console(),
      // new winston.transports.File({
      //   ...LoggerBaseConfig,
      //   level: "http", // Only log error messages to the file
      //   filename: "http.log", // Set the filename for the log file
      // }),
      // new winston.transports.File({
      //   ...LoggerBaseConfig,
      //   level: "error", // Only log error messages to the file
      //   filename: "error.log", // Set the filename for the log file
      // }),
    ], // Output logs to the console
  });

  return logger;
}
