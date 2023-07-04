// Represents the different services that can be accessed in the Cloud API of Meta
export type ServiceType =
  | Services.REGISTER
  | Services.BUSINESS_COMPLIANCE_INFO
  | Services.WHATSAPP_BUSINESS_PROFILE
  | Services.MEDIA
  | Services.MESSAGES
  | Services.DERIGSTER;
// TODO
// | Services.PHONE_NUMBERS

// https://developers.facebook.com/docs/whatsapp/cloud-api/reference
export enum Services {
  // You need to register your phone number
  // * Account Creation
  // * Name Change
  REGISTER = "register",

  // annulment of the phone number registration
  DERIGSTER = "deregister",

  BUSINESS_COMPLIANCE_INFO = "business_compliance_info",
  // To complete the following API calls, you need to get a business profile ID
  // Within the business_profile request, you can specify what you want to know from your business.
  WHATSAPP_BUSINESS_PROFILE = "whatsapp_business_profile",
  // You can use the following endpoints to upload, retrieve, or delete media:
  MEDIA = "media",

  // Endpoint to send text messages, media (audio, documents, images, and video), and message templates to your customers.
  // Prerequisites: UserAccessToken, whatsapp_business_messaging permission, phone-number-id
  // for registered WhatsApp account.
  MESSAGES = "messages",

  // TODO
  // The API call response includes IDs for each of the phone numbers connected to your WhatsApp Business Account
  // PHONE_NUMBERS = "phone_numbers",
}
