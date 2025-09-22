# cli-argument-helper

[![Build Status](https://github.com/VictorQueiroz/cli-argument-helper/actions/workflows/build.yml/badge.svg)](https://github.com/VictorQueiroz/cli-argument-helper/actions/workflows/build.yml)
[![Test Status](https://github.com/VictorQueiroz/cli-argument-helper/actions/workflows/test.yml/badge.svg)](https://github.com/VictorQueiroz/cli-argument-helper/actions/workflows/test.yml)
[![Documentation](https://github.com/VictorQueiroz/cli-argument-helper/actions/workflows/docs.yml/badge.svg)](https://github.com/VictorQueiroz/cli-argument-helper/actions/workflows/docs.yml)
[![npm version](https://badge.fury.io/js/cli-argument-helper.svg)](https://badge.fury.io/js/cli-argument-helper)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A powerful and type-safe TypeScript library for parsing and handling command-line arguments in Node.js applications. This library provides a set of utilities to help you efficiently parse and process various types of command-line parameters including strings, numbers (integer, float, hexadecimal, octal, binary), booleans, and JSON objects.

## 🚀 Features

- **Type-safe**: Full TypeScript support with comprehensive type definitions
- **Multiple data types**: Support for strings, integers, floats, hexadecimal, octal, binary, big integers, booleans, and JSON
- **Flexible boolean parsing**: Recognizes multiple boolean representations (`true`/`false`, `yes`/`no`, `y`/`n`, `on`/`off`, `1`/`0`)
- **Argument consumption**: Automatically removes parsed arguments from the argument list
- **Error handling**: Provides detailed error information with `ArgumentParsingException`
- **Zero dependencies**: Lightweight with minimal dependencies (only `chalk` for error formatting)
- **Well tested**: Comprehensive test suite with 281+ tests
- **Easy to use**: Simple, intuitive API that follows common CLI parsing patterns

## 📦 Installation

```bash
npm install cli-argument-helper
```

## 📖 API Documentation

Comprehensive API documentation is available at: **[https://victorqueiroz.github.io/cli-argument-helper/](https://victorqueiroz.github.io/cli-argument-helper/)**

## 🔧 Usage

### Basic Example

```typescript
import getArgumentAssignment from "cli-argument-helper/getArgumentAssignment";
import { getString } from "cli-argument-helper/string";
import {
  getInteger,
  getHexadecimal,
  getOctal,
  getBinary,
  getFloat,
  getBigInt,
} from "cli-argument-helper/number";
import getBoolean from "cli-argument-helper/boolean/getBoolean";

const args = [
  "--a",
  "1",
  "--b",
  "2",
  "--user-id",
  "3",
  "--c",
  "X",
  "--d=0xFF",
  "--e=0o77",
  "--f=0b101",
  "--g=3.14",
  "--h=0x1FFFFFFFFFFFFF",
  "--i=false",
  "--j=true",
  "--k=0",
  "--l=1",
  "--m=y",
  "--n=n",
  "--o=yes",
  "--p=no",
];

// Get integer values
const userId = getArgumentAssignment(args, "--user-id", getInteger); // 3
const a = getArgumentAssignment(args, "--a", getInteger); // 1
const b = getArgumentAssignment(args, "--b", getInteger); // 2

// Get string values
const text = getArgumentAssignment(args, "--c", getString); // "X"

// Get numeric values in different bases
const hex = getArgumentAssignment(args, "--d", getHexadecimal); // 255 (0xFF)
const octal = getArgumentAssignment(args, "--e", getOctal); // 63 (0o77)
const binary = getArgumentAssignment(args, "--f", getBinary); // 5 (0b101)
const float = getArgumentAssignment(args, "--g", getFloat); // 3.14
const bigInt = getArgumentAssignment(args, "--h", getBigInt); // 0x1fffffffffffffn

// Get boolean values (supports multiple formats)
const boolFalse = getArgumentAssignment(args, "--i", getBoolean); // false
const boolTrue = getArgumentAssignment(args, "--j", getBoolean); // true
const boolZero = getArgumentAssignment(args, "--k", getBoolean); // false (0)
const boolOne = getArgumentAssignment(args, "--l", getBoolean); // true (1)
const boolY = getArgumentAssignment(args, "--m", getBoolean); // true ("y")
const boolN = getArgumentAssignment(args, "--n", getBoolean); // false ("n")
const boolYes = getArgumentAssignment(args, "--o", getBoolean); // true ("yes")
const boolNo = getArgumentAssignment(args, "--p", getBoolean); // false ("no")

// After parsing, the args array is empty (all arguments consumed)
console.log(args); // []
```

### Advanced Usage

#### Working with JSON arguments

```typescript
import getJSON from "cli-argument-helper/json/getJSON";

const args = ["--config", '{"host": "localhost", "port": 3000}'];
const config = getArgumentAssignment(args, "--config", getJSON);
console.log(config); // { host: "localhost", port: 3000 }
```

#### Error handling

```typescript
import ArgumentParsingException from "cli-argument-helper/ArgumentParsingException";

try {
  const value = getArgumentAssignment(args, "--number", getInteger);
} catch (error) {
  if (error instanceof ArgumentParsingException) {
    console.error("Parsing error:", error.what());
    console.error("At index:", error.index);
    console.error("Reason:", error.reason);
  }
}
```

#### Custom validation

```typescript
import getArgumentFromIndex from "cli-argument-helper/getArgumentFromIndex";

function getPositiveInteger(args: string[], index: number = 0): number | null {
  return getArgumentFromIndex(
    args,
    index,
    (value) => parseInt(value, 10),
    (value) => Number.isInteger(value) && value > 0
  );
}

const positiveNum = getArgumentAssignment(args, "--count", getPositiveInteger);
```

## 🛠️ Development

### Prerequisites

- Node.js 20.x or higher
- npm

### Setup

```bash
# Clone the repository
git clone https://github.com/VictorQueiroz/cli-argument-helper.git
cd cli-argument-helper

# Install dependencies
npm install

# Build the project
npm run build:clean

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Generate documentation
npm run build:docs
```

### Running Tests

The project includes comprehensive tests covering all functionality:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Guidelines

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Make** your changes
4. **Add** tests for your changes
5. **Ensure** all tests pass (`npm test`)
6. **Commit** your changes (`git commit -m 'Add some amazing feature'`)
7. **Push** to the branch (`git push origin feature/amazing-feature`)
8. **Open** a Pull Request

### Code Style

This project uses:
- **TypeScript** for type safety
- **Prettier** for code formatting
- **ESLint** for linting
- **Node.js test runner** for testing

Please ensure your code follows the existing style and passes all linting checks.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://opensource.org/licenses/MIT) file for details.

## 🔗 Links

- **Documentation**: [https://victorqueiroz.github.io/cli-argument-helper/](https://victorqueiroz.github.io/cli-argument-helper/)
- **npm Package**: [https://www.npmjs.com/package/cli-argument-helper](https://www.npmjs.com/package/cli-argument-helper)
- **GitHub Repository**: [https://github.com/VictorQueiroz/cli-argument-helper](https://github.com/VictorQueiroz/cli-argument-helper)
- **Issues**: [https://github.com/VictorQueiroz/cli-argument-helper/issues](https://github.com/VictorQueiroz/cli-argument-helper/issues)

## 📊 Project Stats

- **Language**: TypeScript
- **Runtime**: Node.js
- **Package Manager**: npm
- **Test Framework**: Node.js built-in test runner
- **Documentation**: TypeDoc
- **CI/CD**: GitHub Actions
