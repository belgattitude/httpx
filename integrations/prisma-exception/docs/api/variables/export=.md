[**prisma-exception**](../README.md)

***

[prisma-exception](../globals.md) / export=

# Variable: export=

> **export=**: `object`

Defined in: [package.json:1](https://github.com/belgattitude/httpx/blob/d975bb2c60098569db690fb567053dfa3514ae29/integrations/prisma-exception/package.json#L1)

## Type declaration

### author

> **author**: `object`

#### author.name

> **name**: `string` = `"Vanvelthem Sébastien"`

#### author.url

> **url**: `string` = `"https://github.com/belgattitude"`

### dependencies

> **dependencies**: `object`

#### dependencies.@httpx/exception

> **@httpx/exception**: `string` = `"workspace:^"`

### description

> **description**: `string` = `"Prisma errors to http exceptions."`

### devDependencies

> **devDependencies**: `object`

#### devDependencies.@arethetypeswrong/cli

> **@arethetypeswrong/cli**: `string` = `"0.17.3"`

#### devDependencies.@belgattitude/eslint-config-bases

> **@belgattitude/eslint-config-bases**: `string` = `"6.23.0"`

#### devDependencies.@size-limit/file

> **@size-limit/file**: `string` = `"11.2.0"`

#### devDependencies.@size-limit/webpack

> **@size-limit/webpack**: `string` = `"11.2.0"`

#### devDependencies.@size-limit/webpack-why

> **@size-limit/webpack-why**: `string` = `"11.2.0"`

#### devDependencies.@types/node

> **@types/node**: `string` = `"22.13.4"`

#### devDependencies.@vitest/coverage-istanbul

> **@vitest/coverage-istanbul**: `string` = `"3.0.6"`

#### devDependencies.@vitest/ui

> **@vitest/ui**: `string` = `"3.0.6"`

#### devDependencies.browserslist

> **browserslist**: `string` = `"4.24.4"`

#### devDependencies.browserslist-to-esbuild

> **browserslist-to-esbuild**: `string` = `"2.1.1"`

#### devDependencies.cross-env

> **cross-env**: `string` = `"7.0.3"`

#### devDependencies.es-check

> **es-check**: `string` = `"8.0.1"`

#### devDependencies.esbuild

> **esbuild**: `string` = `"0.25.0"`

#### devDependencies.eslint

> **eslint**: `string` = `"8.57.1"`

#### devDependencies.npm-run-all2

> **npm-run-all2**: `string` = `"7.0.2"`

#### devDependencies.prettier

> **prettier**: `string` = `"3.5.1"`

#### devDependencies.publint

> **publint**: `string` = `"0.3.5"`

#### devDependencies.rimraf

> **rimraf**: `string` = `"6.0.1"`

#### devDependencies.size-limit

> **size-limit**: `string` = `"11.2.0"`

#### devDependencies.tsup

> **tsup**: `string` = `"8.3.6"`

#### devDependencies.typedoc

> **typedoc**: `string` = `"0.27.7"`

#### devDependencies.typedoc-plugin-markdown

> **typedoc-plugin-markdown**: `string` = `"4.4.2"`

#### devDependencies.typescript

> **typescript**: `string` = `"5.7.3"`

#### devDependencies.vite-tsconfig-paths

> **vite-tsconfig-paths**: `string` = `"5.1.4"`

#### devDependencies.vitest

> **vitest**: `string` = `"3.0.6"`

#### devDependencies.webpack

> **webpack**: `string` = `"5.98.0"`

### engines

> **engines**: `object`

#### engines.node

> **node**: `string` = `">=18"`

### exports

> **exports**: `object`

#### exports..

> ****: `object`

#### exports...import

> **import**: `object`

#### exports...import.default

> **default**: `string` = `"./dist/index.mjs"`

#### exports...import.types

> **types**: `string` = `"./dist/index.d.ts"`

#### exports...require

> **require**: `object`

#### exports...require.default

> **default**: `string` = `"./dist/index.cjs"`

#### exports...require.types

> **types**: `string` = `"./dist/index.d.cts"`

#### exports../package.json

> **json**: `string` = `"./package.json"`

### files

> **files**: `string`[]

### homepage

> **homepage**: `string` = `"https://github.com/belgattitude/httpx/tree/main/integrations/prisma-exception#readme"`

### keywords

> **keywords**: `string`[]

### license

> **license**: `string` = `"MIT"`

### main

> **main**: `string` = `"./dist/index.cjs"`

### module

> **module**: `string` = `"./dist/index.mjs"`

### name

> **name**: `string` = `"prisma-exception"`

### repository

> **repository**: `object`

#### repository.directory

> **directory**: `string` = `"integrations/prisma-exception"`

#### repository.type

> **type**: `string` = `"git"`

#### repository.url

> **url**: `string` = `"git+https://github.com/belgattitude/httpx.git"`

### scripts

> **scripts**: `object`

#### scripts.?build-release

> **?build-release**: `string` = `"When https://github.com/atlassian/changesets/issues/432 has a solution we can remove this trick"`

#### scripts.build

> **build**: `string` = `"run clean && yarn run tsup"`

#### scripts.build-release

> **build-release**: `string` = `"yarn build"`

#### scripts.check-dist

> **check-dist**: `string` = `"es-check --not './dist/esm/*.map.js' -v es2022 --module './dist/**/*.mjs'"`

#### scripts.check-pub

> **check-pub**: `string` = `"attw --pack && publint"`

#### scripts.check-size

> **check-size**: `string` = `"size-limit"`

#### scripts.ci-coverage-upload

> **ci-coverage-upload**: `string` = `"../../.github/scripts/download/codecov -F httpx-exception-unit --dir ./coverage"`

#### scripts.clean

> **clean**: `string` = `"rimraf ./dist ./coverage ./tsconfig.tsbuildinfo"`

#### scripts.docgen

> **docgen**: `string` = `"run-s docgen-typedoc"`

#### scripts.docgen-typedoc

> **docgen-typedoc**: `string` = `"rimraf ./docs/api && typedoc --plugin typedoc-plugin-markdown --out ./docs/api"`

#### scripts.fix-all-files

> **fix-all-files**: `string` = `"eslint . --ext .ts,.tsx,.js,.jsx,.mjs,.cjs,.mts,.cts --fix"`

#### scripts.lint

> **lint**: `string` = `"eslint . --ext .ts,.tsx,.js,.jsx,.mjs,.cjs,.mts,.cts --cache --cache-location ../../.cache/eslint/prisma-exception.eslintcache"`

#### scripts.lint-timing

> **lint-timing**: `string` = `"cross-env TIMING=1 run lint"`

#### scripts.prettier-check

> **prettier-check**: `string` = `"run --top-level prettier --check --cache --cache-location=\"../../.cache/prettier/prisma-exception.prettiercache\" --config ../../.prettierrc.js --ignore-path ../../.prettierignore \"./**/*.{js,jsx,cjs,mjs,ts,tsx,mts,md,mdx,json,css,scss,less}\""`

#### scripts.prettier-fix

> **prettier-fix**: `string` = `"run --top-level prettier --write --cache --cache-location=\"../../.cache/prettier/prisma-exception.prettiercache\" --config ../../.prettierrc.js --ignore-path ../../.prettierignore \"./**/*.{js,jsx,cjs,mjs,ts,tsx,mts,md,mdx,json,css,scss,less}\""`

#### scripts.test

> **test**: `string` = `"vitest run"`

#### scripts.test-unit

> **test-unit**: `string` = `"vitest run"`

#### scripts.test-unit-coverage

> **test-unit-coverage**: `string` = `"vitest run --coverage"`

#### scripts.test-unit-watch

> **test-unit-watch**: `string` = `"vitest --ui"`

#### scripts.typecheck

> **typecheck**: `string` = `"tsc --project ./tsconfig.json --noEmit"`

### sideEffects

> **sideEffects**: `boolean` = `false`

### type

> **type**: `string` = `"module"`

### types

> **types**: `string` = `"./dist/index.d.cts"`

### version

> **version**: `string` = `"0.0.18"`
