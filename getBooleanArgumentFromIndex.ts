/**
 * Try to find an argument named as `name` without any additional validation or transformation of the argument such as:
 * 
 * - `getArgumentFromIndex`
 * - `getArgumentAssignmentFromIndex`
 * 
 * If a match is present at `index`, remove it and return true. Otherwise, return false and do not modify the argument list.
 * 
 * @param args Argument list
 * @param index Index of the argument
 * @param name Name of the argument
 * @returns {boolean} True if a match was found, false otherwise
 */
export default function getBooleanArgumentFromIndex(args: string[], index: number, name: string): boolean {
  const arg = args[index] ?? null;
  if (arg === null || arg !== name) {
    return false;
  }
  args.splice(index, 1);
  return true;
}
