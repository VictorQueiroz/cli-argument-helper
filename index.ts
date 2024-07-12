/**
 * Find an argument without a value (e.g. --help, --version, ...)
 */
export function getArgument(args: string[], name: string) {
  for (let index = 0; index < args.length; index++) {
    if (args[index] === name) {
      args.splice(index, 1);
      return {
        index,
      };
    }
  }
  return null;
}
