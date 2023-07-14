import mongoose, { Schema } from "mongoose";
import UserModelType from "../../../customTypes/models/User";
import getUnixTimestamp from "../../../utils/getUnixTimestamp";
import { WhatsappMessageStoredType } from "../../../customTypes/models/WhatsappMessagesStored";

/**
 * User Schema for a WhatsApp text message
 */
const messageSchema: Schema<WhatsappMessageStoredType> = new Schema<WhatsappMessageStoredType>({
  text: {
    type: String,
    required: true,
    immutable: true,
    validate: {
      validator: (value: string) => value.length > 0,
      message: "Whatsapp text message must have a length greater 0.",
    },
    unique: false, 
  },

  wa_id: {
    type: String,
    required: true,
    immutable: true,
    validate: {
      // Ensure the length of a phone number is 10.
      validator: (value: string) => value.length >= 10,
      message: "Phone number must be of length 12 characters",
    },
  },
  timestamp: {
    type: Number,
    immutable: true,
    // Auto generate if not provided
    default: () => getUnixTimestamp(),
  },
  // Set by meta or after we have sent the message to meta if the message originated before from client
  wam_id: {
    type: String,
    validate: {
      validator: (value: string) => value.length === 62,
      message: ({ value }) =>
        `${value} is not a valid WAMID with the length of 62.`,
    },
    index: true, 
    unique: true, 
    required: true,
    immutable: true,
  },
  sentByClient: {
    type: Boolean, 
    required: true, 
    immutable: true, 
  },
});


/**
 * User schema for MongoDB.
 */
const userSchema: Schema<UserModelType> = new Schema<UserModelType>({
  name: { type: String, required: true, immutable: false, lowercase: true },
  wa_id: { type: String, required: true, immutable: true, unique: true }, // wa_id used to identify users (outside of document id)
  whatsapp_messages: {
    type: [messageSchema],
    default: [],
  },
});

/**
 * User model for MongoDB.
 */
const User = mongoose.model<UserModelType>("User", userSchema, "users");

export default User;
