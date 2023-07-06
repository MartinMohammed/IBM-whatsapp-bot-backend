import logger from "../../../../logger";
/**
 * Error handler function for general errors.
 * Logs the encountered error and performs error handling actions.
 * @param error - The error object.
 */
export function onErrorHandler(error: Error) {
  logger.error("An error occurred:", error); // Log the error

  // Handle the error gracefully, such as logging it for further investigation or taking appropriate action based on the error type.
}
