import supertestRequest from "supertest";
import app from "../../app";

describe("Testing the notFound middleware when the route mismatched: ", () => {
  it("should respond with 404 if there is no match for the route", async () => {
    const response = await supertestRequest(app).get(`/invalid/route`);
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ message: "Not found" });
  });
});
