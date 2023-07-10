import app from "./app";
import logger from "./logger";
import mongoose from "mongoose";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const connectToDatabase = async (): Promise<void> => {
  try {
    const uri = `mongodb+srv://${process.env.MONGO_ATLAS_DB_USERNAME}:${process.env.MONGO_ATLAS_DB_PASSWORD}@cluster0.pqvdc.mongodb.net/${process.env.MONGO_ATLAS_DB_NAME}?retryWrites=true&w=majority`;
    await mongoose.connect(uri);

    logger.info("Successfully connected to MongoDB Atlas database.");

    app.listen(PORT, () => {
      logger.info(`Server started listening on Port: ${PORT}.`);
    });
  } catch (error) {
    logger.error(`Failed to connect to MongoDB Atlas database: ${error}`);
  }
};

connectToDatabase();
