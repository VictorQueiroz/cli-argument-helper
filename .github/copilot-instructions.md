# cli-argument-helper

CLI argument helper is a TypeScript/Node.js library that provides functions to help you parse command-line arguments in your CLI applications. It supports parsing strings, numbers (integers, floats, hexadecimal, octal, binary), booleans, and JSON values from command-line arguments.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

- Bootstrap, build, and test the repository:
  - `npm install` -- installs dependencies. Takes ~15 seconds.
  - `npm run build:clean` -- builds TypeScript. Takes ~1-2 seconds.
  - `npm test` -- runs full test suite. Takes ~3-4 seconds. NEVER CANCEL. Set timeout to 30+ seconds.
  - `npm run test:coverage` -- runs tests with coverage report. Takes ~5-6 seconds. NEVER CANCEL. Set timeout to 30+ seconds.
- Code formatting and linting:
  - `npx prettier --check .` -- checks if code is properly formatted
  - `npx prettier --write .` -- formats all code (required before committing)
  - `npx tsc --noEmit` -- type checking without building
  - ESLint is installed but not configured for TypeScript - do not use it
- Generate documentation:
  - `npm run build:docs` -- generates TypeDoc documentation. Takes ~2 seconds.
- Watch mode for development:
  - `npm run test:watch` -- runs tests in watch mode for development

## Validation

- Always manually validate any new code by creating and running a sample CLI application that uses the library functions.
- ALWAYS run through at least one complete end-to-end scenario after making changes.
- Always run `npx prettier --write .` and `npx tsc --noEmit` before committing or the CI (.github/workflows/build.yml, test.yml, test-coverage.yml) will fail.

## Common Tasks

The following are outputs from frequently run commands. Reference them instead of viewing, searching, or running bash commands to save time.

### Repository Structure

```
ls -la [repo-root]
.c8rc.json           # Coverage configuration
.editorconfig        # Editor configuration
.github/             # GitHub Actions workflows (build.yml, test.yml, test-coverage.yml)
.gitignore
.nvmrc              # Node.js version: v20.17.0
.nycrc.json         # NYC coverage configuration
.prettierrc         # Prettier configuration
ArgumentParsingException.ts
Character.ts
README.md
anyOfArgumentAssignment.ts
assignmentValueFromIndex.ts
boolean/            # Boolean parsing functions
getArgumentAssignment.ts
getArgumentAssignmentFromIndex.ts
getArgumentFromIndex.ts
getBooleanArgumentFromIndex.ts
index.ts            # Main entry point
json/               # JSON parsing functions
number/             # Number parsing functions (integer, float, hex, octal, binary)
package.json
string/             # String parsing functions
test/               # Test files
tsconfig.json
```

### Module Structure

- `index.ts` - Main entry point with `getArgument` function
- `string/` - String parsing functions (`getString`)
- `number/` - Number parsing functions (`getInteger`, `getFloat`, `getHexadecimal`, `getOctal`, `getBinary`, `getBigInt`)
- `boolean/` - Boolean parsing functions (`getBoolean`)
- `json/` - JSON parsing functions (`getJSON`)
- `test/` - Test files with comprehensive test coverage (281 tests, 90.52% coverage)

### Key Functions and Usage Patterns

```typescript
// Core parsing functions
import { getArgument } from "cli-argument-helper/index";
import getArgumentAssignment from "cli-argument-helper/getArgumentAssignment";
import { getString } from "cli-argument-helper/string";
import {
  getInteger,
  getHexadecimal,
  getFloat,
} from "cli-argument-helper/number";
import getBoolean from "cli-argument-helper/boolean/getBoolean";

// Example usage - functions mutate the args array
const args = ["--name", "John", "--age", "25", "--verbose"];
const name = getArgumentAssignment(args, "--name", getString); // "John"
const age = getArgumentAssignment(args, "--age", getInteger); // 25
const verbose = getArgument(args, "--verbose"); // { index: 0 }
// args is now empty: []
```

### Test Structure

- Tests use Node.js built-in test runner (not Mocha/Jest)
- Test files: `test/index.ts`, `test/echo.ts`, `test/simulateArguments.ts`, `test/getCompileLanguageOptions.ts`
- Run tests with `npm test` or `npm run test:watch` for development
- Coverage is measured with c8

### Build and CI Information

- TypeScript target: ES5, CommonJS modules
- Build output: JavaScript files with .d.ts declaration files and source maps
- CI runs on Node.js 20.x
- CI workflows: build (builds), test (tests), test-coverage (coverage)

### Manual Testing Example

After making changes, always test with a sample CLI application:

```javascript
// Create /tmp/test-cli.js in repo root
const path = require("path");
const { getArgument } = require(path.resolve("index.js"));
const getArgumentAssignment = require(
  path.resolve("getArgumentAssignment.js"),
).default;
const { getString } = require(path.resolve("string/index.js"));
const { getInteger } = require(path.resolve("number/index.js"));

const args = process.argv.slice(2);
const name = getArgumentAssignment(args, "--name", getString);
const count = getArgumentAssignment(args, "--count", getInteger);
const verbose = getArgument(args, "--verbose");

console.log("Name:", name, "Count:", count, "Verbose:", !!verbose);
console.log("Remaining args:", args);
```

Run from repo root: `node /tmp/test-cli.js --name "Test" --count 42 --verbose`
Expected output: `Name: Test Count: 42 Verbose: true` and `Remaining args: []`

## Project-Specific Guidelines

- This is a library project - there is no runnable application, only exported functions
- Always maintain the mutating behavior of argument parsing (functions remove parsed arguments from the array)
- When adding new parsing functions, follow the existing pattern in number/, string/, boolean/, json/ directories
- All parsing functions should return the parsed value or `null` if parsing fails
- Use `ArgumentParsingException` for parsing errors that should be thrown
- The library supports both `--key=value` and `--key value` argument formats
- Always add comprehensive tests following the existing pattern when adding new functionality
- Generated JavaScript files and declaration files are committed to the repository
