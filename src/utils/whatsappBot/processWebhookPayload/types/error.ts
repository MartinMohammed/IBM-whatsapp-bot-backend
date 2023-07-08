/**
 * Represents an error object describing an error.
 */
export interface IErrorMessage {
  /** The error code associated with the error. */
  code: number;
  /** Additional details about the error. */
  details: string;
  /** The title or description of the error. */
  title: string;
}
