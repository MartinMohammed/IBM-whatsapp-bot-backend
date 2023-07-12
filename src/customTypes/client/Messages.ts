/** This defines how the messages look like when it is send by the user from the client side */
export interface IMessageFromClient {
  wa_id: string; // the phone number of the user.
  //   timestamp: number; // timestamp in 1970 seconds format.
}

export interface ITextMessageFromClient extends IMessageFromClient {
  text: string;
}
