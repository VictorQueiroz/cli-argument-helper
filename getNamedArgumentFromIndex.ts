import Character from "./Character";

export default function getNamedArgumentFromIndex<T>(
  index: number,
  args: string[],
  argumentName: string,
  fn: (args: string[], index?: number) => T
) {
  const current = args[index];
  if (typeof current !== "string") {
    return null;
  }
  /**
   * Transform -a.b=1 to -a.b 1
   */
  if (
    current
      .substring(argumentName.length)
      .startsWith(Character.ArgumentAssignmentOperator) &&
    current.substring(0, argumentName.length) === argumentName
    // && current.length > argumentName.length + Character.ArgumentAssignmentOperator.length
  ) {
    const arg = current.substring(0, argumentName.length);
    const parsedValue = current.substring(
      argumentName.length + Character.ArgumentAssignmentOperator.length,
    );
    args.splice(index, 1, arg, parsedValue);
  }
  // if(typeof args[index] !== 'string') {
  //   throw new ArgumentParsingException(args, index, `Expected that the value after ${argumentName} to be a string`);
  // }
  if (args[index] === argumentName) {
    const result = fn(args, index + 1);
    if (result !== null) {
      /**
       * Remove the argument value
       */
      args.splice(index, 1);
      return result;
    }
  }
  return null;
}
