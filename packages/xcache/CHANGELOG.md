# @httpx/xcache

## 0.4.10

### Patch Changes

- Updated dependencies [[`4878acb`](https://github.com/belgattitude/httpx/commit/4878acb749b803060d052c5d501102b0ccab9748), [`4878acb`](https://github.com/belgattitude/httpx/commit/4878acb749b803060d052c5d501102b0ccab9748), [`4878acb`](https://github.com/belgattitude/httpx/commit/4878acb749b803060d052c5d501102b0ccab9748), [`4878acb`](https://github.com/belgattitude/httpx/commit/4878acb749b803060d052c5d501102b0ccab9748), [`4878acb`](https://github.com/belgattitude/httpx/commit/4878acb749b803060d052c5d501102b0ccab9748)]:
  - @httpx/lru@0.13.0

## 0.4.9

### Patch Changes

- [#2652](https://github.com/belgattitude/httpx/pull/2652) [`2cbe861`](https://github.com/belgattitude/httpx/commit/2cbe861ea41bd5a7b4d0542c4c891aa67570395b) Thanks [@belgattitude](https://github.com/belgattitude)! - Rebuild with latest esbuild 0.27.1

  See upstream fixes: [esbuild v0.27.1 release notes](https://github.com/evanw/esbuild/releases/tag/v0.27.1)

  PS: due to a failing ci action, the correct changes can be found in [#2648](https://github.com/belgattitude/httpx/pull/2648)

- Updated dependencies [[`2cbe861`](https://github.com/belgattitude/httpx/commit/2cbe861ea41bd5a7b4d0542c4c891aa67570395b)]:
  - @httpx/stable-hash@0.3.7
  - @httpx/compress@0.3.10
  - @httpx/lru@0.12.4

## 0.4.8

### Patch Changes

- [#2650](https://github.com/belgattitude/httpx/pull/2650) [`a30cf76`](https://github.com/belgattitude/httpx/commit/a30cf7699e9950315ebc4002a9f387929935da75) Thanks [@belgattitude](https://github.com/belgattitude)! - Rebuild with latest esbuild 0.27.1

  See upstream fixes: [esbuild v0.27.1 release notes](https://github.com/evanw/esbuild/releases/tag/v0.27.1)

  PS: due a failing ci action, the correct changes can be found in [#2648](https://github.com/belgattitude/httpx/pull/2648)

- Updated dependencies [[`a30cf76`](https://github.com/belgattitude/httpx/commit/a30cf7699e9950315ebc4002a9f387929935da75)]:
  - @httpx/stable-hash@0.3.6
  - @httpx/compress@0.3.9
  - @httpx/lru@0.12.3

## 0.4.7

### Patch Changes

- [#2648](https://github.com/belgattitude/httpx/pull/2648) [`680e368`](https://github.com/belgattitude/httpx/commit/680e368baa2b618e609fe7374ca373002b2680ee) Thanks [@belgattitude](https://github.com/belgattitude)! - Rebuild with latest esbuild 0.27.1

  See upstream fixes: [esbuild v0.27.1 release notes](https://github.com/evanw/esbuild/releases/tag/v0.27.1)

- Updated dependencies [[`680e368`](https://github.com/belgattitude/httpx/commit/680e368baa2b618e609fe7374ca373002b2680ee)]:
  - @httpx/stable-hash@0.3.5
  - @httpx/compress@0.3.8
  - @httpx/lru@0.12.2

## 0.4.6

### Patch Changes

- [#2643](https://github.com/belgattitude/httpx/pull/2643) [`52f8075`](https://github.com/belgattitude/httpx/commit/52f8075465f567f5b231a2a4b45c7a84c924089c) Thanks [@belgattitude](https://github.com/belgattitude)! - Enable CI for bun latest on CI (bun 1.3.3)

- Updated dependencies [[`52f8075`](https://github.com/belgattitude/httpx/commit/52f8075465f567f5b231a2a4b45c7a84c924089c)]:
  - @httpx/stable-hash@0.3.4
  - @httpx/compress@0.3.7
  - @httpx/lru@0.12.1

## 0.4.5

### Patch Changes

- [#2632](https://github.com/belgattitude/httpx/pull/2632) [`087482a`](https://github.com/belgattitude/httpx/commit/087482a0c7d29441d40e1c044717299ccb8a0653) Thanks [@belgattitude](https://github.com/belgattitude)! - Update minimum peer-deps for devalue and superjson to latest. They bring fixes and some
  speedup.

  ```json
  {
    "peerDependencies": {
      "devalue": "^5.4.2",
      "superjson": "^2.2.5"
    },
    "peerDependenciesMeta": {
      "devalue": {
        "optional": true
      },
      "superjson": {
        "optional": true
      }
    }
  }
  ```

## 0.4.4

### Patch Changes

- Updated dependencies [[`6c2486e`](https://github.com/belgattitude/httpx/commit/6c2486e082cdeacee0969a359213570aef512a04)]:
  - @httpx/lru@0.12.0

## 0.4.3

### Patch Changes

- [`cc363ff`](https://github.com/belgattitude/httpx/commit/cc363ff36a48aece196423ee61f59a3c6cee48db) Thanks [@belgattitude](https://github.com/belgattitude)! - No code change, maintenance release to rebuild with latest esbuild.

- Updated dependencies [[`cc363ff`](https://github.com/belgattitude/httpx/commit/cc363ff36a48aece196423ee61f59a3c6cee48db)]:
  - @httpx/stable-hash@0.3.3
  - @httpx/compress@0.3.6
  - @httpx/lru@0.11.5

## 0.4.2

### Patch Changes

- [#2482](https://github.com/belgattitude/httpx/pull/2482) [`e4eae87`](https://github.com/belgattitude/httpx/commit/e4eae87f118ea6f0fbd46611e4dd2697b8adf9a1) Thanks [@belgattitude](https://github.com/belgattitude)! - Base64 perf improvements by using "uint8array-extras:^1.5.0"

  See: https://github.com/sindresorhus/uint8array-extras/releases/tag/v1.5.0

- Updated dependencies [[`e4eae87`](https://github.com/belgattitude/httpx/commit/e4eae87f118ea6f0fbd46611e4dd2697b8adf9a1)]:
  - @httpx/compress@0.3.5

## 0.4.1

### Patch Changes

- [#2463](https://github.com/belgattitude/httpx/pull/2463) [`1a75006`](https://github.com/belgattitude/httpx/commit/1a75006e9a544360299320ce84ca5ce5e68caf22) Thanks [@belgattitude](https://github.com/belgattitude)! - Rebuild with latest esbuild 0.25.9 (no code change)

- Updated dependencies [[`1a75006`](https://github.com/belgattitude/httpx/commit/1a75006e9a544360299320ce84ca5ce5e68caf22)]:
  - @httpx/stable-hash@0.3.2
  - @httpx/compress@0.3.4
  - @httpx/lru@0.11.4

## 0.4.0

### Minor Changes

- [#2432](https://github.com/belgattitude/httpx/pull/2432) [`27c391a`](https://github.com/belgattitude/httpx/commit/27c391abcd562888a7b615f342353fa02a0f0383) Thanks [@belgattitude](https://github.com/belgattitude)! - Add compression utilities

### Patch Changes

- [#2434](https://github.com/belgattitude/httpx/pull/2434) [`eb09668`](https://github.com/belgattitude/httpx/commit/eb0966865e27885ade11d46bb533be3223eb4176) Thanks [@belgattitude](https://github.com/belgattitude)! - Cache compression: add support deflate (slightly faster than gzip).

- Updated dependencies [[`eb09668`](https://github.com/belgattitude/httpx/commit/eb0966865e27885ade11d46bb533be3223eb4176)]:
  - @httpx/compress@0.3.2

## 0.3.0

### Minor Changes

- [#2426](https://github.com/belgattitude/httpx/pull/2426) [`714b5d1`](https://github.com/belgattitude/httpx/commit/714b5d11e09990d8e4e8eb4e5018969d7a662b1a) Thanks [@belgattitude](https://github.com/belgattitude)! - Rework internal and improve cache key handling.

## 0.2.1

### Patch Changes

- [#2418](https://github.com/belgattitude/httpx/pull/2418) [`6915894`](https://github.com/belgattitude/httpx/commit/691589482047c4ffb48a3e66c5d4a18a15b4d0d2) Thanks [@belgattitude](https://github.com/belgattitude)! - Rebuild with latest esbuild 0.28.8

- Updated dependencies [[`6915894`](https://github.com/belgattitude/httpx/commit/691589482047c4ffb48a3e66c5d4a18a15b4d0d2)]:
  - @httpx/stable-hash@0.3.1
  - @httpx/compress@0.3.1
  - @httpx/lru@0.11.3

## 0.2.0

### Minor Changes

- [#2413](https://github.com/belgattitude/httpx/pull/2413) [`15c8850`](https://github.com/belgattitude/httpx/commit/15c88502d03ee5c49d4debe8d374e76c4cf414ce) Thanks [@belgattitude](https://github.com/belgattitude)! - Add initial alpha support for XMemCache

### Patch Changes

- Updated dependencies [[`15c8850`](https://github.com/belgattitude/httpx/commit/15c88502d03ee5c49d4debe8d374e76c4cf414ce)]:
  - @httpx/lru@0.11.2

## 0.1.0

### Minor Changes

- [#2371](https://github.com/belgattitude/httpx/pull/2371) [`8bc68fd`](https://github.com/belgattitude/httpx/commit/8bc68fd67eac8f1335ee61907562399818e23b3b) Thanks [@belgattitude](https://github.com/belgattitude)! - Drop node 18.x, require node 20.x, add node 24.x to CI

### Patch Changes

- Updated dependencies [[`8bc68fd`](https://github.com/belgattitude/httpx/commit/8bc68fd67eac8f1335ee61907562399818e23b3b)]:
  - @httpx/stable-hash@0.3.0
  - @httpx/compress@0.3.0
  - @httpx/lru@0.11.0

## 0.0.11

### Patch Changes

- Updated dependencies [[`a795daa`](https://github.com/belgattitude/httpx/commit/a795daa611f33942410777ddf7f561cf5e122028)]:
  - @httpx/stable-hash@0.2.3
  - @httpx/compress@0.2.4
  - @httpx/lru@0.10.1

## 0.0.10

### Patch Changes

- Updated dependencies [[`31dd527`](https://github.com/belgattitude/httpx/commit/31dd527a6139a555951278060c3c8c38fffbc157)]:
  - @httpx/lru@0.10.0

## 0.0.9

### Patch Changes

- [#2243](https://github.com/belgattitude/httpx/pull/2243) [`54a79d9`](https://github.com/belgattitude/httpx/commit/54a79d9c530da590f634011ece54e83755ca6d6a) Thanks [@belgattitude](https://github.com/belgattitude)! - Rebuild with tsup 8.5.0, includes a fix for cjs in certain usages

- Updated dependencies [[`54a79d9`](https://github.com/belgattitude/httpx/commit/54a79d9c530da590f634011ece54e83755ca6d6a)]:
  - @httpx/stable-hash@0.2.2
  - @httpx/compress@0.2.3

## 0.0.8

### Patch Changes

- Updated dependencies [[`8548046`](https://github.com/belgattitude/httpx/commit/8548046e58bed76f2e54c709acf92817316783a4)]:
  - @httpx/stable-hash@0.2.1
  - @httpx/compress@0.2.2
  - @httpx/lru@0.9.2

## 0.0.7

### Patch Changes

- Updated dependencies [[`7169124`](https://github.com/belgattitude/httpx/commit/71691247feb901db5912353de54d23bd3362d0e9), [`7169124`](https://github.com/belgattitude/httpx/commit/71691247feb901db5912353de54d23bd3362d0e9)]:
  - @httpx/lru@0.9.1

## 0.0.6

### Patch Changes

- Updated dependencies [[`e4d256d`](https://github.com/belgattitude/httpx/commit/e4d256d5511c007cba6c12bdb153ed5c52f151d1)]:
  - @httpx/compress@0.2.1

## 0.0.5

### Patch Changes

- Updated dependencies [[`e774441`](https://github.com/belgattitude/httpx/commit/e77444125a62954a779aca6b9797a4ecf56e716f)]:
  - @httpx/compress@0.2.0

## 0.0.4

### Patch Changes

- Updated dependencies [[`58ea168`](https://github.com/belgattitude/httpx/commit/58ea168357ac6cd80ba07fbf4b6afee85a7e8052), [`58ea168`](https://github.com/belgattitude/httpx/commit/58ea168357ac6cd80ba07fbf4b6afee85a7e8052), [`58ea168`](https://github.com/belgattitude/httpx/commit/58ea168357ac6cd80ba07fbf4b6afee85a7e8052)]:
  - @httpx/compress@0.1.0

## 0.0.3

### Patch Changes

- [`a6575d2`](https://github.com/belgattitude/httpx/commit/a6575d23cebd886ef1ea463eec7ffeba1baf3723) Thanks [@belgattitude](https://github.com/belgattitude)! - Initial release of @httpx/xcache

## 0.0.2

### Patch Changes

- [#1954](https://github.com/belgattitude/httpx/pull/1954) [`a177cbe`](https://github.com/belgattitude/httpx/commit/a177cbed003543dd46df06d0bf6f56fd6af68338) Thanks [@belgattitude](https://github.com/belgattitude)! - Initial draft release of xcache
