import express from "express";
import { respondToHealthCheck } from "../controllers/healthController";

const router = express.Router();

// Handle the GET request by the Elastic Load Balancer
// To make a health check
router.get("/health", respondToHealthCheck);

export default router;
