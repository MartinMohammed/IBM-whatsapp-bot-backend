/**
 * Represents a contact object within the value object.
 */
export interface IContact {
  readonly profile: { readonly name: string };
  readonly wa_id: string;
}
