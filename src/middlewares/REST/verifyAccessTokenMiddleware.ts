import express from "express";
import createHttpError from "http-errors";
import JWTPayload from "../../customTypes/JWTPayload";
import jwt from "jsonwebtoken";
import logger from "../../logger";
import { verifyAccessToken } from "../../utils/jwt";

// Middleware
async function verifyAccessTokenMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const authHeader = req.headers["authorization"];

  // If token is invalid, pass http error to next function
  if (!authHeader) {
    return next(createHttpError.Unauthorized());
  }

  // Format: Bearer XXX
  const bearerToken = authHeader.split(" ");
  const token = bearerToken[1];

  /**
   * 1. Decoding of the header & payload and signature
   * 2. Signature verification (hash payload and header and compare with prov. signature)
   * 3. Claims Validation (after signature is verfied)
   */
  try {
    const payload = await verifyAccessToken(token);
    // Payload is valid
    req.user = payload;
    next();
  } catch (error) {
    next(createHttpError.Unauthorized((error as Error).message));
  }
}

export default verifyAccessTokenMiddleware;
