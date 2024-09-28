import { getArgument } from "../index";
import getArgumentAssignment from "../getArgumentAssignment";
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
import getBoolean, { booleanDefaults } from "../boolean/getBoolean";
import getArgumentAssignmentFromIndex from "../getArgumentAssignmentFromIndex";
import getBooleanArgumentFromIndex from "../getBooleanArgumentFromIndex";
import assert from "assert";
import getCompileLanguageOptions from "./getCompileLanguageOptions";
import anyOfArgumentAssignment from "../anyOfArgumentAssignment";

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

describe("simulateArguments", () => {
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
    assert.strict.deepEqual(args, []);
  });
});

describe("getArgumentAssignmentFromIndex", () => {
  it("should return null in case we hit the wrong index", async () => {
    const args = await simulateArguments([
      "--a",
      "1",
      "--b",
      "2",
      "--user-id",
      "3",
      "--c",
      "X",
    ]);
    expect(getArgumentAssignmentFromIndex(args, 0, "--user-id", getInteger)).to
      .be.null;
    expect(
      getArgumentAssignmentFromIndex(args, 0, "--a", getInteger),
    ).to.be.equal(1);
    expect(getArgumentAssignmentFromIndex(args, 0, "--user-id", getInteger)).to
      .be.null;
    expect(
      getArgumentAssignmentFromIndex(args, 0, "--b", getInteger),
    ).to.be.equal(2);
    expect(
      getArgumentAssignmentFromIndex(args, 0, "--user-id", getInteger),
    ).to.be.equal(3);
    expect(getArgumentAssignmentFromIndex(args, 0, "--b", getInteger)).to.be
      .null;
    expect(getArgumentAssignmentFromIndex(args, 0, "--c", getInteger)).to.be
      .null;
    expect(
      getArgumentAssignmentFromIndex(args, 0, "--c", getString),
    ).to.be.equal("X");
    // Make sure the argument list is empty
    assert.strict.deepEqual(args, []);
  });

  it("should parse inline arguments", async () => {
    const args = await simulateArguments(["--user-id=1", "--delete=y"]);

    expect(getArgumentAssignmentFromIndex(args, 0, "-x", getInteger)).to.be
      .null;
    expect(
      getArgumentAssignmentFromIndex(args, 0, "--user-id", getInteger),
    ).to.be.equal(1);
    expect(
      getArgumentAssignmentFromIndex(args, 0, "--delete", getString),
    ).to.be.equal("y");
    // Make sure the argument list is empty
    assert.strict.deepEqual(args, []);
  });

  it("should parse arguments without -- or - prefixes", async () => {
    const args = await simulateArguments(["user-id=1", "delete=y"]);

    expect(getArgumentAssignmentFromIndex(args, 0, "-x", getInteger)).to.be
      .null;
    expect(
      getArgumentAssignmentFromIndex(args, 0, "user-id", getInteger),
    ).to.be.equal(1);
    expect(
      getArgumentAssignmentFromIndex(args, 0, "delete", getString),
    ).to.be.equal("y");
    // Make sure the argument list is empty
    assert.strict.deepEqual(args, []);
  });

  it("should return null in case the given index is out of bounds", async () => {
    const args = await simulateArguments(["user-id=1", "delete=y"]);

    expect(getArgumentAssignmentFromIndex(args, 1000, "-x", getInteger)).to.be
      .null;

    // Make sure the argument list is empty
    expect(args).to.be.deep.equal(["user-id=1", "delete=y"]);
  });

  it("should not match the argument in case the given index is out of bounds", async () => {
    const args = await simulateArguments(["user-id=1", "delete=y"]);

    expect(getArgumentAssignmentFromIndex(args, 1000, "user-id", getInteger)).to
      .be.null;
    expect(getArgumentAssignmentFromIndex(args, 0, "delete", getInteger)).to.be
      .null;

    // Make sure the argument list is empty
    expect(args).to.be.deep.equal(["user-id=1", "delete=y"]);
  });

  it("should throw ArgumentParsingException in case the `transform` function fails", async () => {
    const args = await simulateArguments(["user-id=1", "delete=y"]);

    expect(() =>
      getArgumentAssignmentFromIndex(args, 0, "user-id", (_) => {
        throw new Error("this should not be called");
      }),
    ).to.throw(/this should not be called/);
  });

  it("should split the argument if it matches (i.e. from user-id=1 into [user-id, 1]), even if the `transform` function throws", async () => {
    const args = await simulateArguments(["user-id=1", "delete=y"]);

    expect(() =>
      getArgumentAssignmentFromIndex(args, 0, "user-id", (_) => {
        throw new Error("this should not be called");
      }),
    ).to.throw(/this should not be called/);

    // Make sure the argument list is intact
    expect(args).to.be.deep.equal(["user-id=1", "delete=y"]);
  });
});

