import app from "./app";
import logger from "./logger";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { ChatNamespace } from "./customTypes/socketIO/chatNamespace";
import { AllNamespaces } from "./customTypes/socketIO/root";
import messagesController from "./controllers/socketIO/chatController";
import initMongoDb from "./utils/initMongoDb";
import auth from "./middlewares/socketIO/authMiddleware";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const connectToDatabase = async (): Promise<void> => {
  try {
    if (process.env.NODE_ENV !== "test") {
      // If db connection fails a error will be thrown and the http server will not start.
      await initMongoDb();
      logger.info("Successfully connected to MongoDB Atlas database.");
    }

    const httpServer = app.listen(PORT, () => {
      logger.info(`Server started listening on Port: ${PORT}.`);
    });

    // Create a new socket.io server based on the existing http server returned by app.listen()
    const io = new Server(httpServer, {
      cors: {
        // TODO: Trusted url
        origin: "*",
      },
    });
    // Initialize the messages namespace
    const chatNamespace: ChatNamespace = io.of(AllNamespaces.CHAT);

    // Register middleware for authentication
    chatNamespace.use(auth);

    //   Listen for incoming connection requests.
    chatNamespace.on("connection", messagesController);
  } catch (error) {
    logger.error(`Failed to connect to MongoDB Atlas database: ${error}`);
  }
};

connectToDatabase();
