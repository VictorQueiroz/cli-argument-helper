function alwaysTrueFunction() {
  return true;
}

function returnInputFunction<T>(value: T) {
  return value;
}

export function getInteger(args: string[], index: number = 0): number | null {
  return getArgumentFromIndex(
    args,
    index,
    (value) => parseInt(value, 10),
    (value) =>
      Number.isInteger(value) && Number.isFinite(value) && !Number.isNaN(value)
  );
}

export function getString(args: string[], index: number = 0): string | null {
  return getArgumentFromIndex<string>(
    args,
    index,
    returnInputFunction,
    alwaysTrueFunction
  );
}

export function getArgumentFromIndex<T>(
  args: string[],
  index: number = 0,
  transform: (value: string) => T,
  validate: (value: T) => boolean
): T | null {
  const a = args[index];
  if (typeof a !== "string") {
    return null;
  }
  const n = transform(a);
  if (!validate(n)) {
    return null;
  }
  args.splice(index, 1);
  return n;
}

export function getNamedArgument<T>(
  args: string[],
  value: string,
  fn: (args: string[], index?: number) => T
) {
  for (let i = 0; i < args.length; i++) {
    if (args[i] === value) {
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
