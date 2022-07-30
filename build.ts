import * as swc from "@swc/core";
import { readFile, writeFile } from "fs/promises";
import { Generator } from "npm-dts";

const compile = async () => {
  const code = await readFile("./index.ts", { encoding: "utf8" });

  console.log("=== Started compiling ===");
  const es6Config: swc.Options = {
    jsc: {
      parser: {
        syntax: "typescript",
      },
      target: "es2020",
      preserveAllComments: true,
    },
    module: {
      type: "es6",
    },
  };
  const es6Out = await swc.transform(code, es6Config);
  // change the module to commonjs
  es6Config.module.type = "commonjs";
  const cjsOut = await swc.transform(code, es6Config);

  // write the compiled code in lib dir
  await writeFile("./lib/index.js", es6Out.code);
  await writeFile("./lib/index.cjs", cjsOut.code);

  console.log("=== Compiling finished ===\n");

  console.log("=== Generating type definitions ===");
  await new Generator({ entry: "./index.ts", output: "./lib/" }).generate();
  console.log("=== Type definitions generated ===");
};

compile();
