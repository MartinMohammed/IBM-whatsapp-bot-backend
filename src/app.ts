// ----------------- Requirements ----------------- //
// Import the necessary libraries: express and body-parser.
import express from "express";
import bodyParser from "body-parser";
import webhookRouter from "./routes/Webhook";
import healthRouter from "./routes/Health";

// Initialize the telegram bot to listen for new messages.
import "./utils/telegramBot";
// ----------------- Requirements ----------------- //

// ----------------- CONSTANTS ----------------- //
const app = express();
// ----------------- CONSTANTS ----------------- //

// ----------------- Register middleware ----------------- //
// Use body-parser middleware to parse JSON requests.
app.use(bodyParser.json());

// Sign in the router
app.use("/", healthRouter);
app.use("/webhook", webhookRouter);
// ----------------- Register middleware ----------------- //

// Export for supertest purposes.
export default app;
