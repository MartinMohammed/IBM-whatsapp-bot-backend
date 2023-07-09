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

describe("Given is a Whatsapp Message received from Meta emitted by whatsapp bot: ", () => {
  const demoListenerTextMessage: IListenerTextMessage = {
    type: AllMessageTypes.TEXT,
    text: {
      body: "HI",
    },
    from: "SENDER",
  } as unknown as IListenerTextMessage;

  it.todo("Add testing");
});
