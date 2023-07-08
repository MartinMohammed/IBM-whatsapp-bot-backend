import winston from "winston";

// Destructure the format methods from winston.format
const { combine, json, printf } = winston.format;

/**
 * Set:
 * dirname to "logs"
 * format to json.
 * maxsize to 50 MB
 */
export const LoggerBaseConfig = {
  dirname: "logs",
  format: combine(json()),
  maxsize: 50 * 1024 * 1024, // Maximum size of the log file in bytes (50 MB)
};

/*
  Custom log format using timestamp, log level, and message
  Define a custom log format using printf
*/
export const customLoggerOutputFormat = printf(
  ({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
  }
);
