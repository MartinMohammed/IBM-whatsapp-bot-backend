/**
 * Represents the error when sending a message to the messages endpoint and the send message failed.
 */
export interface IMessagesEndpointError {
  error: {
    message: string;
    type: string;
    code: number;
    error_data: {
      messaging_product: string;
      details: string;
    };
    fbtrace_id: string;
  };
}
