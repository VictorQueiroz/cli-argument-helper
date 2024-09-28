import getArgumentAssignmentFromIndex from "./getArgumentAssignmentFromIndex";

/**
 * Get an argument value from the argument list. For example:
 *
 * --user-id 123
 * --user-id=123
 *
 * This function will iterate over the **entire** argument list until it finds the argument.
 * if you need to test a specific index of the argument list, use `getArgumentAssignmentFromIndex`.
 *
 * This function uses `getArgumentAssignmentFromIndex` under the hood.
 *
 * @param args Argument list
 * @param argumentName Named argument
 * @param fn Function to parse the argument value
 * @returns Argument value or null if not found
 */
export default function getArgumentAssignment<T>(
  args: string[],
  argumentName: string,
  fn: (args: string[], index?: number) => T,
) {
  for (let i = 0; i < args.length; i++) {
    const result = getArgumentAssignmentFromIndex(i, args, argumentName, fn);
    if (result !== null) {
      return result;
    }
  }
  return null;
}
