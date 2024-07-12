import getArgumentFromIndex from "../getArgumentFromIndex";
import removePrefix from "../string/removePrefix";
import createGetNumber from "./createGetNumber";
import isInteger from "./isInteger";
import isNumber from "./isNumber";

export const getInteger = createGetNumber(10, isInteger);

export const getHexadecimal = createGetNumber(
  16,
  isInteger,
  removePrefix("0x"),
);

export const getOctal = createGetNumber(8, isInteger, removePrefix("0o"));

export const getBinary = createGetNumber(2, isInteger, removePrefix("0b"));

export function getFloat(args: string[], index: number = 0): number | null {
  return getArgumentFromIndex<number>(
    args,
    index,
    (value) => parseFloat(value),
    isNumber,
  );
}

export function getBigInt(args: string[], index: number = 0): bigint | null {
  return getArgumentFromIndex<bigint>(
    args,
    index,
    (value) => BigInt(value),
    (value) => typeof value === "bigint",
  );
}
