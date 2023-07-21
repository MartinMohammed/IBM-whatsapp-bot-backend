import jwt from "jsonwebtoken";

/** This defines the structure of the additional data and the regular jwt.payload we put inside the jwt token */
interface JWTPayload extends jwt.JwtPayload {
  type: "refresh-token" | "access-token"; // The type of the token
}

export default JWTPayload;
