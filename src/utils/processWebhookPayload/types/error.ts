/**
 * Represents an error object describing an error.
 */
export interface IError {
  readonly code: number;
  readonly title: string;
  readonly message?: string;
  readonly error_data?: {
    readonly details: string;
  };
}
