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
    // Set up Socket.io server for managing connections and co.
    io = new Server<DefaultEventsMap, DefaultEventsMap>(TARGET_PORT);

    // Create a new namespace and set a listener for incoming connection.
    io.of("/messages").on("connection", (socket) => {
      serverSocket = socket;
      messagesController(serverSocket);
      expect(logger.info).toBeCalledWith(
        `Received a socket connection: ${serverSocket.id}.`
      );
      expect(mockedBot.on).toHaveBeenCalled();
    });

    // Establish a connection to the server
    clientSocket = Client(`http://localhost:${TARGET_PORT}/messages`);

    clientSocket.on("connect", () => {
      done();
    });
  });
  it("a message is emitted to the server, expect that sendTextMessage with the bot is called: ", (done) => {
    // Mock the call with the collected serverSocket
    clientSocket.emit("message", demoWhatsappMessageFromClient);

    new Promise((resolve, reject) => {
      setTimeout(() => {
        expect(mockedBot.sendTextMessage).toBeCalledWith(
          demoWhatsappMessageFromClient.text,
          demoWhatsappMessageFromClient.wa_id
        );
        expect(logger.info).toBeCalledWith(
          `Received a whatsapp message from the client to send: ${demoWhatsappMessageFromClient.wa_id}.`
        );
        done();
        resolve(undefined);
      }, 500);
    });
  });

  afterAll((done) => {
    io.close();
    clientSocket.close();
    io.disconnectSockets();
    expect(logger.info).toBeCalledWith(
      `${serverSocket.id} disconnected from the socket connection.`
    );
    jest.restoreAllMocks();
    done();
  });
});
