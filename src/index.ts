// ----------------- Requirements ----------------- //
// Import the necessary libraries: express and body-parser.
import express from "express";
import bodyParser from "body-parser";
import webhookRouter from "./routes/Webhook";
import healthRouter from "./routes/Health";

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

// ----------------- Register routes ----------------- //
// Uncomment the following route handler to respond with "Hi" on the root endpoint.

app.get("/", (req, res) => {
  res.send("Hi");
});
// ----------------- Register routes ----------------- //

const PORT = process.env.PORT || 3000; // Use the provided environment variable or fallback to port 3000.
app.listen(PORT, () => {
  console.log(`Server listening on Port: ${PORT}`);
});
