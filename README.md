# cli-argument-helper

Functions to help you deal with parameters in your command-line application.

## Installation

```
yarn add cli-argument-helper
```

## Usage

```ts
const args = ["--a", "1", "--b", "2", "--user-id", "3", "--c", "X"];
expect(getNamedArgument(args, "--user-id", getInteger)).to.be.equal(3);
expect(getNamedArgument(args, "--b", getInteger)).to.be.equal(2);
expect(getNamedArgument(args, "--a", getInteger)).to.be.equal(1);
expect(getNamedArgument(args, "--c", getString)).to.be.equal("X");
expect(args).to.be.deep.equal([]);
```
