import { Suite } from "sarg";
import {
  getArgument,
  getArgumentFromIndex,
  getInteger,
  getNamedArgument,
  getString,
} from "../index";
import { expect } from "chai";

const suite = new Suite();

suite.test(
  "getArgumentFromIndex: it should return null in case we hit the wrong index",
  () => {
    expect(
      getArgumentFromIndex(
        [],
        0,
        (a) => a,
        () => true
      )
    ).to.be.null;
    expect(
      getArgumentFromIndex(
        ["a"],
        1,
        (a) => a,
        () => true
      )
    ).to.be.null;
  }
);

suite.test("it should support clearing the argument list", () => {
  const args = ["--a", "1", "--b", "2", "--user-id", "3", "--c", "X"];
  expect(getNamedArgument(args, "--user-id", getInteger)).to.be.equal(3);
  expect(getNamedArgument(args, "--b", getInteger)).to.be.equal(2);
  expect(getNamedArgument(args, "--a", getInteger)).to.be.equal(1);
  expect(getNamedArgument(args, "--c", getString)).to.be.equal("X");
  expect(args).to.be.deep.equal([]);
});

suite.test("it should get integer", () => {
  const args = ["--a", "1", "--b", "2", "--user-id", "3"];
  const userId = getNamedArgument(args, "--user-id", getInteger);
  expect(userId).to.be.equal(3);
  expect(args).to.be.deep.equal(["--a", "1", "--b", "2"]);
});

suite.test("it should return null in case validation fails", () => {
  const args = ["--a", "1", "--b", "2", "--user-id", "a"];
  expect(getNamedArgument(args, "--user-id", getInteger)).to.be.equal(null);
});

suite.test(
  "it should return not change argument list in case validation fails",
  () => {
    const args = ["--a", "1", "--b", "2", "--user-id", "a"];
    expect(getNamedArgument(args, "--user-id", getInteger)).to.be.equal(null);
    expect(args).to.be.deep.equal(["--a", "1", "--b", "2", "--user-id", "a"]);
  }
);

suite.test(
  "it should return not even remove the first argument in case validation fails",
  () => {
    const args = ["--a", "1", "--b", "2", "--user-id", "a"];
    const argsCopy = [...args];
    expect(getNamedArgument(args, "--user-id", getInteger)).to.be.equal(null);
    expect(args).to.be.deep.equal(argsCopy);
  }
);

suite.test("it should get string", () => {
  const args = ["--a", "1", "--b", "2", "--comment", "A B C"];
  const comment = getNamedArgument(args, "--comment", getString);
  expect(comment).to.be.equal("A B C");
  expect(args).to.be.deep.equal(["--a", "1", "--b", "2"]);
});

  
suite.test("it should return null in case no argument is found", () => {
  const args = ["--a", "1", "--b", "2", "--user-id", "3"];
  expect(getNamedArgument(args, "--post-id", getInteger)).to.be.null;
});

suite.test('getArgument: it should get argument without value', () => {
  expect(getArgument(['--a'],'--a')).to.be.deep.equal({index: 0});
  expect(getArgument(['--c','--a'],'--b')).to.be.null;
})

suite.test('getArgument: it should mutate argument list', () => {
  const args = ['--a'];
  expect(getArgument(args,'--a')).to.be.deep.equal({index: 0});
  expect(args).to.be.deep.equal([]);
})

export default suite;
