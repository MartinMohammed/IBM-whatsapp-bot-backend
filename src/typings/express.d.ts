import JWTPayload from "../customTypes/JWTPayload";
// to make the file a module and avoid the TypeScript error
export {};

// The declare global keyword indicates that the declaration is extending a global object. In this case, it extends the global namespace in TypeScript.
declare global {
  // The namespace Express indicates that the following declarations are extending the Express namespace, which contains types related to the Express.js framework.
  namespace Express {
    // export interface Request is a declaration merging construct. It extends the existing Request interface provided by Express.js.
    export interface Request {
      user: JWTPayload;
    }
  }
}
