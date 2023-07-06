import supertestRequest from "supertest";
import { cloneDeep } from "lodash";
import app from "../../app";
import Mutable from "../../utils/types/mutable";
import { IWebhookMessagesPayload } from "../../utils/whatsappBot/processWebhookPayload/types/webhookMessagesPayload";
import { whatsappDemoWebhookPayload } from "../../testing/data/whatsapp/whatsappDemoWebhookPayload";

/**
 * Test suite for the '/webhook' endpoint.
 */
describe("Endpoint: /webhook", () => {
  // Define the appToken and hubChallenge for testing
  const appToken = "12345";
  const hubChallenge = "ABCDE";

  // Set up the environment variable before running any test
  beforeAll(() => {
    process.env.VERIFY_TOKEN = appToken;
    // Mock the processWebhookPayload function
    jest.mock(
      "../../utils/whatsappBot/processWebhookPayload/processWebhookPayload",
      () => ({
        processWebhookPayload: jest.fn(),
      })
    );
  });

  /**
   * Testing the route using 'GET' request.
   */
  describe("GET request", () => {
    it("should respond with a 403 status code if no query parameters were given.", async () => {
      const response = await supertestRequest(app).get("/webhook");

      expect(response.statusCode).toBe(403);
    });

    it("should respond with a 403 status code if the hubVerifyToken is incorrect.", async () => {
      const response = await supertestRequest(app).get(
        `/webhook?hub.mode=subscribe&hub.challenge=${hubChallenge}&hub.verify_token=1234`
      );

      expect(response.statusCode).toBe(403);
    });

    it("should respond with hub.challenge if hub.mode and hub.verify token were correct", async () => {
      const response = await supertestRequest(app).get(
        `/webhook?hub.mode=subscribe&hub.challenge=${hubChallenge}&hub.verify_token=${appToken}`
      );

      expect(response.statusCode).toBe(200);
      expect(response.text).toBe(hubChallenge);
    });
  });

  /**
   * Testing the route using 'POST' request.
   */
  describe("POST request", () => {
    // Define the demo changes payload

    it("should respond with status code '404' if the payload is not of type 'whatsapp_business_account'.", async () => {
      const copyOfwhatsappDemoWebhookPayload: Mutable<IWebhookMessagesPayload> =
        cloneDeep(whatsappDemoWebhookPayload);
      copyOfwhatsappDemoWebhookPayload.object =
        "not_whatsapp_business_account" as "whatsapp_business_account"; // type casting

      const response = await supertestRequest(app)
        .post("/webhook")
        .send(copyOfwhatsappDemoWebhookPayload);

      expect(response.statusCode).toBe(404);
    });

    it("should respond with status code '404' if the payload does not contain 'entry' object.", async () => {
      const copyOfwhatsappDemoWebhookPayload: Mutable<IWebhookMessagesPayload> =
        cloneDeep(whatsappDemoWebhookPayload);
      copyOfwhatsappDemoWebhookPayload.entry = undefined!;

      const response = await supertestRequest(app)
        .post("/webhook")
        .send(copyOfwhatsappDemoWebhookPayload);

      expect(response.statusCode).toBe(404);
    });

    it("should respond with status code '200' if the payload is of type 'changes'", async () => {
      const response = await supertestRequest(app)
        .post("/webhook")
        .send(whatsappDemoWebhookPayload);

      expect(response.statusCode).toBe(200);
    });
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
});
