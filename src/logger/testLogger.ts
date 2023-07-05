import winston from "winston";

// Log only to console while testing.
export function testLogger() {
  const { combine, timestamp, prettyPrint, printf, colorize } = winston.format;

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
    transports: [new winston.transports.Console()],
  });
  return logger;
}
