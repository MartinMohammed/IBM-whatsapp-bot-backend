import winston from "winston";

function productionLogger() {
  // Destructure the format methods from winston.format
  const { combine, timestamp, label, prettyPrint, printf, colorize, json } =
    winston.format;
  // Define a custom log format using printf
  const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
  });

  // Create a logger instance with desired configuration
  const logger = winston.createLogger({
    level: "http", // Set the minimum logging level to 'http' / everything higher (towards error will be logged.)
    format: combine(timestamp(), prettyPrint(), myFormat), // Use custom log format and include timestamp
    transports: [
      new winston.transports.Console(), // Output logs to the console
      new winston.transports.File({
        dirname: "logs",
        level: "error", // Only log error messages to the file
        filename: "error.log", // Set the filename for the log file
        maxsize: 1000, // Maximum size of the log file in bytes (1000 bytes = 1 KB)
        format: combine(json()), // Use JSON format for the log entries in the file
      }),
      new winston.transports.File({
        dirname: "logs",
        level: "http", // Only log error messages to the file
        filename: "http.log", // Set the filename for the log file
        maxsize: 1000, // Maximum size of the log file in bytes (1000 bytes = 1 KB)
        format: combine(json()), // Use JSON format for the log entries in the file
      }),
    ],
  });

  return logger; // Return the created logger instance
}

export default productionLogger;
