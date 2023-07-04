/**
 * Represents a status object within the value object.
 * statuses: Represents the status updates of messages, such as "sent", "delivered", or "read".
 */
export interface IStatus {
  readonly id: string;
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
}

export enum Statuses {
  SEND = "send",
  DELIVERED = "delivered",
  READ = "read",
}
