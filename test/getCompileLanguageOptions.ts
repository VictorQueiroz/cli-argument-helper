import assert from "assert";
import getArgumentAssignmentFromIndex from "../getArgumentAssignmentFromIndex";
import { getString } from "../string";
import getBoolean from "../boolean/getBoolean";

export default function getCompileLanguageOptions(
  args: string[],
  index: number,
) {
  const language = getArgumentAssignmentFromIndex(
    args,
    index,
    "--compile",
    getString,
  );
  assert.strict.ok(language !== null);
  const possibleArgs = ["--release", "--debug", "--clean"];
  const compileOptions: {
    buildType: "release" | "debug";
    clean: boolean;
  } = { clean: false, buildType: "release" };
  for (const possibleArgument of possibleArgs) {
    if (
      getArgumentAssignmentFromIndex(
        args,
        index,
        possibleArgument,
        getBoolean,
      ) !== true
    ) {
      continue;
    }
    switch (possibleArgument) {
      case "--release":
        compileOptions.buildType = "release";
        break;
      case "--debug":
        compileOptions.buildType = "debug";
        break;
      case "--clean":
        compileOptions.clean = true;
        break;
    }
  }
  return { ...compileOptions, language };
}
