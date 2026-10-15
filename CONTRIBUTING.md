# Contributing

The base branch is **`main`**.

## Workflow

> **Note** Please feature/fix/update... into individual PRs (not one changing everything)

- Create a [github fork](https://docs.github.com/en/get-started/quickstart/fork-a-repo).
- On your fork, create a branch make the changes, commit and push.
- Create a pull-request.

## Install

This repo uses [pnpm](https://pnpm.io) (see `packageManager` in the root package.json).

```bash
pnpm install
# to run test-unit-browser scripts, you can install the browser dependencies
pnpm install:playwright
```

## Checklist

If applicable:

- [x] **tests** should be included part of your PR (`pnpm g:test-unit`).
- [x] a **changeset** should be provided (`pnpm g:changeset`) to request a version bump.
- [x] **documentation** should be updated (`pnpm g:build-doc` to rebuild the api doc).

## Structure

```
.
├── examples
│   └── next-app
└── packages
    │── assert
    │── dsn-parser
    └── exception
```

## Local scripts

| Name | Description |
| --- | --- |
| `pnpm g:changeset` | Add a changeset to declare a new version |
| `pnpm g:typecheck` | Run typechecks in all workspaces |
| `pnpm g:lint` | Display linter issues in all workspaces |
| `pnpm g:lint --fix` | Attempt to run linter auto-fix in all workspaces |
| `pnpm g:test-unit` | Run unit tests in all workspaces (node) |
| `pnpm g:test-unit-edge` | Run unit tests in all workspaces (@vercel-edge-runtime) |
| `pnpm g:test-unit-browser` | Run unit tests in all workspaces (latest chrome) |
| `pnpm g:test-unit-cloudflare` | Run unit tests in all workspaces (latest chrome) |
| `pnpm g:build` | Run build in all workspaces |
| `pnpm g:clean` | Clean builds in all workspaces |
| `pnpm g:check-dist` | Ensure build dist files passes es2017 (run `g:build` first). |
| `pnpm g:check-size` | Ensure build files are within size limit (run `g:build` first). |
| `pnpm g:docgen` | Build documentation (generally api doc) |
| `pnpm g:bench` | Run benchmarks for all workspaces. |
| `pnpm clean:global-cache` | Clean tooling caches |
| `pnpm deps:check --dep dev` | Will print what packages can be upgraded globally (see also [.ncurc.mjs](https://github.com/belgattitude/httpx/blob/main/.ncurc.mjs)) |
| `pnpm deps:update --dep dev` | Apply possible updates (run `pnpm install && pnpm dedupe` after) |
| `pnpm peers check` | Verify if there's no peer-deps missing in packages |
| `pnpm dedupe` | Built-in pnpm deduplication of the lock file |

## Git message format

This repo adheres to the [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/) convention.

### Activated prefixes

- **chore**: Changes that affect the build system or external dependencies
- **ci**: Changes to our CI configuration files and scripts
- **docs**: Documentation only changes
- **feat**: A new feature
- **fix**: A bug fix
- **perf**: A code change that improves performance
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **lint**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **test**: Adding missing tests or correcting existing tests
- **translation**: Adding missing translations or correcting existing ones
- **revert**: When reverting a commit
- **style**: A change that affects the scss, less, css styles
- **release**: All related to changeset (pre exit...)
