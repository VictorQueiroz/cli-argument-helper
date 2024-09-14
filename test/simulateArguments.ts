import { exec } from "child_process";
import path from "path";
import which from "which";

/**
 * Spawn a process that return the arguments line parsed by the shell
 * @param args Arguments line
 */
export default async function simulateArguments(
  args: string[] | string,
): Promise<string[]> {
  if (typeof args === "string") {
    args = [args];
  }

  const executables = {
    node: await which("node"),
    shell: await which("sh"),
  };

  return new Promise<string[]>((resolve, reject) => {
    exec(
      `${executables.node} ${path.resolve(__dirname, "echo.js")} ${args.join(
        " ",
      )}`,
      {
        shell: executables.shell,
      },
      (err, stdout, stderr) => {
        if (err) {
          reject(err);
          return;
        }
        if (stderr) {
          reject(new Error(stderr));
          return;
        }
        try {
          resolve(JSON.parse(stdout));
        } catch (reason) {
          reject(reason);
        }
      },
    );
  });
}
