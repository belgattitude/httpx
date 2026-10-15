import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { dxConfig } from "./dx-config.ts";

type TsConfig = {
  compilerOptions: {
    customConditions: string[];
    tsBuildInfoFile: string;
  };
};

const tsconfigBase = JSON.parse(
  readFileSync(
    new URL("typescript/tsconfig.base.json", import.meta.url),
    "utf8"
  )
) as TsConfig;

describe("tsconfig.base.json is in sync with dxConfig", () => {
  it("has the dxConfig customConditions", () => {
    expect(tsconfigBase.compilerOptions.customConditions).toStrictEqual(
      dxConfig.customConditions
    );
  });

  it("stores the build info in the dxConfig packageCacheDir", () => {
    expect(tsconfigBase.compilerOptions.tsBuildInfoFile).toMatch(
      new RegExp(`^\\$\\{configDir\\}/${dxConfig.packageCacheDir}/`)
    );
  });
});
