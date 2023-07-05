// Import the necessary dependencies and types
import { validateWebhookPayload } from "../validateWebhookPayload";
import { IWebhookMessagesPayload } from "../types/webhookMessagesPayload";
import Mutable from "../../types/mutable";
import _ from "lodash";
import { demoChangesPayload } from "../../../demoData/webhookPayload";
import { IChange } from "../types/change";
import winston = require("winston");
import * as DevelopmentLoggerModule from "../../../logger/developmentLogger";

describe("Given sample WebhookPayload: ", () => {
  // Define the demo changes payload
  beforeAll(() => {
    // Create a mock logger object that satisfies the Logger type
    const mockLogger: unknown = {
      error: jest.fn(),
      warn: jest.fn(),
      http: jest.fn(),
      info: jest.fn(),
      // Add other methods from the Logger type if needed
    };
    jest
      .spyOn(DevelopmentLoggerModule, "developmentLogger")
      .mockReturnValue(mockLogger as winston.Logger);
  });

  // Test to check if the payload is not of type 'whatsapp_business_account'
  it("should return false if the payload is not of type 'whatsapp_business_account'.", async () => {
    const copyOfDemoChangesPayload: Mutable<IWebhookMessagesPayload> =
      _.cloneDeep(demoChangesPayload);

    // Change the object type to a non-whatsapp_business_account type for testing
    copyOfDemoChangesPayload.object =
      "not_whatsapp_business_account" as "whatsapp_business_account"; // type casting

    // Call the validateWebhookPayload function with the modified payload
    const isValidPayload = validateWebhookPayload(copyOfDemoChangesPayload);

    // Expect the function to return false for an invalid payload
    expect(isValidPayload).toBe(false);
  });

  // Test to check if the payload does not contain the 'entry' object
  it("should return false if first entry of the payload is not defined and if it does not contain 'entry' object.", async () => {
    const copyOfDemoChangesPayload: Mutable<IWebhookMessagesPayload> =
      _.cloneDeep(demoChangesPayload);

    copyOfDemoChangesPayload.entry[0] = undefined!;

    // Call the validateWebhookPayload function with the modified payload
    let isValidPayload = validateWebhookPayload(copyOfDemoChangesPayload);

    // Expect the function to return false for an invalid payload
    expect(isValidPayload).toBe(false);

    // Remove the 'entry' object from the payload for testing
    copyOfDemoChangesPayload.entry = undefined!;

    // Call the validateWebhookPayload function with the modified payload
    isValidPayload = validateWebhookPayload(copyOfDemoChangesPayload);

    // Expect the function to return false for an invalid payload
    expect(isValidPayload).toBe(false);
  });

  // Test to check if the payload first entry does not contain changes
  it("should return false if the payload first entry and first change does not have .value property.", async () => {
    let copyOfDemoChangesPayload: Mutable<IWebhookMessagesPayload> =
      _.cloneDeep(demoChangesPayload);

    let changes: Mutable<IChange>[] = copyOfDemoChangesPayload.entry[0].changes;

    changes[changes.length - 1].value = undefined!;

    // Call the validateWebhookPayload function with the modified payload
    let isValidPayload = validateWebhookPayload(copyOfDemoChangesPayload);
    // Expect the function to return false for an invalid payload
    expect(isValidPayload).toBe(false);
  });

  // Test to check if the payload is of type 'changes' and contains all required fields
  it("should return true if the payload is of type 'changes' and contains all required fields.", async () => {
    // Call the validateWebhookPayload function with the original demoChangesPayload
    const isValidPayload = validateWebhookPayload(demoChangesPayload);

    // Expect the function to return true for a valid payload
    expect(isValidPayload).toBe(true);
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
});
