[**@httpx/hash v0.1.0**](../../README.md)

***

[@httpx/hash](../../README.md) / [xxhash-wasm](../README.md) / getXXHashAPI

# Function: getXXHashAPI()

> **getXXHashAPI**(): `Promise`\<`XXHashAPI`\>

Load and return a singleton instance of the `xxhash-wasm` module.

This function ensures that the `xxhash-wasm` module is only loaded once,
even if called multiple times. It uses global variables (globalThis) to store
the `XXHashApi` instance.

## Returns

`Promise`\<`XXHashAPI`\>
