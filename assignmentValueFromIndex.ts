export type CreateResultFn<T = unknown> = (
  args: string[],
  index: number,
) => T | null;

export default function assignmentValueFromIndex<T>(
  args: string[],
  index: number,
  createResult: CreateResultFn<T>,
): T | null {
  const result = createResult(args, index);
  if (result !== null) {
    /**
     * Remove the argument value
     */
    args.splice(index, 1);
  }
  return result;
}
