/**
 * Represents constant values that can be used throughout the application for production.
 */

const SERVER_URL = "https://gymdo.net";

// ------------------------- RELATED TO META -------------------------
/** Base URL for Facebook Graph API */
const metaGraphBaseUrl = "https://graph.facebook.com";
/** Version of the Facebook Graph API */
const metaGraphAPIVersion = "v17.0";
/** Phone number ID */
const phoneNumberId = process.env.PHONE_NUMBER_ID;

// ------------------------- RELATED TO META -------------------------

/**
 * Caution: This object should be handled with care. When using it for testing purposes,
 * make sure to reset them back as in beginning..
 */
export default {
  SERVER_URL,
  metaGraphBaseUrl,
  phoneNumberId,
  metaGraphAPIVersion,
};
