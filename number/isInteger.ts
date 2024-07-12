import isNumber from "./isNumber";

/**
 * Validates if a number is an integer (not a float)
 */
export default function isInteger(value: unknown): value is number {
  return isNumber(value) && Number.isInteger(value);
}
