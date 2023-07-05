import * as DevelopmentLoggerModule from "../../logger/developmentLogger";
import winston from "winston";
import Constants from "../Constants";
import Helper from "../Helper";
import { ServiceType, Services } from "../types/service";

describe("Meta Cloud API Service Endpoint Tests", () => {
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

  it("should throw an error if the endpoint does not exist", () => {
    const unknownServiceEndpoint = "unknown_service_endpoint";
    expect(() =>
      Helper.constructUrlPathToMetaService(
        unknownServiceEndpoint as ServiceType
      )
    ).toThrow(Error("Unhandled service type: " + unknownServiceEndpoint));
  });

  it("should not throw an error if the service is valid", () => {
    Object.values(Services).map((validService) => {
      expect(() =>
        Helper.constructUrlPathToMetaService(validService)
      ).not.toThrow(Error("Unhandled service type: " + validService));
    });
  });

  it(`should return the correct URL for the ${Services.MESSAGES} service endpoint`, () => {
    const result = Helper.constructUrlPathToMetaService(Services.MESSAGES);
    const { FacebookBaseUrl, MetaGraphAPIVersion, PhoneNumberID } = Constants;
    const expectedUrl = `${FacebookBaseUrl}/${MetaGraphAPIVersion}/${PhoneNumberID}/${Services.MESSAGES}`;
    expect(result).toBe(expectedUrl);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});
