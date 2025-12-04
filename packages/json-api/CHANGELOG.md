# @httpx/json-api

## 0.6.5

### Patch Changes

- [#2648](https://github.com/belgattitude/httpx/pull/2648) [`680e368`](https://github.com/belgattitude/httpx/commit/680e368baa2b618e609fe7374ca373002b2680ee) Thanks [@belgattitude](https://github.com/belgattitude)! - Rebuild with latest esbuild 0.27.1

  See upstream fixes: [esbuild v0.27.1 release notes](https://github.com/evanw/esbuild/releases/tag/v0.27.1)

- Updated dependencies [[`680e368`](https://github.com/belgattitude/httpx/commit/680e368baa2b618e609fe7374ca373002b2680ee)]:
  - @httpx/exception@3.1.6

## 0.6.4

### Patch Changes

- [#2643](https://github.com/belgattitude/httpx/pull/2643) [`52f8075`](https://github.com/belgattitude/httpx/commit/52f8075465f567f5b231a2a4b45c7a84c924089c) Thanks [@belgattitude](https://github.com/belgattitude)! - Enable CI for bun latest on CI (bun 1.3.3)

- Updated dependencies [[`52f8075`](https://github.com/belgattitude/httpx/commit/52f8075465f567f5b231a2a4b45c7a84c924089c)]:
  - @httpx/exception@3.1.5

## 0.6.3

### Patch Changes

- [`cc363ff`](https://github.com/belgattitude/httpx/commit/cc363ff36a48aece196423ee61f59a3c6cee48db) Thanks [@belgattitude](https://github.com/belgattitude)! - No code change, maintenance release to rebuild with latest esbuild.

- Updated dependencies [[`cc363ff`](https://github.com/belgattitude/httpx/commit/cc363ff36a48aece196423ee61f59a3c6cee48db)]:
  - @httpx/exception@3.1.4

## 0.6.2

### Patch Changes

- [#2463](https://github.com/belgattitude/httpx/pull/2463) [`1a75006`](https://github.com/belgattitude/httpx/commit/1a75006e9a544360299320ce84ca5ce5e68caf22) Thanks [@belgattitude](https://github.com/belgattitude)! - Rebuild with latest esbuild 0.25.9 (no code change)

- Updated dependencies [[`1a75006`](https://github.com/belgattitude/httpx/commit/1a75006e9a544360299320ce84ca5ce5e68caf22)]:
  - @httpx/exception@3.1.3

## 0.6.1

### Patch Changes

- [#2418](https://github.com/belgattitude/httpx/pull/2418) [`6915894`](https://github.com/belgattitude/httpx/commit/691589482047c4ffb48a3e66c5d4a18a15b4d0d2) Thanks [@belgattitude](https://github.com/belgattitude)! - Rebuild with latest esbuild 0.28.8

- Updated dependencies [[`6915894`](https://github.com/belgattitude/httpx/commit/691589482047c4ffb48a3e66c5d4a18a15b4d0d2)]:
  - @httpx/exception@3.1.2

## 0.6.0

### Minor Changes

- [#2371](https://github.com/belgattitude/httpx/pull/2371) [`8bc68fd`](https://github.com/belgattitude/httpx/commit/8bc68fd67eac8f1335ee61907562399818e23b3b) Thanks [@belgattitude](https://github.com/belgattitude)! - Drop node 18.x, require node 20.x, add node 24.x to CI

### Patch Changes

- Updated dependencies [[`8bc68fd`](https://github.com/belgattitude/httpx/commit/8bc68fd67eac8f1335ee61907562399818e23b3b)]:
  - @httpx/exception@3.1.0

## 0.5.28

### Patch Changes

- [#2290](https://github.com/belgattitude/httpx/pull/2290) [`a795daa`](https://github.com/belgattitude/httpx/commit/a795daa611f33942410777ddf7f561cf5e122028) Thanks [@belgattitude](https://github.com/belgattitude)! - Update esbuild to 0.25.5

- Updated dependencies [[`a795daa`](https://github.com/belgattitude/httpx/commit/a795daa611f33942410777ddf7f561cf5e122028)]:
  - @httpx/exception@3.0.15

## 0.5.27

### Patch Changes

- [#2243](https://github.com/belgattitude/httpx/pull/2243) [`54a79d9`](https://github.com/belgattitude/httpx/commit/54a79d9c530da590f634011ece54e83755ca6d6a) Thanks [@belgattitude](https://github.com/belgattitude)! - Rebuild with tsup 8.5.0, includes a fix for cjs in certain usages

- Updated dependencies [[`54a79d9`](https://github.com/belgattitude/httpx/commit/54a79d9c530da590f634011ece54e83755ca6d6a)]:
  - @httpx/exception@3.0.14

## 0.5.26

### Patch Changes

- [#2226](https://github.com/belgattitude/httpx/pull/2226) [`8548046`](https://github.com/belgattitude/httpx/commit/8548046e58bed76f2e54c709acf92817316783a4) Thanks [@belgattitude](https://github.com/belgattitude)! - Rebuild with latest tsup, esbuild 0.25.4

- Updated dependencies [[`8548046`](https://github.com/belgattitude/httpx/commit/8548046e58bed76f2e54c709acf92817316783a4)]:
  - @httpx/exception@3.0.13

## 0.5.25

### Patch Changes

- [#1872](https://github.com/belgattitude/httpx/pull/1872) [`6b5c38e`](https://github.com/belgattitude/httpx/commit/6b5c38eda03d541c62a1cdf9ba298be5b75087e1) Thanks [@belgattitude](https://github.com/belgattitude)! - Updated browserslist baseline for 2025

  For most users there won't be any change.
  Still around 95% on [browserslist](https://browserslist.dev/?q=ZGVmYXVsdHMsIGNocm9tZSA%2BPSA5NiwgZmlyZWZveCA%2BPSAxMDUsIGVkZ2UgPj0gMTEzLCBzYWZhcmkgPj0gMTUsIGlvcyA%2BPSAxNSwgb3BlcmEgPj0gMTAzLCBub3QgZGVhZA%3D%3D).

  ```
  defaults
  chrome >= 96
  firefox >= 105
  edge >= 113
  safari >= 15
  ios >= 15
  opera >= 103
  not dead
  ```

- Updated dependencies [[`6b5c38e`](https://github.com/belgattitude/httpx/commit/6b5c38eda03d541c62a1cdf9ba298be5b75087e1)]:
  - @httpx/exception@3.0.12

## 0.5.24

### Patch Changes

- [#1546](https://github.com/belgattitude/httpx/pull/1546) [`bdf9e19`](https://github.com/belgattitude/httpx/commit/bdf9e19d11bc66b9b7279da8f292a889f0acbffa) Thanks [@belgattitude](https://github.com/belgattitude)! - Ensure CI tests on Clouflare workers and latest chrome (playwright)

- Updated dependencies [[`bdf9e19`](https://github.com/belgattitude/httpx/commit/bdf9e19d11bc66b9b7279da8f292a889f0acbffa)]:
  - @httpx/exception@3.0.11

## 0.5.23

### Patch Changes

- [#1418](https://github.com/belgattitude/httpx/pull/1418) [`366520a`](https://github.com/belgattitude/httpx/commit/366520abbc4c8161fc42bc241f73338d262d8045) Thanks [@belgattitude](https://github.com/belgattitude)! - Internal refactor based on linter updates

- [#1418](https://github.com/belgattitude/httpx/pull/1418) [`366520a`](https://github.com/belgattitude/httpx/commit/366520abbc4c8161fc42bc241f73338d262d8045) Thanks [@belgattitude](https://github.com/belgattitude)! - Make static methods readonly

- Updated dependencies [[`366520a`](https://github.com/belgattitude/httpx/commit/366520abbc4c8161fc42bc241f73338d262d8045)]:
  - @httpx/exception@3.0.10

## 0.5.22

### Patch Changes

- Updated dependencies [[`36733f0`](https://github.com/belgattitude/httpx/commit/36733f06ef1278a362933c0c4c56e7d6ea9bceca)]:
  - @httpx/exception@3.0.9

## 0.5.21

### Patch Changes

- [#1369](https://github.com/belgattitude/httpx/pull/1369) [`b39a71c`](https://github.com/belgattitude/httpx/commit/b39a71c3e6e2b26003c4d496ab32e7f68af7d5e7) Thanks [@belgattitude](https://github.com/belgattitude)! - Add git url prefix in package.json

- [#1369](https://github.com/belgattitude/httpx/pull/1369) [`b39a71c`](https://github.com/belgattitude/httpx/commit/b39a71c3e6e2b26003c4d496ab32e7f68af7d5e7) Thanks [@belgattitude](https://github.com/belgattitude)! - Remove unecessary default condition from exports

- [#1369](https://github.com/belgattitude/httpx/pull/1369) [`b39a71c`](https://github.com/belgattitude/httpx/commit/b39a71c3e6e2b26003c4d496ab32e7f68af7d5e7) Thanks [@belgattitude](https://github.com/belgattitude)! - Add publint after arethetypeswrong checks

- Updated dependencies [[`b39a71c`](https://github.com/belgattitude/httpx/commit/b39a71c3e6e2b26003c4d496ab32e7f68af7d5e7), [`b39a71c`](https://github.com/belgattitude/httpx/commit/b39a71c3e6e2b26003c4d496ab32e7f68af7d5e7), [`b39a71c`](https://github.com/belgattitude/httpx/commit/b39a71c3e6e2b26003c4d496ab32e7f68af7d5e7)]:
  - @httpx/exception@3.0.8

## 0.5.20

### Patch Changes

- Updated dependencies [[`f6d0479`](https://github.com/belgattitude/httpx/commit/f6d04791f94b43db7335cf1665e60e57e2a89345)]:
  - @httpx/exception@3.0.7

## 0.5.19

### Patch Changes

- [#1154](https://github.com/belgattitude/httpx/pull/1154) [`6a52be7`](https://github.com/belgattitude/httpx/commit/6a52be772efd39c8270f26993d718b180d726539) Thanks [@belgattitude](https://github.com/belgattitude)! - Rebuild using esbuild 0.20.2

- Updated dependencies [[`6a52be7`](https://github.com/belgattitude/httpx/commit/6a52be772efd39c8270f26993d718b180d726539)]:
  - @httpx/exception@3.0.6

## 0.5.18

### Patch Changes

- Updated dependencies [[`a006c93`](https://github.com/belgattitude/httpx/commit/a006c93fe9b34d09c642f68669028353b986b218)]:
  - @httpx/exception@3.0.5

## 0.5.17

### Patch Changes

- Updated dependencies [[`ab3767f`](https://github.com/belgattitude/httpx/commit/ab3767fb70810e6a9d36a6467c6acc2708008796)]:
  - @httpx/exception@3.0.4

## 0.5.16

### Patch Changes

- Updated dependencies [[`8ab0e1a`](https://github.com/belgattitude/httpx/commit/8ab0e1aa4d3fae9a897c89cd34c5cd386395c9ac)]:
  - @httpx/exception@3.0.3

## 0.5.15

### Patch Changes

- [`28687e1`](https://github.com/belgattitude/httpx/commit/28687e16e42019d3d9f7fb1d5d6180a87a2b3324) Thanks [@belgattitude](https://github.com/belgattitude)! - Release with npm provenance

- Updated dependencies [[`28687e1`](https://github.com/belgattitude/httpx/commit/28687e16e42019d3d9f7fb1d5d6180a87a2b3324)]:
  - @httpx/exception@3.0.2

## 0.5.14

### Patch Changes

- [#877](https://github.com/belgattitude/httpx/pull/877) [`e329bcd`](https://github.com/belgattitude/httpx/commit/e329bcd54a5daa4eafb8a9e95117eb2bc07cad1a) Thanks [@belgattitude](https://github.com/belgattitude)! - Add npm provenance to releases

- Updated dependencies [[`e329bcd`](https://github.com/belgattitude/httpx/commit/e329bcd54a5daa4eafb8a9e95117eb2bc07cad1a)]:
  - @httpx/exception@3.0.1

## 0.5.13

### Patch Changes

- [#875](https://github.com/belgattitude/httpx/pull/875) [`b6e2941`](https://github.com/belgattitude/httpx/commit/b6e2941134fcc3de7cde6666067f202f8b6de408) Thanks [@belgattitude](https://github.com/belgattitude)! - Update to rollup 4.9.4

- Updated dependencies [[`5ea92c1`](https://github.com/belgattitude/httpx/commit/5ea92c121c8eed646c3a75a432baf1c2eee1ce44), [`b6e2941`](https://github.com/belgattitude/httpx/commit/b6e2941134fcc3de7cde6666067f202f8b6de408), [`a1b3c9f`](https://github.com/belgattitude/httpx/commit/a1b3c9f8dff302b1524c51dd7621f7774a807c14), [`62332de`](https://github.com/belgattitude/httpx/commit/62332deb1c9d1b66d6a366602d60df23eb62ea69), [`62332de`](https://github.com/belgattitude/httpx/commit/62332deb1c9d1b66d6a366602d60df23eb62ea69), [`a1b3c9f`](https://github.com/belgattitude/httpx/commit/a1b3c9f8dff302b1524c51dd7621f7774a807c14), [`62332de`](https://github.com/belgattitude/httpx/commit/62332deb1c9d1b66d6a366602d60df23eb62ea69), [`a1b3c9f`](https://github.com/belgattitude/httpx/commit/a1b3c9f8dff302b1524c51dd7621f7774a807c14), [`a1b3c9f`](https://github.com/belgattitude/httpx/commit/a1b3c9f8dff302b1524c51dd7621f7774a807c14), [`a1b3c9f`](https://github.com/belgattitude/httpx/commit/a1b3c9f8dff302b1524c51dd7621f7774a807c14), [`c65e11a`](https://github.com/belgattitude/httpx/commit/c65e11a310a704d5b22f7df8e6de866efd525d80)]:
  - @httpx/exception@3.0.0

## 0.5.12

### Patch Changes

- [#858](https://github.com/belgattitude/httpx/pull/858) [`76fd8dc`](https://github.com/belgattitude/httpx/commit/76fd8dc1500125534033845029144ddc091a74a7) Thanks [@belgattitude](https://github.com/belgattitude)! - Release with no changes

- Updated dependencies [[`76fd8dc`](https://github.com/belgattitude/httpx/commit/76fd8dc1500125534033845029144ddc091a74a7)]:
  - @httpx/exception@2.6.4

## 0.5.11

### Patch Changes

- [#856](https://github.com/belgattitude/httpx/pull/856) [`ef4e8c7`](https://github.com/belgattitude/httpx/commit/ef4e8c765c7e63efe38b569385b99cc69bc7f05f) Thanks [@belgattitude](https://github.com/belgattitude)! - Build against browserslist

## 0.5.10

### Patch Changes

- Updated dependencies [[`b418b0b`](https://github.com/belgattitude/httpx/commit/b418b0b8dc914abe3dda3a9893bd0cba1db87560), [`f01defc`](https://github.com/belgattitude/httpx/commit/f01defc16e0f539cb8bbadd95ef2ab25ea1c1601)]:
  - @httpx/exception@2.6.3

## 0.5.9

### Patch Changes

- Updated dependencies [[`e17f083`](https://github.com/belgattitude/httpx/commit/e17f0836c4759c0fec29b2beb0c5c46b55a045a4)]:
  - @httpx/exception@2.6.2

## 0.5.8

### Patch Changes

- [#832](https://github.com/belgattitude/httpx/pull/832) [`321957a`](https://github.com/belgattitude/httpx/commit/321957a9eced15ff132c2ab18789bc4bcde9ff95) Thanks [@belgattitude](https://github.com/belgattitude)! - esbuild updated to 0.19.11 to fix a potential typeScript-specific class transform edge case

- Updated dependencies [[`9d4dd98`](https://github.com/belgattitude/httpx/commit/9d4dd980ea57b99f4697191ac5b2d8d55adcb406), [`321957a`](https://github.com/belgattitude/httpx/commit/321957a9eced15ff132c2ab18789bc4bcde9ff95)]:
  - @httpx/exception@2.6.1

## 0.5.7

### Patch Changes

- Updated dependencies [[`77cd15b`](https://github.com/belgattitude/httpx/commit/77cd15b89fb3d88f1f60babffdaf76e8fa516bf1), [`77cd15b`](https://github.com/belgattitude/httpx/commit/77cd15b89fb3d88f1f60babffdaf76e8fa516bf1), [`77cd15b`](https://github.com/belgattitude/httpx/commit/77cd15b89fb3d88f1f60babffdaf76e8fa516bf1)]:
  - @httpx/exception@2.6.0

## 0.5.6

### Patch Changes

- [#795](https://github.com/belgattitude/httpx/pull/795) [`ca13c91`](https://github.com/belgattitude/httpx/commit/ca13c91f5bae5778debc2fec09aea0b774275f89) Thanks [@belgattitude](https://github.com/belgattitude)! - Fix isPlainObject in edge-runtime

## 0.5.5

### Patch Changes

- Updated dependencies [[`b004243`](https://github.com/belgattitude/httpx/commit/b004243a97cca2df472e97114cfdf1cbd03cb1a6)]:
  - @httpx/exception@2.5.7

## 0.5.4

### Patch Changes

- Updated dependencies [[`39ec1d5`](https://github.com/belgattitude/httpx/commit/39ec1d525d63db3d9e0400689e73f9c32eed91ed)]:
  - @httpx/exception@2.5.6

## 0.5.3

### Patch Changes

- Updated dependencies [[`4e2b795`](https://github.com/belgattitude/httpx/commit/4e2b795a69914f22d01a5137ce38e9fb39e40ed7)]:
  - @httpx/exception@2.5.5

## 0.5.2

### Patch Changes

- Updated dependencies [[`d76a2f9`](https://github.com/belgattitude/httpx/commit/d76a2f9692fcc1083ebdfff3342b91fa30179a6f)]:
  - @httpx/exception@2.5.4

## 0.5.1

### Patch Changes

- [#724](https://github.com/belgattitude/httpx/pull/724) [`8d02a2a`](https://github.com/belgattitude/httpx/commit/8d02a2a516aaf42ff5e002889938c6282c862b47) Thanks [@belgattitude](https://github.com/belgattitude)! - Optimize code thanks to eslint unicorn plugin

- Updated dependencies [[`8d02a2a`](https://github.com/belgattitude/httpx/commit/8d02a2a516aaf42ff5e002889938c6282c862b47)]:
  - @httpx/exception@2.5.3

## 0.5.0

### Minor Changes

- [#719](https://github.com/belgattitude/httpx/pull/719) [`bae6ce0`](https://github.com/belgattitude/httpx/commit/bae6ce05a85822b0ec4658b679e82ce4efa9222f) Thanks [@belgattitude](https://github.com/belgattitude)! - Move to esm first (dual esm/cjs) is still supported

### Patch Changes

- [#719](https://github.com/belgattitude/httpx/pull/719) [`bae6ce0`](https://github.com/belgattitude/httpx/commit/bae6ce05a85822b0ec4658b679e82ce4efa9222f) Thanks [@belgattitude](https://github.com/belgattitude)! - Upgrade tsup to 7.3 and build with esbuild 0.19.3

- Updated dependencies [[`bae6ce0`](https://github.com/belgattitude/httpx/commit/bae6ce05a85822b0ec4658b679e82ce4efa9222f)]:
  - @httpx/exception@2.5.2

## 0.4.6

### Patch Changes

- Updated dependencies [[`92343d2`](https://github.com/belgattitude/httpx/commit/92343d2ef30678cfdb0edd29b8fc2a492b91ec58)]:
  - @httpx/exception@2.5.1

## 0.4.5

### Patch Changes

- Updated dependencies [[`a6a63e1`](https://github.com/belgattitude/httpx/commit/a6a63e174af87f04eaf105a6e45c2ef56fc64ade), [`a6a63e1`](https://github.com/belgattitude/httpx/commit/a6a63e174af87f04eaf105a6e45c2ef56fc64ade)]:
  - @httpx/exception@2.5.0

## 0.4.4

### Patch Changes

- Updated dependencies [[`9d1d248`](https://github.com/belgattitude/httpx/commit/9d1d2484828906559f192ab337b645032c257518)]:
  - @httpx/exception@2.4.0

## 0.4.3

### Patch Changes

- Updated dependencies [[`6872abb`](https://github.com/belgattitude/httpx/commit/6872abbc7d51eca4eae85e66fadef334ef16763d), [`6872abb`](https://github.com/belgattitude/httpx/commit/6872abbc7d51eca4eae85e66fadef334ef16763d)]:
  - @httpx/exception@2.3.0

## 0.4.2

### Patch Changes

- Updated dependencies [[`81311de`](https://github.com/belgattitude/httpx/commit/81311de622f84fadc381394f840318cbd542a68e)]:
  - @httpx/exception@2.2.0

## 0.4.1

### Patch Changes

- Updated dependencies [[`6eab016`](https://github.com/belgattitude/httpx/commit/6eab0169ccb0049da158fd9e24a645011a84e275)]:
  - @httpx/exception@2.1.1

## 0.4.0

### Minor Changes

- [#532](https://github.com/belgattitude/httpx/pull/532) [`cfe1808`](https://github.com/belgattitude/httpx/commit/cfe180848a01e94ff475c2d27bdf1c9d3c007a2f) Thanks [@belgattitude](https://github.com/belgattitude)! - Lint with typescript/eslint v6 strict

### Patch Changes

- Updated dependencies [[`cfe1808`](https://github.com/belgattitude/httpx/commit/cfe180848a01e94ff475c2d27bdf1c9d3c007a2f)]:
  - @httpx/exception@2.1.0

## 0.3.2

### Patch Changes

- Updated dependencies [[`58ea021`](https://github.com/belgattitude/httpx/commit/58ea021a8126622b1b37d1045c48d1fa45029753), [`58ea021`](https://github.com/belgattitude/httpx/commit/58ea021a8126622b1b37d1045c48d1fa45029753), [`58ea021`](https://github.com/belgattitude/httpx/commit/58ea021a8126622b1b37d1045c48d1fa45029753)]:
  - @httpx/exception@2.0.0

## 0.3.1

### Patch Changes

- [#505](https://github.com/belgattitude/httpx/pull/505) [`6dbbf43`](https://github.com/belgattitude/httpx/commit/6dbbf4302de24157cdc73a6179b64e1611c1db55) Thanks [@belgattitude](https://github.com/belgattitude)! - Transpile from es2020 to es2019 to widen browser support

## 0.3.0

### Minor Changes

- [#501](https://github.com/belgattitude/httpx/pull/501) [`eb2c363`](https://github.com/belgattitude/httpx/commit/eb2c363fc4eef1bf66df9843bddf779fc95d26f8) Thanks [@belgattitude](https://github.com/belgattitude)! - Fix type exports

## 0.2.4

### Patch Changes

- [#487](https://github.com/belgattitude/httpx/pull/487) [`b5c1845`](https://github.com/belgattitude/httpx/commit/b5c1845fbb8d025592f47a463310f5aa2b1ad83e) Thanks [@belgattitude](https://github.com/belgattitude)! - Add missing JsonApiErrorFactory export

## 0.2.3

### Patch Changes

- [#482](https://github.com/belgattitude/httpx/pull/482) [`5337e61`](https://github.com/belgattitude/httpx/commit/5337e6135a41497341c6a3b1653a9641508d4142) Thanks [@belgattitude](https://github.com/belgattitude)! - Improve typecheck strictness

- Updated dependencies [[`5337e61`](https://github.com/belgattitude/httpx/commit/5337e6135a41497341c6a3b1653a9641508d4142)]:
  - @httpx/exception@1.8.3

## 0.2.2

### Patch Changes

- [#475](https://github.com/belgattitude/httpx/pull/475) [`5cbc564`](https://github.com/belgattitude/httpx/commit/5cbc564595a12dc87a07ed5a3bcc4e42f1b671f7) Thanks [@belgattitude](https://github.com/belgattitude)! - Fix release

## 0.2.1

### Patch Changes

- [#473](https://github.com/belgattitude/httpx/pull/473) [`b7db5b5`](https://github.com/belgattitude/httpx/commit/b7db5b5bbd806444f38b13571e03cd4edefaba69) Thanks [@belgattitude](https://github.com/belgattitude)! - Fix publishing

## 0.2.0

### Minor Changes

- [#471](https://github.com/belgattitude/httpx/pull/471) [`cf186a4`](https://github.com/belgattitude/httpx/commit/cf186a41dc1e95a1f34a9428e411a3d00dbba2e0) Thanks [@belgattitude](https://github.com/belgattitude)! - Initial and experimental json-api helpers
