import assignmentValueFromIndex, {
  CreateResultFn,
} from "./assignmentValueFromIndex";
import Character from "./Character";

export default function getArgumentAssignmentFromIndex<T>(
  args: string[],
  index: number,
  argumentName: string,
  createResult: CreateResultFn<T>,
): T | null {
  const current = args[index];
  if (typeof current !== "string") {
    return null;
  }

  const argumentListClone = Array.from(args);

  if (
    current
      .substring(argumentName.length)
      .startsWith(Character.ArgumentAssignmentOperator) &&
    current.substring(0, argumentName.length) === argumentName
  ) {
    const arg = current.substring(0, argumentName.length);
    const parsedValue = current.substring(
      argumentName.length + Character.ArgumentAssignmentOperator.length,
    );

    // Remove the single-argument assignment, and add the split argument name and value
    /**
     * Transform -a.b=1 to -a.b 1 within the list clone
     */
    argumentListClone.splice(index, 1, arg, parsedValue);

    const result = assignmentValueFromIndex(
      argumentListClone,
      index + 1,
      createResult,
    );

    if (result !== null) {
      // Since it's a matching argument, remove the argument value at the given index
      args.splice(index, 1);
      return result;
    }
  }

  // If the argument name does not match, return null
  if (current !== argumentName) {
    return null;
  }

  const result = assignmentValueFromIndex(
    argumentListClone,
    index + 1,
    createResult,
  );

  if (result === null) {
    return result;
  }

  // Since it's a matching argument, remove the argument name and argument value at the given index
  args.splice(index, 2);

  // Return the result
  return result;
}
