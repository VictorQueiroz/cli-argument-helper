#!/bin/env node

import assert from "assert";

async function writeArguments() {
  let result: boolean | null = null;
  await new Promise<void>((resolve, reject) => {
    result = process.stdout.write(
      JSON.stringify(process.argv.slice(2), null, 2),
      "utf8",
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      },
    );
  });
  assert.strict.ok(result !== null);
  return result;
}

(async () => {
  const result = await writeArguments();
  if (!result) {
    process.stdout.once("drain", writeArguments);
  }
})().catch((reason) => {
  console.error(reason);
  process.exit(1);
});
