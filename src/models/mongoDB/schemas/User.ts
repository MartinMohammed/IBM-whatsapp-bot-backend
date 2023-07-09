import mongoose, { Schema } from "mongoose";
import IUser from "../types/User";
import IWhatsappMessage from "../types/WhatsappMessage";
import getUnixTimestamp from "../../../utils/getUnixTimestamp";

/**
 * User Schema for a WhatsApp text message
 */
const messageSchema: Schema<IWhatsappMessage> = new Schema<IWhatsappMessage>({
  text: { type: String, required: true, immutable: true },
  sender: {
    type: String,
    required: true,
    immutable: true,
    validate: {
      // Ensure the length of a phone number is 10.
      validator: (value: string) => value.length === 10,
      message: "Phone number must be of length 10 characters",
    },
  },
  timestamp: {
    type: Number,
    immutable: true,
    // Auto generate if not provided
    default: () => getUnixTimestamp(),
  },
  wam_id: {
    type: String,
    validate: {
      validator: (value: string) => value.length === 40,
      message: ({ value }) =>
        `${value} is not a valid WAMID with the length of 40.`,
    },
    required: true,
    immutable: true,
  },
});

/**
 * User schema for MongoDB.
 */
const userSchema: Schema<IUser> = new Schema<IUser>({
  name: { type: String, required: true, immutable: false },
  wa_id: { type: String, required: true, immutable: true },
  whatsapp_messages: {
    type: [messageSchema],
    default: [],
  },
});

/**
 * User model for MongoDB.
 */
const User = mongoose.model<IUser>("User", userSchema);

export default User;
