import { getArgument } from "../index";
import getNamedArgument from "../getNamedArgument";
import getArgumentFromIndex from "../getArgumentFromIndex";
import { getString } from "../string";
import {
  getBinary,
  getFloat,
  getHexadecimal,
  getInteger,
  getOctal,
} from "../number";
import { expect } from "chai";
import test, { describe, it } from "node:test";
import simulateArguments from "./simulateArguments";
import isInteger from "../number/isInteger";

describe("getArgumentFromIndex", () => {
  it("should return null in case we hit the wrong index", () => {
    expect(
      getArgumentFromIndex<string>(
        [],
        0,
        (a) => a,
        // @ts-expect-error
        (value: unknown) => typeof value === "number",
      ),
    ).to.be.null;
    expect(getArgumentFromIndex(["a"], 1, (a) => parseInt(a, 10), isInteger)).to
      .be.null;
  });
});

describe("simualteArguments", () => {
  it("should return the arguments line parsed by the shell", async () => {
    const args = ["--a", "1", "--b", "2", "--user-id", "3", "--c", "X"];
    expect(await simulateArguments(args)).to.be.deep.equal(args);
  });
});

describe("getArgument", () => {
  it("should get argument without value", () => {
    expect(getArgument(["--a"], "--a")).to.be.deep.equal({ index: 0 });
    expect(getArgument(["--c", "--a"], "--b")).to.be.null;
  });

  it("should mutate argument list", () => {
    const args = ["--a"];
    expect(getArgument(args, "--a")).to.be.deep.equal({ index: 0 });
    expect(args).to.be.deep.equal([]);
  });
});

