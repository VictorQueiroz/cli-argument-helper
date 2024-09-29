import getArgumentFromIndex from "../getArgumentFromIndex";

/**
 * Create a function to parse a number from the argument list
 * @param base Radix of the number (e.g. 10 for decimal, 16 for hexadecimal, ...)
 * @param validate Validation function (e.g. isInteger, isNumber, ...)
 * @param transform Transformation function (e.g. toLowerCase, toUpperCase, removePrefix('0o'), removePrefix('0b'), ...)
 * @returns A function to remove an argument from the list and parse it as a number according to the given arguments
 */
export default function createGetNumber(
  base: number,
  validate: (value: unknown) => value is number,
  transform: ((value: string) => string) | null = null,
): (args: string[], index: number) => number | null {
  return (args: string[], index: number) =>
    getArgumentFromIndex(
      args,
      index,
      (value) => parseInt(transform !== null ? transform(value) : value, base),
      validate,
    );
}
