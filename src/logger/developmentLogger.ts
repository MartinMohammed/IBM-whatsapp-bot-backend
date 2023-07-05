import winston from "winston";

export function developmentLogger() {
  const { combine, timestamp, label, prettyPrint, printf, colorize, json } =
    winston.format;

  // Custom log format using timestamp, log level, and message
  const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
  });

  // Create a logger instance for the development environment
  const logger = winston.createLogger({
    level: "debug", // Log all levels from "debug" and higher (towards error)
    format: combine(
      timestamp({ format: "HH:mm:ss" }), // Add timestamp in "HH:mm:ss" format
      colorize(), // Colorize log output in the console
      prettyPrint(), // Format log entries in a human-readable way
      myFormat // Apply custom log format
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({
        dirname: "logs",
        level: "http", // Only log error messages to the file
        filename: "http.log", // Set the filename for the log file
        maxsize: 20 * 1024 * 1024, // Maximum size of the log file in bytes (20 MB)
        format: combine(json()), // Use JSON format for the log entries in the file
      }),
      new winston.transports.File({
        dirname: "logs",
        level: "error", // Only log error messages to the file
        filename: "error.log", // Set the filename for the log file
        maxsize: 20 * 1024 * 1024, // Maximum size of the log file in bytes (20 MB)
        format: combine(json()), // Use JSON format for the log entries in the file
      }),
    ], // Output logs to the console
  });

  return logger;
}
