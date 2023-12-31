import supertestRequest from "supertest";
import app from "../../../app";
import createHttpError from "http-errors";

/**
 * Test suite for the notFound middleware when the route mismatched.
 */
describe("Testing the notFound middleware when the route mismatched: ", () => {
  /**
   * Test case: should respond with 404 if there is no match for the route.
   */
  it("should respond with 404 if there is no match for the route", async () => {
    const expectedError = createHttpError.NotFound("Not found.");
    const response = await supertestRequest(app).get(`/invalid/route`);
    const { body } = response;

    expect(response.statusCode).toBe(404);
    expect(body.error.statusCode).toBe(expectedError.statusCode);
    expect(body.error.message).toBe(expectedError.message);
  });
});
