/**
 * Check if the argument at the given index matches the given name.
 *
 * This function only checks if the argument at the given index is a string and if it matches the given name.
 * It will return false if the argument is not a string or doesn't match.
 *
 * @param args Argument list
 * @param index Index to check
 * @param name Name of the argument
 * @returns True if the argument matches, false otherwise
 */
export default function getBooleanArgumentFromIndex(
  args: string[],
  index: number,
  name: string,
): boolean {
  const current = args[index];
  if (typeof current !== "string" || current !== name) {
    return false;
  }
  return true;
}
