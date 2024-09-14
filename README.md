# cli-argument-helper

Functions to help you deal with parameters in your command-line application.

## Installation

```bash
npm i cli-argument-helper
```

## Usage

```ts
import getNamedArgument from "cli-argument-helper/getNamedArgument";
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

// Get integer
expect(getNamedArgument(args, "--user-id", getInteger)).to.be.equal(3);
expect(getNamedArgument(args, "--b", getInteger)).to.be.equal(2);
expect(getNamedArgument(args, "--a", getInteger)).to.be.equal(1);

// Get plain-text string
expect(getNamedArgument(args, "--c", getString)).to.be.equal("X");

// Get hexadecimal number
expect(getNamedArgument(args, "--d", getHexadecimal)).to.be.equal(0xff);

// Get octal number
expect(getNamedArgument(args, "--e", getOctal)).to.be.equal(0o77);

// Get binary number
expect(getNamedArgument(args, "--f", getBinary)).to.be.equal(0b101);

// Get float number
expect(getNamedArgument(args, "--g", getFloat)).to.be.equal(3.14);

// Get big integer
expect(getNamedArgument(args, "--h", getBigInt)).to.be.equal(0x1fffffffffffffn);

// Get boolean
expect(getNamedArgument(args, "--i", getBoolean)).to.be.equal(false);
expect(getNamedArgument(args, "--j", getBoolean)).to.be.equal(true);
expect(getNamedArgument(args, "--k", getBoolean)).to.be.equal(false);
expect(getNamedArgument(args, "--l", getBoolean)).to.be.equal(true);
expect(getNamedArgument(args, "--m", getBoolean)).to.be.equal(true);
expect(getNamedArgument(args, "--n", getBoolean)).to.be.equal(false);
expect(getNamedArgument(args, "--o", getBoolean)).to.be.equal(true);
expect(getNamedArgument(args, "--p", getBoolean)).to.be.equal(false);

expect(args).to.be.deep.equal([]);
```
