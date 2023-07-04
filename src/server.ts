// Load the env variables.
import app from "./app";

// Use the provided environment variable or fallback to port 3000.
const PORT = process.env.PORT ? +process.env.PORT : 3000;
app.listen(PORT, () => {
  console.log(`Server listening on Port: ${PORT}`);
});
