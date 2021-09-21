import "jest-extended";

import { decode, encode, verify } from "./index";

test("#encode", () => {
  expect(encode("a")).toStrictEqual("C2uuuJh");
});

test("#decode", () => {
  expect(decode("C2uuuJh").toString("utf8")).toStrictEqual("a");
});

test("#verify", () => {
  expect(verify("C2uuuJh")).toBeTrue();
  expect(verify("O")).toBeFalse();
});
