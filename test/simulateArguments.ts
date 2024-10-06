import { spawn } from "child-process-utilities";
import path from "path";

/**
 * Spawn a process that return the arguments line parsed by the shell
 * @param args Arguments line
 */
export default async function simulateArguments(
  args: string[],
): Promise<string[]>;
/**
 * Spawn a process that return the arguments line parsed by the shell
 * @param args Arguments line
 * @returns The arguments line parsed by the shell
 * @deprecated Pass an array to `args` instead
 */
export default async function simulateArguments(
  args: string,
): Promise<string[]>;
export default async function simulateArguments(
  args: string[] | string,
): Promise<string[]> {
  if (typeof args === "string") {
    args = args.split(" ");
  }

  const result = await spawn
    .pipe("node", [path.resolve(__dirname, "echo.js"), ...args])
    .output()
    .stdout()
    .json<string[]>();

  return result;
}