describe("getNamedArgument", () => {
  it("should support clearing the argument list", () => {
    const args = ["--a", "1", "--b", "2", "--user-id", "3", "--c", "X"];
    expect(getNamedArgument(args, "--user-id", getInteger)).to.be.equal(3);
    expect(getNamedArgument(args, "--b", getInteger)).to.be.equal(2);
    expect(getNamedArgument(args, "--a", getInteger)).to.be.equal(1);
    expect(getNamedArgument(args, "--c", getString)).to.be.equal("X");
    expect(args).to.be.deep.equal([]);
  });

  it("should get integer", () => {
    const args = ["--a", "1", "--b", "2", "--user-id", "3"];
    const userId = getNamedArgument(args, "--user-id", getInteger);
    expect(userId).to.be.equal(3);
    expect(args).to.be.deep.equal(["--a", "1", "--b", "2"]);
  });

  it("should return null in case validation fails", () => {
    const args = ["--a", "1", "--b", "2", "--user-id", "a"];
    expect(getNamedArgument(args, "--user-id", getInteger)).to.be.equal(null);
  });

  it("should return not change argument list in case validation fails", () => {
    const args = ["--a", "1", "--b", "2", "--user-id", "a"];
    expect(getNamedArgument(args, "--user-id", getInteger)).to.be.equal(null);
    expect(args).to.be.deep.equal(["--a", "1", "--b", "2", "--user-id", "a"]);
  });

  it("should return not even remove the first argument in case validation fails", () => {
    const args = ["--a", "1", "--b", "2", "--user-id", "a"];
    const argsCopy = [...args];
    expect(getNamedArgument(args, "--user-id", getInteger)).to.be.equal(null);
    expect(args).to.be.deep.equal(argsCopy);
  });

  it("should get string", () => {
    const args = ["--a", "1", "--b", "2", "--comment", "A B C"];
    const comment = getNamedArgument(args, "--comment", getString);
    expect(comment).to.be.equal("A B C");
    expect(args).to.be.deep.equal(["--a", "1", "--b", "2"]);
  });

  it("should return null in case no argument is found", () => {
    const args = ["--a", "1", "--b", "2", "--user-id", "3"];
    expect(getNamedArgument(args, "--post-id", getInteger)).to.be.null;
  });

  it("should get argument that contains a complex string", async () => {
    const args = ["--suffix", "$user-$name-$test"];
    expect(getNamedArgument(args, "--suffix", getString)).to.be.equal(
      "$user-$name-$test",
    );
    expect(
      getNamedArgument(
        await simulateArguments(["--suffix", "'$user-$name-$test'"]),
        "--suffix",
        getString,
      ),
    ).to.be.equal("$user-$name-$test");
  });

  it("should get --user.id=1", () => {
    const args = ["--user.id=1"];
    expect(getNamedArgument(args, "--user.id", getString)).to.be.equal("1");
    expect(args).to.be.deep.equal([]);
  });

  it("should get --user.id=1", async () => {
    const args = await simulateArguments("--user.id=1");
    expect(getNamedArgument(args, "--user.id", getString)).to.be.equal("1");
    expect(args).to.be.deep.equal([]);
  });

  test('it should get --user.id="1"', async () => {
    const args = await simulateArguments('--user.id="1"');
    expect(getNamedArgument(args, "--user.id", getString)).to.be.equal("1");
    expect(args).to.be.deep.equal([]);
  });

  it("should get hexadecimal from --user.id 0x30000", async () => {
    const args = await simulateArguments('--user.id="0x30000"');
    expect(getNamedArgument(args, "--user.id", getHexadecimal)).to.be.equal(
      0x30000,
    );
    expect(args).to.be.deep.equal([]);
  });

  it("should get hexadecimal from --user.id 0x30000", async () => {
    const args = await simulateArguments("--user.id 0x30000");
    expect(getNamedArgument(args, "--user.id", getHexadecimal)).to.be.equal(
      0x30000,
    );
    expect(args).to.be.deep.equal([]);
  });

  // Float
  it("should get float from --user.id 0.3", async () => {
    const args = await simulateArguments("--user.id 0.3");
    expect(getNamedArgument(args, "--user.id", getFloat)).to.be.equal(0.3);
    expect(args).to.be.deep.equal([]);
  });

  // Float
  test(`it should get float from --user.id ${Math.PI}`, async () => {
    const args = await simulateArguments(`--user.id '${Math.PI}'`);
    expect(getNamedArgument(args, "--user.id", getFloat)).to.be.equal(Math.PI);
    expect(args).to.be.deep.equal([]);
  });

  // Octal
  it("should get octal from --user.id 0o30000", async () => {
    const args = await simulateArguments("--user.id 0o30000");
    expect(getNamedArgument(args, "--user.id", getOctal)).to.be.equal(0o30000);
    expect(args).to.be.deep.equal([]);
  });

  // Binary
  it("should get binary from --user.id 0b110", async () => {
    const args = await simulateArguments("--user.id 0b110");
    expect(getNamedArgument(args, "--user.id", getBinary)).to.be.equal(0b110);
    expect(args).to.be.deep.equal([]);
  });

  // Negative
  it("should get negative from --user.id -1", async () => {
    const args = await simulateArguments("--user.id -1");
    expect(getNamedArgument(args, "--user.id", getInteger)).to.be.equal(-1);
    expect(args).to.be.deep.equal([]);
  });

  it('should be able to get "color=c=black:s=1280x720" value from "-f lavfi -i color=c=black:s=1280x720" argument stream', () => {
    const args = ["-f", "lavfi", "-i", "color=c=black:s=1280x720"];
    expect(getNamedArgument(args, "-f", getString)).to.be.equal("lavfi");
    expect(getNamedArgument(args, "-i", getString)).to.be.equal(
      "color=c=black:s=1280x720",
    );
    expect(args).to.be.deep.equal([]);
  });

  it('should be able to get other values from "-f lavfi -i color=c=black:s=1280x720" argument stream without changing the unrelated arguments', () => {
    const args = [
      "-f",
      "lavfi",
      "-i",
      "color=c=black:s=1280x720",
      "-vf",
      "scale=1280:720",
    ];
    expect(getNamedArgument(args, "-vf", getString)).to.be.equal(
      "scale=1280:720",
    );
    expect(getNamedArgument(args, "-f", getString)).to.be.equal("lavfi");
    expect(getNamedArgument(args, "--fps", getString)).to.be.null;
    expect(getNamedArgument(args, "-s", getString)).to.be.null;
    expect(args).to.be.deep.equal(["-i", "color=c=black:s=1280x720"]);
  });
});
