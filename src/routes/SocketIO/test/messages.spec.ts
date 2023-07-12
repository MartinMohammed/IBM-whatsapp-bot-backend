// Mock the whatsappBot module
jest.mock("../../../utils/whatsappBot/init", () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    on: jest.fn(),
    sendTextMessage: jest.fn(),
  }),
}));

import { Server, Socket } from "socket.io";
import { io as Client, Socket as ClientSocket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import logger from "../../../logger";
import messagesController from "../../../controllers/socketIO/messagesController";

import demoWhatsappMessageFromClient from "../../../testing/data/whatsapp/whatsappDemoMessageFromClient";
import getWhatsappBot from "../../../utils/whatsappBot/init";

describe("Testing the websocket endpoint for the namespace: '/messages'", () => {
  const TARGET_PORT = 4500;
  let io: Server<DefaultEventsMap, DefaultEventsMap>;
  let serverSocket: Socket<DefaultEventsMap, DefaultEventsMap>;
  let clientSocket: ClientSocket;
  const mockedBot = getWhatsappBot();

  beforeEach((done) => {
    jest.clearAllMocks();
    done();
  });

  beforeAll((done) => {
    // Set up Socket.IO server for managing connections and more.
    io = new Server<DefaultEventsMap, DefaultEventsMap>(TARGET_PORT);

    // Create a new namespace and set a listener for incoming connections.
    io.of("/messages").on("connection", (socket) => {
      serverSocket = socket;
      messagesController(serverSocket);
      // Verify that the logger.info function is called with the correct message.
      expect(logger.info).toBeCalledWith(
        `Received a socket connection: ${serverSocket.id}.`
      );
      // Verify that the mockedBot.on function is called.
      expect(mockedBot.on).toHaveBeenCalled();
    });

    // Establish a connection to the server
    clientSocket = Client(`http://localhost:${TARGET_PORT}/messages`);

    // Set up a listener for the 'connect' event, indicating that the connection to the server is established.
    clientSocket.on("connect", () => {
      done();
    });
  });

  it("should call sendTextMessage with the bot when a message is emitted to the server", (done) => {
    // Emit the 'message' event from the clientSocket and pass the demoWhatsappMessageFromClient data.
    clientSocket.emit("message", demoWhatsappMessageFromClient);

    // Create a Promise to handle the asynchronous expectation.
    new Promise((resolve, reject) => {
      // Add a delay to allow time for the event handling and function invocation.
      setTimeout(() => {
        // Verify that the mockedBot.sendTextMessage function is called with the correct arguments.
        expect(mockedBot.sendTextMessage).toBeCalledWith(
          demoWhatsappMessageFromClient.text,
          demoWhatsappMessageFromClient.wa_id
        );
        // Verify that the logger.info function is called with the correct message.
        expect(logger.info).toBeCalledWith(
          `Received a whatsapp message from the client to send: ${demoWhatsappMessageFromClient.wa_id}.`
        );
        done();
        resolve(undefined);
      }, 500);
    });
  });

  afterAll((done) => {
    // Close the Socket.IO server.
    io.close();

    // Disconnect all the connected sockets.
    io.disconnectSockets();

    // Verify that the logger.info function is called with the correct message.
    expect(logger.info).toBeCalledWith(
      `${serverSocket.id} disconnected from the socket connection.`
    );

    // Restore all mocked functions.
    jest.restoreAllMocks();
    done();
  });
});
