/**
 * The prefix will be tested in case insensitive mode
 * @returns A function that removes the given `prefix` from the beginning of a string, if it exists
 */
export default function removePrefix(prefix: string) {
  return (value: string): string => {
    if (value.toLowerCase().startsWith(prefix.toLowerCase())) {
      return value.substring(prefix.length);
    }
    return value;
  };
}
