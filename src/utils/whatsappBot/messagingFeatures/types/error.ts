/**
 * Represents the error when sending a message to the messages endpoint and the send message failed.
 */
export interface IMessagesEndpointError {
  /**
   * The error object containing information about the error.
   */
  error: {
    /**
     * The error message.
     */
    message: string;
    /**
     * The type of the error.
     */
    type: string;
    /**
     * The error code.
     */
    code: number;
    /**
     * Additional error data.
     */
    error_data: {
      /**
       * The messaging product associated with the error.
       */
      messaging_product: string;
      /**
       * Additional details about the error.
       */
      details: string;
    };
    /**
     * The FB trace ID for tracing the error.
     */
    fbtrace_id: string;
  };
}
