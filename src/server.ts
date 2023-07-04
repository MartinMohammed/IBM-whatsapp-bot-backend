// Load the env variables.
import app from "./app";
import logger from "./logger";

// Use the provided environment variable or fallback to port 3000.
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
app.listen(PORT, () => {
  logger.info(`Server started listening on Port: ${PORT}.`);
});
