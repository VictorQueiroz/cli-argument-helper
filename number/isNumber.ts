/**
 * Validates whether a number is either a valid integer or a float
 * @returns true if the value is a number
 */
export default function isNumber(value: unknown): value is number {
  return (
    typeof value === "number" && Number.isFinite(value) && !Number.isNaN(value)
  );
}
