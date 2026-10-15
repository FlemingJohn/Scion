import { expect, test } from "vitest";
import { isValidPath } from "../../src/paths/isValidPath";

test("plain relative paths are valid", () => {
  expect(isValidPath("src/app.ts")).toBe(true);
  expect(isValidPath("README.md")).toBe(true);
});

test("paths that could leave the checkout are invalid", () => {
  expect(isValidPath("../secret")).toBe(false);
  expect(isValidPath("src/../../secret")).toBe(false);
  expect(isValidPath("/etc/passwd")).toBe(false);
  expect(isValidPath("C:/Windows")).toBe(false);
  expect(isValidPath("src\\app.ts")).toBe(false);
});

test("empty parts are invalid", () => {
  expect(isValidPath("")).toBe(false);
  expect(isValidPath("src//app.ts")).toBe(false);
});
