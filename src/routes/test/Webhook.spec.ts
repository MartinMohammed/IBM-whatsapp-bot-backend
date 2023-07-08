import supertestRequest from "supertest";
import { cloneDeep } from "lodash";
import app from "../../app";
import _ from "lodash";
import { whatsappDemoWebhookPayload } from "../../testing/data/whatsapp/whatsappDemoWebhookPayload";

const ROUTE = "/webhook";

/**
 * Test suite for the '/webhook' endpoint.
 */
describe(`Endpoint: ${ROUTE}`, () => {
  // Define the appToken and hubChallenge for testing
  const hubVerifyToken = "SECRET_HUB_VERIFY_TOKEN";
  const hubChallenge = "ABCDE";

  /**
   * Testing the route using 'GET' request.
   */
  describe("GET request", () => {
    it("should respond with a 404 status code if no query parameters were given.", async () => {
      const response = await supertestRequest(app).get(ROUTE);

      expect(response.statusCode).toBe(404);
    });

    it("should respond with a 403 status code if the hubVerifyToken is incorrect.", async () => {
      const response = await supertestRequest(app).get(
        `${ROUTE}?hub.mode=subscribe&hub.challenge=${hubChallenge}&hub.verify_token=1234`
      );

      expect(response.statusCode).toBe(403);
    });

    it("should respond with hub.challenge if hub.mode and hub.verify token were correct", async () => {
      const response = await supertestRequest(app).get(
        `${ROUTE}?hub.mode=subscribe&hub.challenge=${hubChallenge}&hub.verify_token=${hubVerifyToken}`
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
      // Request payload didn't claimed to be a whatsapp payload, so we can assume it was a different type of request
      // reaching the endpoint.
      const copyOfwhatsappDemoWebhookPayload = cloneDeep(
        whatsappDemoWebhookPayload
      );
      copyOfwhatsappDemoWebhookPayload.object =
        "not_whatsapp_business_account" as "whatsapp_business_account"; // type casting

      const response = await supertestRequest(app)
        .post(ROUTE)
        .send(copyOfwhatsappDemoWebhookPayload);

      expect(response.statusCode).toBe(404);
    });

    it("should respond with status code '500' if the payload does not contain 'entry' object.", async () => {
      // A error will be thrown because the request claimed to be whatsapp webhook payload but does not have a valid payload.
      const copyOfwhatsappDemoWebhookPayload = _.cloneDeep(
        whatsappDemoWebhookPayload
      );
      copyOfwhatsappDemoWebhookPayload.entry = undefined!;

      const response = await supertestRequest(app)
        .post(ROUTE)
        .send(copyOfwhatsappDemoWebhookPayload);

      expect(response.statusCode).toBe(500);
    });

    it("should respond with status code '200' if the payload is of type 'changes'", async () => {
      const response = await supertestRequest(app)
        .post(ROUTE)
        .send(whatsappDemoWebhookPayload);

      expect(response.statusCode).toBe(200);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
});
