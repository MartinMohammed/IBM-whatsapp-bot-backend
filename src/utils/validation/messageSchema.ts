import joi from "@hapi/joi";

const messageSchema = joi.object({
  // Now the different fields
  text: joi.string().trim().min(1).required(),
  wa_id: joi
    .string()
    .regex(/^[1-9]{1}[0-9]{3,14}$/)
    .required(),
});

export default messageSchema;
