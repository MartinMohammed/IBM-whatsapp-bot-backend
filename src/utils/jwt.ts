import createHttpError from "http-errors";
import { SignOptions } from "jsonwebtoken";
import logger from "../logger";
import jwt from "jsonwebtoken";
import JWTPayload from "../customTypes/JWTPayload";

const ACCESS_TOKEN_EXPIRATION = "2h";

/** Returns a promise either resolving with the generated token or rejecting with an error */
// Used for both generating the access token and the refresh token
export function generateAccessToken(userId: string): Promise<string> {
  let signingSecret: string;
  if (process.env.NODE_ENV === "test") {
    signingSecret = process.env.JWT_SIGNING_KEY_TEST;
  } else {
    signingSecret = process.env.JWT_SIGNING_KEY;
  }

  const expiresIn = ACCESS_TOKEN_EXPIRATION; // Set a default value if not provided

  const tokenType = "accessToken";
  /** Data included in the JWT payload */
  const payload = {
    tokenType,
  };

  // Add relevant options like expiresIn, algorithm, etc.
  const options: SignOptions = {
    expiresIn: expiresIn!, // Specifies when the token should expire
    issuer: "martin-mohammed.info", // Indicates the issuer of the token
    subject: userId, // Specifies the subject of the token, usually the user ID (document id)
    audience: "example.com", // Specifies the intended location or context where the token will be used
  };

  return new Promise((resolve, reject) => {
    jwt.sign(payload, signingSecret, options, (error, token) => {
      if (error) {
        logger.debug(`Failed to generate new ${tokenType}. ${error.message}`);
        reject(
          createHttpError.InternalServerError(
            `Failed to generate ${tokenType}.`
          )
        );
      } else if (!token) {
        logger.debug(`Failed to generate new ${tokenType}.`);
        reject(
          createHttpError.InternalServerError(`${tokenType} was not generated.`)
        );
      } else {
        logger.verbose(`A new ${tokenType} was generated.`);

        return resolve(token);
      }
    });
  });
}

/**
 * Verifies the validity of the provided JSON Web Token (JWT) access token.
 * This function performs the following steps to validate the token:
 * 1. Decoding of the header & payload and signature
 * 2. Signature verification (hash payload and header and compare with the provided signature)
 * 3. Claims Validation (after signature is verified)
 *
 * @param {string} token - The JSON Web Token to be verified.
 * @returns {Promise<JWTPayload>} - A Promise that resolves to the payload of the verified JWT
 * if the token is valid. Otherwise, it rejects with an error message indicating the reason
 * for token invalidity (e.g., "Unauthorized" for token verification failure).
 */
export function verifyAccessToken(token: string): Promise<JWTPayload> {
  let signingSecret: string;
  if (process.env.NODE_ENV === "test") {
    signingSecret = process.env.JWT_SIGNING_KEY_TEST;
  } else {
    signingSecret = process.env.JWT_SIGNING_KEY;
  }

  return new Promise((resolve, reject) => {
    jwt.verify(token, signingSecret, (err, payload) => {
      if (err) {
        const errorMessage =
          err.name === "JsonWebTokenError" ? "Unauthorized" : err.name;
        logger.warn("Received an invalid JWT Access token.");
        reject(errorMessage);
      }
      logger.verbose("Access Token is valid.");
      resolve(payload as JWTPayload);
    });
  });
}
