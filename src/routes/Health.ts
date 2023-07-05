import express, { Request, Response } from "express";
import logger from "../logger";

const router = express.Router();

// Handle the GET request by the Elastic Load Balancer
// To make a health check
router.get("/health", (req: Request, res: Response) => {
  const message = "Received 'GET' request to '/health'. Status Code: '200'";
  logger.http(message + process.env.NODE_ENV);
  logger.http(process.env.NODE_ENV);

  // Send HTTP Status code 200, indicating the service is online.
  res.status(200).json({
    status: "OK",
  });
});

export default router;
