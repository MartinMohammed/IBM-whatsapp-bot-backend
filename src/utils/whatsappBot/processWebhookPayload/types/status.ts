import { IErrorMessage } from "./error";

/**
 * Represents a status object within the value object.
 * statuses: Represents the status updates of messages, such as "sent", "delivered", or "read".
 */
export interface IStatus {
  id: string;
  /**
   * The following notification is received when a business sends a message as part of
   * a user-initiated conversation (if that conversation did not originate in a free entry point)
   */
  status: Statuses.SEND | Statuses.READ | Statuses.DELIVERED;
  timestamp: string;
  recipient_id: string;
  conversation?: {
    id: string;
    origin: {
      type: string;
    };
    expiration_timestamp?: string;
  };
  pricing?: {
    billable: boolean;
    pricing_model: string;
    category: string;
  };
  /**
   * Status: Message Failed
   */
  errors?: IErrorMessage[];
}

export enum Statuses {
  SEND = "send",
  DELIVERED = "delivered",
  READ = "read",
}
