// Import required modules and types
import { ChatSocket } from "../../app";
import logger from "../../logger";
import { verifyAccessToken } from "../../utils/jwt";
import jwt from "jsonwebtoken";

/**
 * Middleware function responsible for validating the provided auth token
 * and authorizing the socket client.
 *
 * @param socket The ChatSocket object representing the incoming socket connection.
 * @param next The function to be called to pass control to the next middleware in the stack.
 */
async function auth(socket: ChatSocket, next: Function) {
  // Extract the auth token from the socket handshake
  const token = socket.handshake.auth.token;
  // If no token is provided, log a warning and call the 'next' function with an error
  if (!token) {
    logger.warn(
      "Received a socket connection request with an unspecified accessToken."
    );
    return next(Error("No access token was provided."));
  }

  try {
    const payload = await verifyAccessToken(token);
    logger.info(
      `${
        (payload as jwt.JwtPayload).sub
      } is authenticated to establish a socket connection.`
    );
  } catch (err) {
    logger.warn(`Received socket connection with an invalid access token.`);
    return next(new Error(`Unauthorized`));
  }

  // Call the 'next' function to continue to the next middleware or handler
  next();
}

export default auth;
