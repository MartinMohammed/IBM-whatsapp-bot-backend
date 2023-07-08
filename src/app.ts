// Initialize the telegram bot to listen for new messages.
import "./utils/whatsappBot/init";
import "./utils/telegramBot/init";

// Import the necessary libraries: express and body-parser.
import express from "express";
import bodyParser from "body-parser";
// ----------------- Router ----------------- //
import webhookRouter from "./routes/Webhook";
import healthRouter from "./routes/Health";
// ----------------- Router ----------------- //

// ----------------- Custom Middleware ----------------- //
import errorHandler from "./middlewares/errorHandler";
// ----------------- Custom Middleware ----------------- //

import notFoundError from "./middlewares/notFoundError";

// ----------------- CONSTANTS ----------------- //
const app = express();
// ----------------- CONSTANTS ----------------- //

// ----------------- Register middleware ----------------- //
// Use body-parser middleware to parse JSON requests.
app.use(bodyParser.json());

// Sign in the router
app.use("/", healthRouter);
app.use("/webhook", webhookRouter);

// Apply for unmatched routes.
app.use(notFoundError);

// Apply for error during request-response lifecycle.
app.use(errorHandler);

// ----------------- Register middleware ----------------- //

// Export for supertest purposes.
export default app;
