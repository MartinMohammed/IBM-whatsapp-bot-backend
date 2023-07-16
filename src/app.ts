// Load the env
import "dotenv/config";

// Initialize the whatsapp bot to listen for new messages.
import "./utils/whatsappBot/init";

// Import the necessary libraries: express and body-parser.
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import fs from "fs";
// ----------------- Router ----------------- //
import webhookRouter from "./routes/webhookRouter";
import healthRouter from "./routes/healthRouter";
// ----------------- Router ----------------- //

// ----------------- Custom Middleware ----------------- //
import errorHandler from "./middlewares/errorHandler";
import notFoundError from "./middlewares/notFoundError";
import apiRouter from "./routes/api";
// ----------------- Custom Middleware ----------------- //

// ----------------- EXPORT ALL TYPES FOR THE TYPE BUNDLER ----------------- //
/* Models */
export * from "./customTypes/models/User";
export * from "./customTypes/models/WhatsappMessagesStored";
/* SocketIO */
export * from "./customTypes/socketIO/messages";
export * from "./customTypes/socketIO/contact";
export * from "./customTypes/socketIO/chatNamespace";
export * from "./customTypes/socketIO/root";
/* Rest */
export * from "./customTypes/REST/ClientStoredMessage";
export * from "./customTypes/REST/UsersFilterList";
// ----------------- EXPORT ALL TYPES FOR THE TYPE BUNDLER ----------------- //

// ----------------- Router ----------------- //

// ----------------- CONSTANTS ----------------- //
const app = express();
// ----------------- CONSTANTS ----------------- //

// ----------------- Register middleware ----------------- //

/** Create a write stream in append mode */
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "../logs/access.log")
);

// setup the logger

app.use(
  morgan(process.env.NODE_ENV === "production" ? "combined" : "dev", {
    stream: accessLogStream,
  })
);

// Enable CORS for all routes
// It allows requests from different origins and handles CORS headers and options.
app.use(cors());

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
