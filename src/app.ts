// Load the env
import "dotenv/config";

// Initialize the whatsapp bot to listen for new messages.
import "./utils/whatsappBot/init";

// Import the necessary libraries: express and body-parser.
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
// ----------------- Router ----------------- //
import webhookRouter from "./routes/webhookRouter";
import healthRouter from "./routes/healthRouter";
// ----------------- Router ----------------- //

// ----------------- Custom Middleware ----------------- //
import errorHandler from "./middlewares/errorHandler";
import notFoundError from "./middlewares/notFoundError";
import logRequest from "./middlewares/logRequest";
import apiRouter from "./routes/api";
// ----------------- Custom Middleware ----------------- //

// ----------------- EXPORT ALL TYPES FOR THE TYPE BUNDLER ----------------- //
/* Models */
export * from "./customTypes/models/User"
export * from "./customTypes/models/WhatsappMessagesStored"
/* SocketIO */
export * from "./customTypes/socketIO/messages"
export * from "./customTypes/socketIO/contact"
export * from "./customTypes/socketIO/chatNamespace"
export * from "./customTypes/socketIO/root"
/* Rest */
export * from "./customTypes/REST/ClientStoredMessage"
export * from "./customTypes/REST/ClientStoredUser"
export * from "./customTypes/REST/UsersFilterList"
// ----------------- EXPORT ALL TYPES FOR THE TYPE BUNDLER ----------------- //

// ----------------- Router ----------------- //

// ----------------- CONSTANTS ----------------- //
const app = express();
// ----------------- CONSTANTS ----------------- //

// ----------------- Register middleware ----------------- //

// Enable CORS for all routes
//  It allows requests from different origins and handles CORS headers and options.
app.use(cors());

// Middleware in which all requests go through
app.use(logRequest);

// Use body-parser middleware to parse JSON requests.
app.use(bodyParser.json());

// Sign in the router
app.use("/", healthRouter);
app.use("/webhook", webhookRouter);
app.use("/api", apiRouter);

// Apply for unmatched routes.
app.use(notFoundError);

// Apply for error during request-response lifecycle.
app.use(errorHandler);

// ----------------- Register middleware ----------------- //

// Export for supertest purposes.
export default app;
