import logger from "../../../../logger";
/**
 * Error handler function for Telegram bot polling.
 * Logs the encountered error and performs error handling actions.
 * @param error - The error encountered during bot polling.
 */
export function onPollingErrorHandler(error: Error) {
  logger.error("Polling encountered an error:", error); // Log the polling error

  // Handle the polling error gracefully, such as restarting the polling or logging the error for further investigation.
}
