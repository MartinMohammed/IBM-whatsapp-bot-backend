// Declare a namespace to extend the existing NodeJS namespace
declare namespace NodeJS {
  // Extend the ProcessEnv interface to define custom environment variables and their types
  interface ProcessEnv {
    // The port number the application will listen on
    PORT: string;
    // The user access token for authentication
    USER_ACCESS_TOKEN: string;
    // The verify token for verification purposes
    VERIFY_TOKEN: string;
    // The ID of the phone number associated with the application
    PHONE_NUMBER_ID: string;
    // The current environment (either "production" or "development")
    NODE_ENV: "production" | undefined;
  }
}