import joi from "@hapi/joi";
import { IWhatsappTextMessageFromClient } from "../../app";
import { textSchema, waIdSchema } from "./reusable";

const messageSchema = joi.object<IWhatsappTextMessageFromClient>({
  // Now the different fields
  text: textSchema.required(),
  wa_id: waIdSchema.required(),
});

export default messageSchema;
