/** Contains helper methods that can be used throughout the application. */
import { ServiceType, Services } from "../types/service";
import Constants from "../../Constants";

/**
 * Creates a path to the specified URL.
 */
function constructUrlPathToMetaService(service: ServiceType): string {
  const { FacebookBaseUrl, PhoneNumberID, MetaGraphAPIVersion } = Constants;

  switch (service) {
    case Services.BUSINESS_COMPLIANCE_INFO:
    case Services.REGISTER:
    case Services.MEDIA:
    case Services.MESSAGES:
    case Services.DERIGSTER:
    case Services.WHATSAPP_BUSINESS_PROFILE:
      return `${FacebookBaseUrl}/${MetaGraphAPIVersion}/${PhoneNumberID}/${service}`;
    default:
      const _exhaustiveCheck: never = service;
      throw new Error("Unhandled service type: " + service);
  }
}

export default {
  constructUrlPathToMetaService,
};
