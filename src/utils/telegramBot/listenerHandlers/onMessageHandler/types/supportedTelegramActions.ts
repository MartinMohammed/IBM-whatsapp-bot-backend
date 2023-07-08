/** The first index of a Telegram message may contain an icon that indicates an action to be performed by the backend, such as sending a WhatsApp message. */
export enum SupportedTelegramActions {
  SEND_WHATSAPP_MESSAGE = "✅",
}

/** Represents a supported action in a Telegram message */
export type SupportedTelegramActionType =
  SupportedTelegramActions.SEND_WHATSAPP_MESSAGE;
