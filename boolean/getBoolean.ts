import { getString } from "../string";

export type ArgumentHelperBooleanAcceptedValues = [boolean, string[]][];

export const booleanDefaults: {
  acceptedValues: ArgumentHelperBooleanAcceptedValues;
} = {
  acceptedValues: [
    [true, ["on", "true", "y", "yes", "ON", "TRUE", "YES", "Y"]],
    [false, ["off", "false", "n", "no", "OFF", "FALSE", "NO", "N"]],
  ],
};

/**
 * Get a boolean value from the argument list. By default, if none of the `acceptedValues` are matched,
 * it will try to parse the value as an integer and return true if it is greater than or equal to 1, false otherwise.
 *
 * It will print a trace message if the string can be parsed into a number and it is below 0, but it will still return false
 * either way.
 * @param args Argument list
 * @param index Index of the argument to take as a boolean
 * @param acceptedValues Values that are accepted for both true and false. Defaults to `defaultAcceptedBooleanValues`
 * @returns Boolean value or null if the value is not a boolean
 */
export default function getBoolean(
  args: string[],
  index: number = 0,
  acceptedValues = booleanDefaults.acceptedValues,
): boolean | null {
  const value = getString(args, index);
  if (value === null) {
    return value;
  }
  /**
   * Check if the value matches any of the predefined values (e.g. 'on', 'off', 'true', 'false', 'y', 'n', 'yes', 'no')
   */
  for (const [result, acceptedValue] of acceptedValues) {
    if (acceptedValue.includes(value)) {
      return result;
    }
  }
  const n = parseInt(value, 10);
  if (!Number.isNaN(n) && Number.isFinite(n) && Number.isInteger(n)) {
    if (n >= 1) {
      return true;
    } else if (n < 0) {
      // console.trace(
      //   `getBoolean: Value is not recognized as a boolean value: %o`,
      //   n,
      // );
    }
    return false;
  }
  return null;
}
