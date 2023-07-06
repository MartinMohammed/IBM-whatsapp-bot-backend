/**
 * Represents an error object describing an error.
 */
export interface IErrorMessage {
  readonly code: number;
  readonly details: string;
  readonly title: string;
}
