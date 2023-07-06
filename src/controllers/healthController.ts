import { Request, Response } from "express";
import logger from "../logger";

/**
 * Handles the 'GET' request to the '/health' endpoint and responds with a status of 200.
 * Logs the request and response details using the configured logger.
 * @param req The Express Request object.
 * @param res The Express Response object.
 */
export function respondToHealthCheck(req: Request, res: Response) {
  const message = "Received 'GET' request to '/health'. Status Code: '200'";
  logger.http(message);

  // Send HTTP Status code 200, indicating the service is online.
  res.status(200).json({
    status: "OK",
  });
}
