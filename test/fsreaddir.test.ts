import { assert, expect, test } from "vitest";
import fs from "node:fs";
import path from "node:path";
import easyRecurse from "../src/index";

let testChildrenFiles: string[] = [];
await easyRecurse("./test", (filepath, parent, i) => {
  let stat = fs.statSync(filepath);
  testChildrenFiles.push(filepath);
  if (!stat.isDirectory()) {
    return;
  }
  let paths = fs.readdirSync(filepath);
  return paths.map((v) => path.join(filepath || "", v));
});

test("assert", () => {
  assert(testChildrenFiles[0] === "./test", "first collected path is `./test`");
  assert(
    testChildrenFiles.find((v) => v.endsWith(`fsreaddir.test.ts`)),
    "fsreaddir.test.ts is collected"
  );
});

let count = 0;
await easyRecurse("./", (filepath, parent, i) => {
  count++;
  let stat = fs.statSync(filepath);
  if (filepath.endsWith("node_modules") || filepath.endsWith(".git")) {
    return;
  }

  if (!stat.isDirectory()) {
    return;
  }
  return fs.readdirSync(filepath).map((v) => path.join(filepath || "", v));
});

test("assert", () => {
  assert(count < 100, "node_modules should be ignored");
});
