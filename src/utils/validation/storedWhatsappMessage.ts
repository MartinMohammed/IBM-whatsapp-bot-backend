import joi from "@hapi/joi";
import { IWhatsappTextMessageFromServer } from "../../app";
import {
  sentByClientSchema,
  textSchema,
  timeStampSchema,
  waIdSchema,
  wamIdSchema,
} from "./reusable";

const whatsappMessageFromServerSchema =
  joi.object<IWhatsappTextMessageFromServer>({
    text: textSchema.required(),
    wa_id: waIdSchema.required(),
    wam_id: wamIdSchema.required(),
    sentByClient: sentByClientSchema.required(),
    timestamp: timeStampSchema.required(),
  });

export default whatsappMessageFromServerSchema;
