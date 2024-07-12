import chalk from "chalk";

export default class ArgumentParsingException {
  public constructor(
    public readonly args: ReadonlyArray<string>,
    public readonly index: number,
    public readonly reason: unknown,
  ) {}

  public what() {
    return this.args
      .map(
        (a, i) =>
          `${i === this.index ? ">" : ""}${chalk.redBright(
            chalk.underline(a),
          )}${i === this.index ? "<" : ""}`,
      )
      .join(" ");
  }
}
