import express from "express";
import logger from "../logger";

/**
 * Error handler middleware.
 * @param err - The error object.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function.
 */
function errorHandler(
  err: Error,
  req: express.Request,
  res: express.Response,
  _: express.NextFunction
) {
  logger.error("An error occurred: ", err);
  res.status(500).json({ message: `Internal Server Error: ${err.message}` });
}

export default errorHandler;
