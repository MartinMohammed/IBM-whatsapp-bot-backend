import express from "express";
import logger from "../logger";
import HTTPError from "../customTypes/REST/HTTPError";
import createHttpError from "http-errors";

/**
 * Error handler middleware.
 * @param err - The error object.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function.
 */
function errorHandler(
  err: HTTPError,
  req: express.Request,
  res: express.Response,
  _: express.NextFunction
) {
  logger.error("An error occurred: ", err);
  res.statusCode = err.statusCode;
  res.json({
    error: {
      statusCode: err.statusCode || 500,
      message: err.message || 500,
    },
  });
}

export default errorHandler;
