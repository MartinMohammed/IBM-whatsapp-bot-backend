// Import the necessary dependencies and types
import { validateWebhookPayload } from "../validateWebhookPayload";
import { IWebhookMessagesPayload } from "../types/webhookMessagesPayload";
import Mutable from "../../../types/mutable";
import _ from "lodash";
import { whatsappDemoWebhookPayload } from "../../../../testing/data/whatsapp/whatsappDemoWebhookPayload";
import { IChange } from "../types/change";

describe("Given sample WebhookPayload: ", () => {
  // Define the demo changes payload
  beforeAll(() => {});

  // Test to check if the payload is not of type 'whatsapp_business_account'
  it("should return false if the payload is not of type 'whatsapp_business_account'.", async () => {
    const copyOfwhatsappDemoWebhookPayload: Mutable<IWebhookMessagesPayload> =
      _.cloneDeep(whatsappDemoWebhookPayload);

    // Change the object type to a non-whatsapp_business_account type for testing
    copyOfwhatsappDemoWebhookPayload.object =
      "not_whatsapp_business_account" as "whatsapp_business_account"; // type casting

    // Call the validateWebhookPayload function with the modified payload
    const isValidPayload = validateWebhookPayload(
      copyOfwhatsappDemoWebhookPayload
    );

    // Expect the function to return false for an invalid payload
    expect(isValidPayload).toBe(false);
  });

  // Test to check if the payload does not contain the 'entry' object
  it("should return false if first entry of the payload is not defined and if it does not contain 'entry' object.", async () => {
    const copyOfwhatsappDemoWebhookPayload: Mutable<IWebhookMessagesPayload> =
      _.cloneDeep(whatsappDemoWebhookPayload);

    copyOfwhatsappDemoWebhookPayload.entry[0] = undefined!;

    // Call the validateWebhookPayload function with the modified payload
    let isValidPayload = validateWebhookPayload(
      copyOfwhatsappDemoWebhookPayload
    );

    // Expect the function to return false for an invalid payload
    expect(isValidPayload).toBe(false);

    // Remove the 'entry' object from the payload for testing
    copyOfwhatsappDemoWebhookPayload.entry = undefined!;

    // Call the validateWebhookPayload function with the modified payload
    isValidPayload = validateWebhookPayload(copyOfwhatsappDemoWebhookPayload);

    // Expect the function to return false for an invalid payload
    expect(isValidPayload).toBe(false);
  });

  // Test to check if the payload first entry does not contain changes
  it("should return false if the payload first entry and first change does not have .value property.", async () => {
    let copyOfwhatsappDemoWebhookPayload: Mutable<IWebhookMessagesPayload> =
      _.cloneDeep(whatsappDemoWebhookPayload);

    let changes: Mutable<IChange>[] =
      copyOfwhatsappDemoWebhookPayload.entry[0].changes;

    changes[changes.length - 1].value = undefined!;

    // Call the validateWebhookPayload function with the modified payload
    let isValidPayload = validateWebhookPayload(
      copyOfwhatsappDemoWebhookPayload
    );
    // Expect the function to return false for an invalid payload
    expect(isValidPayload).toBe(false);
  });

  // Test to check if the payload is of type 'changes' and contains all required fields
  it("should return true if the payload is of type 'changes' and contains all required fields.", async () => {
    // Call the validateWebhookPayload function with the original whatsappDemoWebhookPayload
    const isValidPayload = validateWebhookPayload(whatsappDemoWebhookPayload);

    // Expect the function to return true for a valid payload
    expect(isValidPayload).toBe(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
});
