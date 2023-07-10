// Mock the logger module
jest.mock("../../../../logger", () => ({
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  http: jest.fn(),
  verbose: jest.fn(),
  debug: jest.fn(),
  silly: jest.fn(),
}));

import { AllMessageTypes, IListenerTextMessage } from "node-whatsapp-bot-api";
import mockLogger from "../../../../logger";
import User from "../../../../models/mongoDB/schemas/User";
import IUser from "../../../../models/mongoDB/types/User";
import { textMessageHandler } from "../textMessageHandler";

describe("Given is a Whatsapp Message received from Meta emitted by whatsapp bot: ", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const demoListenerTextMessage: IListenerTextMessage = {
    type: AllMessageTypes.TEXT,
    text: {
      body: "HI",
    },
    from: "SENDER",
  } as unknown as IListenerTextMessage;

  const demoUser = {
    name: "John Doe",
    wa_id: "1234567890",
    whatsapp_messages: [],
    save: jest.fn(),
  } as unknown as IUser;

  it.todo(
    "should create a new user when one wasn't fond in the db collection."
  );

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
