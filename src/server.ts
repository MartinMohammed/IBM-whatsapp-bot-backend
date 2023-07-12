import app from "./app";
import logger from "./logger";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { MessagesNamespace } from "./customTypes/socketIO/messagesNamespace";
import { AllNamespaces } from "./customTypes/socketIO/root";
import messagesController from "./controllers/socketIO/messagesController";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const connectToDatabase = async (): Promise<void> => {
  try {
    if (process.env.NODE_ENV !== "test") {
      const uri = `mongodb+srv://${process.env.MONGO_ATLAS_DB_USERNAME}:${process.env.MONGO_ATLAS_DB_PASSWORD}@cluster0.pqvdc.mongodb.net/${process.env.MONGO_ATLAS_DB_NAME}?retryWrites=true&w=majority`;
      await mongoose.connect(uri);

      logger.info("Successfully connected to MongoDB Atlas database.");
    }

    const httpServer = app.listen(PORT, () => {
      logger.info(`Server started listening on Port: ${PORT}.`);
    });

    // Create a new socket.io server based on the existing http server returned by app.listen()
    const io = new Server(httpServer);
    // Initialize the messages namespace
    const messagesNamespace: MessagesNamespace = io.of(AllNamespaces.MESSAGES);
    //   Listen for incoming connection requests.
    messagesNamespace.on("connection", messagesController);
  } catch (error) {
    logger.error(`Failed to connect to MongoDB Atlas database: ${error}`);
  }
};

connectToDatabase();
