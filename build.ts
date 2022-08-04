import * as swc from "@swc/core";
import { readFile, writeFile } from "fs/promises";
import { Generator } from "npm-dts";
import * as TypeDoc from "typedoc";
import concatMd from "concat-md";

const log = console.log;

log(`
    ____        _ __    ___            
   / __ )__  __(_) /___/ (_)___  ____ _
  / __  / / / / / / __  / / __ \\/ __ \`/
 / /_/ / /_/ / / / /_/ / / / / / /_/ / 
/_____/\\__,_/_/_/\\__,_/_/_/ /_/\\__, /  
                              /____/  
`);
const compile = async () => {
  const code = await readFile("./index.ts", { encoding: "utf8" });

  log("\n=== Started compiling ===");
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

  log("=== Compiling finished ===\n");

  log("\n=== Generating type definitions ===");
  await new Generator({ entry: "./index.ts", output: "./lib/" }).generate();
  log("=== Type definitions generated ===\n");
};

const generateDocs = async () => {
  const app = new TypeDoc.Application();

  // If you want TypeDoc to load tsconfig.json / typedoc.json files
  app.options.addReader(new TypeDoc.TSConfigReader());
  app.options.addReader(new TypeDoc.TypeDocReader());

  app.bootstrap({
    // typedoc options here
    entryPoints: ["./index.ts"],
    plugin: ["typedoc-plugin-markdown"],
    readme: "none",
    name: "How to use?",
    //@ts-ignore
    hideInPageTOC: true,
    hideBreadcrumbs: true,
  });

  const project = app.convert();

  if (project) {
    // Project may not have converted correctly
    const outputDir = "docs/generated";

    // Rendered docs
    await app.generateDocs(project, outputDir);

    log("\n=== Merging generated docs ===");

    const readme = await concatMd("./docs", { hideAnchorLinks: true });
    await writeFile("README.md", readme);

    log("=== Docs generated in README.md ===");
    return;
  }

  log("=== Docs generation failed ===");
  process.exit(1);
};

compile();
generateDocs();
