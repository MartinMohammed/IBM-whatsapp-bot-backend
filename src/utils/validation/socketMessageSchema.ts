/** Defines the validation schema for handling incoming message events from the client */
import joi from "@hapi/joi";
import { IWhatsappTextMessageFromClient } from "../../app";
import {
  sentByClientSchema,
  textSchema,
  timeStampSchema,
  waIdSchema,
} from "./reusable";

const socketMessageSchema = joi.object<IWhatsappTextMessageFromClient>({
  text: textSchema.required(),
  wa_id: waIdSchema.required(),
  sentByClient: sentByClientSchema.required(),
  timestamp: timeStampSchema.required(),
});
export default socketMessageSchema;
