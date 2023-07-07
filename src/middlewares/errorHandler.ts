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
  next: express.NextFunction
) {
  logger.error("An error occurred: ", err);
  res.status(500).json({ error: "Internal Server Error" });
}

export default errorHandler;