describe("getBooleanArgumentFromIndex", () => {
  it("should return false in case the given index is not a match", async () => {
    const args = await simulateArguments(["user-id=1", "delete=y", "--delete"]);
    expect(getBooleanArgumentFromIndex(args, 0, "--delete")).to.be.false;
    expect(getBooleanArgumentFromIndex(args, 1, "--delete")).to.be.false;
  });

  it("should return false in case the given index is out of bounds", async () => {
    const args = await simulateArguments(["user-id=1"]);
    expect(getBooleanArgumentFromIndex(args, 1, "user-id")).to.be.false;
    assert.strict.deepEqual(args, ["user-id=1"]);
  });

  it("should return true in case the given index is found", async () => {
    const args = await simulateArguments(["user-id=1", "delete=y", "--delete"]);
    assert.strict.ok(getBooleanArgumentFromIndex(args, 2, "--delete"));
    assert.strict.ok(
      getArgumentAssignmentFromIndex(args, 1, "delete", getBoolean),
    );
    assert.strict.deepEqual(args, ["user-id=1"]);
  });

  it("should keep the list intact in case nothing is found", async () => {
    const args = await simulateArguments(["user-id=1", "delete=y", "--delete"]);
    assert.strict.ok(
      !getArgumentAssignmentFromIndex(args, 1, "user-idd", getBoolean),
    );
    assert.strict.deepEqual(args, ["user-id=1", "delete=y", "--delete"]);
  });

  it("should be able to get consecutive arguments", async () => {
    const args = await simulateArguments([
      "--compile=gcc",
      "--release=TRUE",
      "--clean=y",
      "--compile=g++",
      "--release=y",
      "--compile",
      "clang",
      "--debug=TRUE",
      "--clean-after=FALSE",
    ]);

    assert.strict.deepEqual(getCompileLanguageOptions(args, 0), {
      language: "gcc",
      buildType: "release",
      clean: true,
    });
    assert.strict.deepEqual(getCompileLanguageOptions(args, 0), {
      language: "g++",
      buildType: "release",
      clean: false,
    });
    assert.strict.deepEqual(getCompileLanguageOptions(args, 0), {
      language: "clang",
      buildType: "debug",
      clean: false,
    });
    assert.strict.deepEqual(args, ["--clean-after=FALSE"]);
  });
});

describe("anyOfArgumentAssignment", () => {
  it("should result in a TypeScript error in case one of the functions given to `anyOfArgumentAssignment` is not of type T", () => {
    getArgumentAssignmentFromIndex(
      [],
      0,
      "--build",
      anyOfArgumentAssignment(
        getString,
        () =>
          // @ts-expect-error
          true,
      ),
    );
  });

  it("should assume true if argument value is boolean, and it does not have an assignment", () => {
    const args = ["--build=y", "--clean"];

    assert.strict.ok(
      getArgumentAssignmentFromIndex(
        args,
        0,
        "--build",
        anyOfArgumentAssignment(getBoolean, () => true),
      ),
    );
    assert.strict.ok(
      getArgumentAssignmentFromIndex(
        args,
        0,
        "--clean",
        anyOfArgumentAssignment(getBoolean, () => true),
      ),
    );
  });
});

