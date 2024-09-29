import { CreateResultFn } from "./assignmentValueFromIndex";

export default function anyOfArgumentAssignment<T>(
  ...fns: CreateResultFn<T>[]
): CreateResultFn<T> {
  return (args, index) => {
    for (const fn of fns) {
      const result = fn(args, index);
      if (result !== null) {
        return result;
      }
    }
    return null;
  };
}
