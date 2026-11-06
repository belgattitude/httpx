# @httpx/barcode

## 0.2.0

### Minor Changes

- [#2912](https://github.com/belgattitude/httpx/pull/2912) [`1be7330`](https://github.com/belgattitude/httpx/commit/1be7330c68230fac3243a26d6353a5f67f82e985) Thanks [@belgattitude](https://github.com/belgattitude)! - Refuse all GS1 restricted circulation numbers by default, add the `acceptRestricted` option and improve performance.
  
  **Breaking**: restricted circulation EAN-13 (`02`, `04`, `20`-`29`), UPC-A (`2`, `4`) and the GTIN-14 containing them are now refused by default, like restricted EAN-8 (`0`, `2`) already were. Pass `{ acceptRestricted: true }` to accept them (EAN-8 included):
  
  ```typescript
  isEan13("2123456789010"); // 👈 false
  isEan13("2123456789010", { acceptRestricted: true }); // 👈 true
  detectBarcodeType("212345678992", { acceptRestricted: true }); // 👈 "upca"
  normalizeGtin(21234569, { acceptRestricted: true }); // 👈 "00000021234569"
  formatGtin("2123456789010", 14, { acceptRestricted: true });
  assertEan13(v, undefined, { acceptRestricted: true });
  ```
  
  As the guards now take options, use an arrow function with array methods: `codes.filter((c) => isEan13(c))`.
  
  Performance: faster check digit validation (`charCodeAt`, single comparison range check), cheaper restricted range check done before the check digit loop, and `normalizeGtin` validates before padding (~2x faster).

## 0.1.0

### Minor Changes

- [`0538a76`](https://github.com/belgattitude/httpx/commit/0538a76069b9e73ff946e7230e2a376286a1fe29) Thanks [@belgattitude](https://github.com/belgattitude)! - Initial release of @httpx/barcode
