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

jest.mock(
  "../../../telegramBot/messagingFeatures/telegramSendTextMessageWrapper",
  () => jest.fn()
);
import { textMessageHandler } from "../textMessageHandler";
import { AllMessageTypes, IListenerTextMessage } from "node-whatsapp-bot-api";
import Constants from "../../../Constants";
import sendTextMessageWrapper from "../../../telegramBot/messagingFeatures/telegramSendTextMessageWrapper";
import mockLogger from "../../../../logger";

describe("Given is a Whatsapp Message received from Meta emitted by whatsapp bot: ", () => {
  const demoListenerTextMessage: IListenerTextMessage = {
    type: AllMessageTypes.TEXT,
    text: {
      body: "HI",
    },
    from: "SENDER",
  } as unknown as IListenerTextMessage;
  const mockSendTextMessageWrapper = sendTextMessageWrapper as jest.Mock;

  /** It should be tested whether the broadcast of the received message worked or not */
  it("broadcast the message to every telegram user that is whitelisted. ", async () => {
    mockSendTextMessageWrapper.mockImplementationOnce((_: number, __: string) =>
      Promise.reject(Error("Failed"))
    );
    textMessageHandler(demoListenerTextMessage);
    Constants.MESSAGE_WHITE_LIST.forEach((telegramChatId) => {
      expect(mockSendTextMessageWrapper).toBeCalledWith(
        telegramChatId,
        `Hi, wir haben eine neue Nachricht von ${demoListenerTextMessage.contact.wa_id} erhalten.\n\nDie Nachricht lautet: '${demoListenerTextMessage.text.body}'.\n\nWenn du darauf antworten möchtest, swipe die Nachricht nach link und antworte.`
      );
    });
    expect(mockSendTextMessageWrapper).toBeCalledTimes(
      Constants.MESSAGE_WHITE_LIST.length
    );
    expect(mockLogger.info).toBeCalledWith(
      "Now broadcasting the received WhatsApp message to whitelisted chats."
    );
  });
});
