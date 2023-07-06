import { whatsappDemoWebhookPayload } from "../../../../testing/data/whatsapp/whatsappDemoWebhookPayload";
import _ from "lodash";
import { IWebhookMessagesPayload } from "../types/webhookMessagesPayload";
import { processWebhookPayload } from "../processWebhookPayload";
import Mutable from "../../../types/mutable";
import { Field, IChange } from "../types/change";
import { IValue } from "../types/change";
import * as ValidateWebhookPayloadModule from "../validateWebhookPayload";
import * as SendTextMessageModule from "../../messagingFeatures/sendTextMessage";

describe("Given a webhook payload: ", () => {
  // Mock the console.log function
  beforeAll(() => {
    jest
      .spyOn(SendTextMessageModule, "sendTextMessage")
      .mockImplementation((textObject) => Promise.resolve());
  });

  beforeEach(() => {
    // Mock the validateWebhookPayload function
    // Allow the Payload data to be valid.
    jest
      .spyOn(ValidateWebhookPayloadModule, "validateWebhookPayload")
      .mockReturnValue(true);
  });

  it("Should throw Error if no messages at all were provided: ", () => {
    // Create a mutable copy of the whatsappDemoWebhookPayload
    const copyOfwhatsappDemoWebhookPayload: Mutable<IWebhookMessagesPayload> =
      _.cloneDeep(whatsappDemoWebhookPayload);

    // Modify the messages property to be undefined
    const change: Mutable<IChange> =
      copyOfwhatsappDemoWebhookPayload.entry[0].changes[0];
    (change.value as Mutable<IValue>).messages = undefined!;

    // Invoke the processWebhookPayload function
    expect(() =>
      processWebhookPayload(copyOfwhatsappDemoWebhookPayload)
    ).toThrowError(Error("Messages should not be empty."));
  });

  it("Should throw Error if a Fieldtype was specified that is not known: ", () => {
    // Create a mutable copy of the whatsappDemoWebhookPayload
    const copyOfwhatsappDemoWebhookPayload: Mutable<IWebhookMessagesPayload> =
      _.cloneDeep(whatsappDemoWebhookPayload);
    const change = copyOfwhatsappDemoWebhookPayload.entry[0].changes[0];
    const invalidWebhookField = "invalid_webhook_field";

    (change as Mutable<IChange>).field = invalidWebhookField as Field;

    expect(() =>
      processWebhookPayload(copyOfwhatsappDemoWebhookPayload)
    ).toThrowError(Error(`Unhandled webhook field: '${invalidWebhookField}'`));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
});
