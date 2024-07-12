import ArgumentParsingException from "./ArgumentParsingException";

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
    throw new ArgumentParsingException(args, index, reason);
  }
  if (!validate(n)) {
    return null;
  }
  /**
   * Remove the argument from the list
   */
  args.splice(index, 1);
  return n;
}
