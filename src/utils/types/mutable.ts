/**
 * The mapped type syntax [K in keyof T] iterates over each property key
 * and creates a new property in the resulting type.
 * The -readonly prefix removes the readonly modifier from each property,
 * making them mutable.
 */
type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

export default Mutable;
