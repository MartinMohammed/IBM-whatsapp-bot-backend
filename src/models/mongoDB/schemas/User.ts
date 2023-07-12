import mongoose, { Schema } from "mongoose";
import IUser from "../../../customTypes/models/User";
import IWhatsappMessage from "../../../customTypes/models/WhatsappMessage";
import getUnixTimestamp from "../../../utils/getUnixTimestamp";

/**
 * User Schema for a WhatsApp text message
 */
const messageSchema: Schema<IWhatsappMessage> = new Schema<IWhatsappMessage>({
  text: {
    type: String,
    required: true,
    immutable: true,
    validate: {
      validator: (value: string) => value.length > 0,
      message: "Whatsapp text message must have a length greater 0.",
    },
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
    required: true,
    immutable: true,
  },
});

/**
 * User schema for MongoDB.
 */
const userSchema: Schema<IUser> = new Schema<IUser>({
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
const User = mongoose.model<IUser>("User", userSchema, "users");

export default User;
