import getArgumentFromIndex from "../getArgumentFromIndex";

export function getString(args: string[], index: number = 0): string | null {
  return getArgumentFromIndex<string>(
    args,
    index,
    (value) => `${value}`,
    (value) => typeof value === "string",
  );
}
