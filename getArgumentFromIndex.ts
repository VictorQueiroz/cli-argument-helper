import ArgumentParsingException from "./ArgumentParsingException";

/**
 * Get an argument from the argument list based on the given index.
 * @param args List of arguments
 * @param index Index of the argument that we're trying to get
 * @param transform Transformation function
 * @param validate Validation function
 * @returns {T | null} Argument value or null if the value is not valid or not found
 */
export default function getArgumentFromIndex<T>(
  args: string[],
  index: number = 0,
  transform: (value: string) => T,
  validate: (value: unknown) => value is T,
): T | null {
  const a = args[index];
  if (typeof a !== "string") {
    return null;
  }
  let n: T;
  try {
    n = transform(a);
  } catch (reason) {
    console.error(
      "Failed to transform while trying to get argument from index %d: %s",
      index,
      a,
    );
    throw new ArgumentParsingException(args, index, reason);
  }
  try {
    if (!validate(n)) {
      return null;
    }
  } catch (reason) {
    console.error(
      "Failed to validate while trying to get argument from index %d: %s",
      index,
      n,
    );
    throw new ArgumentParsingException(args, index, reason);
  }
  /**
   * Remove the argument from the list
   */
  args.splice(index, 1);
  return n;
}
