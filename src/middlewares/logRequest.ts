import express from "express";
import logger from "../logger";

/** For every incoming request, log essential request information. */
function logRequest(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  /** Log the request */
  logger.info(
    `Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`
  );
  next();
}

export default logRequest;
