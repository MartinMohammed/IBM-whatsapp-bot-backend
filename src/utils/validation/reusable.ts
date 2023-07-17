import joi from "@hapi/joi";

export const timeStampSchema = joi.number();

export const textSchema = joi.string().trim().min(1);

export const waIdSchema = joi.string().regex(/^[1-9]{1}[0-9]{3,14}$/);

export const wamIdSchema = joi.string().regex(/^wamid\..*$/);

export const sentByClientSchema = joi.boolean();
