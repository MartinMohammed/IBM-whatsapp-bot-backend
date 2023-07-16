/**
 * Declare a namespace to extend the existing NodeJS namespace.
 */
declare namespace NodeJS {
  /**
   * Extend the ProcessEnv interface to define custom environment variables and their types.
   */
  interface ProcessEnv {
    /**
     * The port number the application will listen on.
     */
    PORT: string;

    /**
     * The user access token for authentication.
     */
    META_API_TOKEN: string;

    /**
     * The verify token for verification purposes.
     */
    HUB_VERIFY_TOKEN: string;

    /**
     * The username used to connect to mongo db on mongo atlas
     */
    MONGO_ATLAS_DB_USERNAME: string;

    /**
     * The password used to connect to mongo db on mongo atlas
     */
    MONGO_ATLAS_DB_PASSWORD: string;
    /**
     * Represents the db name
     */
    MONGO_ATLAS_DB_NAME: string;

    /**
     * The ID of the phone number associated with the application.
     */
    PHONE_NUMBER_ID: string;

    /**
     * Represents the phone number associated with the application.
     */
    PHONE_NUMBER: string;

    /**
     * Undefined -> development
     */
    NODE_ENV: "production" | "test" | undefined;
  }
}
