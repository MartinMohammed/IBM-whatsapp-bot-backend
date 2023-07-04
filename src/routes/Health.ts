import express, { Request, Response } from "express";

const router = express.Router();

// Handle the GET request by the Elastic Load Balancer
// To make a health check
router.get("/health", (req: Request, res: Response) => {
  // Send HTTP Status code 200, indicating the service is online.
  res.status(200).json({
    status: "OK",
  });
});

export default router;
