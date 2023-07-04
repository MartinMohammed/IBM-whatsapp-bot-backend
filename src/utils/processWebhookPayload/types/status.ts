import { IErrorMessage } from "./error";

/**
 * Represents a status object within the value object.
 * statuses: Represents the status updates of messages, such as "sent", "delivered", or "read".
 */
export interface IStatus {
  readonly id: string;
  // The following notification is received when a business sends a message as part of
  // a user-initiated conversation (if that conversation did not originate in a free entry point)
  readonly status: Statuses.SEND | Statuses.READ | Statuses.DELIVERED;
  readonly timestamp: string;
  readonly recipient_id: string;
  readonly conversation?: {
    readonly id: string;
    readonly origin: {
      readonly type: string;
    };
    readonly expiration_timestamp?: string;
  };
  readonly pricing?: {
    readonly billable: boolean;
    readonly pricing_model: string;
    readonly category: string;
  };
  // Status: Message Failed
  errors?: IErrorMessage[];
}

export enum Statuses {
  SEND = "send",
  DELIVERED = "delivered",
  READ = "read",
}
