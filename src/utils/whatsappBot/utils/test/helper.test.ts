import Constants from "../../../Constants";
import Helper from "../Helper";
import { ServiceType, Services } from "../../types/service";

describe("Meta Cloud API Service Endpoint Tests", () => {
  beforeAll(() => {});

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

  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
});
