import { getString } from "../string";

/**
 * Get a JSON object from the argument list
 * @param args Argument list
 * @param index Index of the argument to take as a JSON object
 * @returns JSON object or null if the value is not a JSON object
 */
export default function getJSON<T = unknown>(
  args: string[],
  index: number,
): T | null {
  const value = getString(args, index);

  if (value === null) {
    return null;
  }

  let result: T;

  try {
    result = JSON.parse(value);
  } catch (error) {
    console.error("Failed to parse JSON value: %s", value);
    return null;
  }

  return result;
}
