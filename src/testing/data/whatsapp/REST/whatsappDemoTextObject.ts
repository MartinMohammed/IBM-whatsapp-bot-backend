/** Import the demoUser from the specified path */


/** Import the MessageTypes enum from the specified path */
/** Import the ITextObject interface from the specified path */
import { AllMessageTypes, ITextObject } from "node-whatsapp-bot-api";
import { demoWhatsappContact } from "./whatsappDemoWebhookPayload";

/**
 * Demo text object that is sent to the user.
 */
const whatsappDemoTextObject: ITextObject = {
  /** Specify the messaging product as "whatsapp" */
  messaging_product: "whatsapp",
  /** Specify the recipient type as "individual" */
  recipient_type: "individual",
  /** Assign the recipient "to" value from the demoUser object */
  to: demoWhatsappContact.wa_id,
  /** Specify the message type as TEXT using the MessageTypes.TEXT enum */
  type: AllMessageTypes.TEXT,
  /** Define the text object with the desired properties */
  text: {
    /** Disable preview URL for the text message */
    preview_url: false,
    /** Set the body of the text message as "Hi" */
    body: "Hi",
  },
};

/** Export the whatsappDemoTextObject as the default export */
export default whatsappDemoTextObject;
