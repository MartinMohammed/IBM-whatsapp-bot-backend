import logger from "../logger";
import express from "express";

/**
 * Middleware for handling unmatched routes.
 * Logs a warning message for the unmatched request path and sends a JSON response with a 404 status code and an error message.
 */
function notFoundError(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  // Log a warning message indicating the unmatched request path
  logger.warn(`Received an unmatched request to ${req.path}.`);

  // Send a JSON response with a 404 status code and an error message
  res.status(404).json({ message: "Not found" });
}

export default notFoundError;
