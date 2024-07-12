import { exec } from "child_process";
import path from "path";
import { PassThrough } from "stream";

/**
 * Spawn a process that return the arguments line parsed by the shell
 * @param text Arguments line
 */
export default async function simulateArguments(
  text: string[] | string,
): Promise<string[]> {
  if (Array.isArray(text)) {
    text = text.join(" ");
  }
  const chunks = new Array<string>();

  return new Promise<string[]>((resolve, reject) => {
    const through = new PassThrough();

    through.on("data", (chunk) => {
      chunks.push(chunk.toString());
    });
    through.on("end", () => {
      let parsed: unknown;
      try {
        parsed = JSON.parse(chunks.join(""));
      } catch (reason) {
        console.error(reason);
        reject(new Error("Could not parse the arguments"));
        return;
      }
      if (!Array.isArray(parsed)) {
        reject(new Error("The parsed arguments are not an array"));
        return;
      }
      resolve(parsed);
    });

    const echo = exec(`${path.resolve(__dirname, "echo.js")} ${text}`);
    if (!echo.stdout) {
      reject(new Error("No stdout"));
      return;
    }

    // Pipe the stdout to the through stream
    echo.stdout.pipe(through);

    through.resume();
  });
}
