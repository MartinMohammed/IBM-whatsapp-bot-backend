/**
 * Represents constant values that can be used throughout the application for production.
 */
const FacebookBaseUrl = "https://graph.facebook.com";
const PhoneNumber = process.env.PHONE_NUMBER;
const MetaGraphAPIVersion = "v17.0";

export default {
  FacebookBaseUrl,
  PhoneNumber,
  MetaGraphAPIVersion,
};
