import Character from "./Character";

/**
 * Get a named argument from the argument list. For example:
 *
 * --user-id 123
 * --user-id=123
 *
 * @param args Argument list
 * @param argumentName Named argument
 * @param fn Function to parse the argument value
 * @returns Argument value or null if not found
 */
export default function getNamedArgument<T>(
  args: string[],
  argumentName: string,
  fn: (args: string[], index?: number) => T,
) {
  for (let i = 0; i < args.length; i++) {
    const current = args[i];
    if (typeof current === "string") {
      /**
       * Transform -a.b=1 to -a.b 1
       */
      if (
        current
          .substring(argumentName.length)
          .startsWith(Character.ArgumentAssignmentOperator)
      ) {
        const arg = current.substring(0, argumentName.length);
        const parsedValue = current.substring(
          argumentName.length + Character.ArgumentAssignmentOperator.length,
        );
        args.splice(i, 1, arg, parsedValue);
      }
    }
    if (args[i] === argumentName) {
      const result = fn(args, i + 1);
      if (result !== null) {
        /**
         * remove
         */
        args.splice(i, 1);
        return result;
      }
    }
  }
  return null;
}