describe("getNamedArgument", () => {
  it("should support clearing the argument list", () => {
    const args = ["--a", "1", "--b", "2", "--user-id", "3", "--c", "X"];
    expect(getArgumentAssignment(args, "--user-id", getInteger)).to.be.equal(3);
    expect(getArgumentAssignment(args, "--b", getInteger)).to.be.equal(2);
    expect(getArgumentAssignment(args, "--a", getInteger)).to.be.equal(1);
    expect(getArgumentAssignment(args, "--c", getString)).to.be.equal("X");
    assert.strict.deepEqual(args, []);
  });

  describe("boolean", () => {
    describe("getBoolean", () => {
      describe("true", () => {
        it("should return true from --props.user.id=true argument", () => {
          const args = ["--props.user.id=true"];
          expect(getArgumentAssignment(args, "--props.user.id", getBoolean)).to
            .be.true;
          assert.strict.deepEqual(args, []);
        });

        it("should return true from --props.user.id=y argument", () => {
          const args = ["--props.user.id=y"];
          expect(getArgumentAssignment(args, "--props.user.id", getBoolean)).to
            .be.true;
          assert.strict.deepEqual(args, []);
        });

        it("should return true from --props.user.id=1 argument", () => {
          const args = ["--props.user.id=1"];
          expect(getArgumentAssignment(args, "--props.user.id", getBoolean)).to
            .be.true;
          assert.strict.deepEqual(args, []);
        });

        for (let n = 1; n < 100; n++) {
          it(`should return true from ${n}`, () => {
            const args = [`--props.user.id=${n}`];
            expect(getArgumentAssignment(args, "--props.user.id", getBoolean))
              .to.be.true;
            assert.strict.deepEqual(args, []);
          });
        }

        for (const [
          result,
          acceptedValueList,
        ] of booleanDefaults.acceptedValues) {
          if (!result) {
            continue;
          }
          for (const value of acceptedValueList) {
            it(`should return true from --props.user.id=${value} argument`, () => {
              const args = [`--props.user.id=${value}`];
              expect(getArgumentAssignment(args, "--props.user.id", getBoolean))
                .to.be.true;
              assert.strict.deepEqual(args, []);
            });

            it(`should return true from \`--props.user.id ${value}\` argument`, () => {
              const args = ["--props.user.id", value];
              expect(getArgumentAssignment(args, "--props.user.id", getBoolean))
                .to.be.true;
              assert.strict.deepEqual(args, []);
            });
          }
        }
      });

      describe("false", () => {
        for (let n = 1; n < 100; n++) {
          it(`should return false from ${n * -1}`, () => {
            const args = [`--props.user.id=${n * -1}`];
            expect(getArgumentAssignment(args, "--props.user.id", getBoolean))
              .to.be.false;
            assert.strict.deepEqual(args, []);
          });
        }

        it("should return false from --props.user.id=0 argument", () => {
          const args = ["--props.user.id=0"];
          expect(getArgumentAssignment(args, "--props.user.id", getBoolean)).to
            .be.false;
          assert.strict.deepEqual(args, []);
        });

        for (const [
          result,
          acceptedValueList,
        ] of booleanDefaults.acceptedValues) {
          if (result) {
            continue;
          }
          for (const value of acceptedValueList) {
            it(`should return false from --props.user.id=${value} argument`, () => {
              const args = [`--props.user.id=${value}`];
              expect(getArgumentAssignment(args, "--props.user.id", getBoolean))
                .to.be.false;
              assert.strict.deepEqual(args, []);
            });

            it(`should return false from \`--props.user.id ${value}\` argument`, () => {
              const args = ["--props.user.id", value];
              expect(getArgumentAssignment(args, "--props.user.id", getBoolean))
                .to.be.false;
              assert.strict.deepEqual(args, []);
            });
          }
        }
      });

      describe("null", () => {
        it("should return null in case boolean contains an invalid value", () => {
          assert.strict.equal(
            getArgumentAssignment(["a=x"], "a", getBoolean),
            null,
          );
        });

        it("should keep the argument list intact if boolean contains an invalid value", async () => {
          const args = await simulateArguments(["--b", "a=x"]);
          assert.strict.equal(
            getArgumentAssignment(args, "a", getBoolean),
            null,
          );
          assert.strict.deepEqual(args, ["--b", "a=x"]);
        });
      });
    });
  });

  describe("number", () => {
    describe("getHexadecimal", () => {
      it("should get hexadecimal from --user.id 0x30000", async () => {
        const args = await simulateArguments('--user.id="0x30000"');
        expect(
          getArgumentAssignment(args, "--user.id", getHexadecimal),
        ).to.be.equal(0x30000);
        assert.strict.deepEqual(args, []);
      });

      it("should get hexadecimal from --user.id 0x30000", async () => {
        const args = await simulateArguments("--user.id 0x30000");
        expect(
          getArgumentAssignment(args, "--user.id", getHexadecimal),
        ).to.be.equal(0x30000);
        assert.strict.deepEqual(args, []);
      });
    });

    describe("getFloat", () => {
      it("should get float from --user.id 0.3", async () => {
        const args = await simulateArguments("--user.id 0.3");
        expect(getArgumentAssignment(args, "--user.id", getFloat)).to.be.equal(
          0.3,
        );
        assert.strict.deepEqual(args, []);
      });

      test(`it should get float from --user.id ${Math.PI}`, async () => {
        const args = await simulateArguments(`--user.id '${Math.PI}'`);
        expect(getArgumentAssignment(args, "--user.id", getFloat)).to.be.equal(
          Math.PI,
        );
        assert.strict.deepEqual(args, []);
      });
    });
    describe("getOctal", () => {
      it("should get octal from --user.id 0o30000", async () => {
        const args = await simulateArguments("--user.id 0o30000");
        expect(getArgumentAssignment(args, "--user.id", getOctal)).to.be.equal(
          0o30000,
        );
        assert.strict.deepEqual(args, []);
      });
    });

    describe("getBinary", () => {
      it("should get binary from --user.id 0b110", async () => {
        const args = await simulateArguments("--user.id 0b110");
        expect(getArgumentAssignment(args, "--user.id", getBinary)).to.be.equal(
          0b110,
        );
        assert.strict.deepEqual(args, []);
      });
    });

    describe("getInteger", () => {
      it("should get integer", () => {
        const args = ["--a", "1", "--b", "2", "--user-id", "3"];
        const userId = getArgumentAssignment(args, "--user-id", getInteger);
        expect(userId).to.be.equal(3);
        expect(args).to.be.deep.equal(["--a", "1", "--b", "2"]);
      });

      it("should return null in case validation fails", () => {
        const args = ["--a", "1", "--b", "2", "--user-id", "a"];
        expect(
          getArgumentAssignment(args, "--user-id", getInteger),
        ).to.be.equal(null);
      });

      it("should return not change argument list in case validation fails", () => {
        const args = ["--a", "1", "--b", "2", "--user-id", "a"];
        expect(
          getArgumentAssignment(args, "--user-id", getInteger),
        ).to.be.equal(null);
        expect(args).to.be.deep.equal([
          "--a",
          "1",
          "--b",
          "2",
          "--user-id",
          "a",
        ]);
      });

      it("should return not even remove the first argument in case validation fails", () => {
        const args = ["--a", "1", "--b", "2", "--user-id", "a"];
        const argsCopy = [...args];
        expect(
          getArgumentAssignment(args, "--user-id", getInteger),
        ).to.be.equal(null);
        expect(args).to.be.deep.equal(argsCopy);
      });

      it("should return null in case no argument is found", () => {
        const args = ["--a", "1", "--b", "2", "--user-id", "3"];
        expect(getArgumentAssignment(args, "--post-id", getInteger)).to.be.null;
      });

      describe("Negative", () => {
        it("should get negative from --user.id -1", async () => {
          const args = await simulateArguments("--user.id -1");
          expect(
            getArgumentAssignment(args, "--user.id", getInteger),
          ).to.be.equal(-1);
          assert.strict.deepEqual(args, []);
        });
      });
    });
  });

  describe("getString", () => {
    it("should get string", () => {
      const args = ["--a", "1", "--b", "2", "--comment", "A B C"];
      const comment = getArgumentAssignment(args, "--comment", getString);
      assert.strict.equal(comment, "A B C");
      assert.strict.deepEqual(args, ["--a", "1", "--b", "2"]);
    });

    it("should get argument that contains a complex string", async () => {
      const args = ["--suffix", "$user-$name-$test"];
      expect(getArgumentAssignment(args, "--suffix", getString)).to.be.equal(
        "$user-$name-$test",
      );
      expect(
        getArgumentAssignment(
          await simulateArguments(["--suffix", "'$user-$name-$test'"]),
          "--suffix",
          getString,
        ),
      ).to.be.equal("$user-$name-$test");
    });

    it("should get --user.id=1", () => {
      const args = ["--user.id=1"];
      expect(getArgumentAssignment(args, "--user.id", getString)).to.be.equal(
        "1",
      );
      assert.strict.deepEqual(args, []);
    });

    it("should get --user.id=1", async () => {
      const args = await simulateArguments("--user.id=1");
      expect(getArgumentAssignment(args, "--user.id", getString)).to.be.equal(
        "1",
      );
      assert.strict.deepEqual(args, []);
    });

    test('it should get --user.id="1"', async () => {
      const args = await simulateArguments('--user.id="1"');
      expect(getArgumentAssignment(args, "--user.id", getString)).to.be.equal(
        "1",
      );
      assert.strict.deepEqual(args, []);
    });

    it('should be able to get "color=c=black:s=1280x720" value from "-f lavfi -i color=c=black:s=1280x720" argument stream', () => {
      const args = ["-f", "lavfi", "-i", "color=c=black:s=1280x720"];
      expect(getArgumentAssignment(args, "-f", getString)).to.be.equal("lavfi");
      expect(getArgumentAssignment(args, "-i", getString)).to.be.equal(
        "color=c=black:s=1280x720",
      );
      assert.strict.deepEqual(args, []);
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
      expect(getArgumentAssignment(args, "-vf", getString)).to.be.equal(
        "scale=1280:720",
      );
      expect(getArgumentAssignment(args, "-f", getString)).to.be.equal("lavfi");
      expect(getArgumentAssignment(args, "--fps", getString)).to.be.null;
      expect(getArgumentAssignment(args, "-s", getString)).to.be.null;
      expect(args).to.be.deep.equal(["-i", "color=c=black:s=1280x720"]);
    });
  });
});
