[@httpx/exception](../README.md) / typeguards

# Module: typeguards

## Table of contents

### Functions

- [isHttpClientException](typeguards.md#ishttpclientexception)
- [isHttpErrorStatusCode](typeguards.md#ishttperrorstatuscode)
- [isHttpException](typeguards.md#ishttpexception)
- [isHttpServerException](typeguards.md#ishttpserverexception)
- [isHttpStatusCode](typeguards.md#ishttpstatuscode)

## Functions

### isHttpClientException

▸ **isHttpClientException**(`error`): error is HttpClientException

#### Parameters

| Name    | Type      |
| :------ | :-------- |
| `error` | `unknown` |

#### Returns

error is HttpClientException

---

### isHttpErrorStatusCode

▸ **isHttpErrorStatusCode**<`T`\>(`statusCode`): statusCode is T

Check if the provided value is a valid http status code

#### Type parameters

| Name | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| :--- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `T`  | extends `400` \| `409` \| `417` \| `424` \| `403` \| `410` \| `418` \| `411` \| `423` \| `405` \| `421` \| `406` \| `404` \| `413` \| `402` \| `412` \| `428` \| `407` \| `416` \| `431` \| `408` \| `425` \| `429` \| `401` \| `451` \| `422` \| `415` \| `426` \| `414` \| `502` \| `504` \| `507` \| `500` \| `508` \| `511` \| `510` \| `501` \| `503` \| `506` \| `505` = `400` \| `409` \| `417` \| `424` \| `403` \| `410` \| `418` \| `411` \| `423` \| `405` \| `421` \| `406` \| `404` \| `413` \| `402` \| `412` \| `428` \| `407` \| `416` \| `431` \| `408` \| `425` \| `429` \| `401` \| `451` \| `422` \| `415` \| `426` \| `414` \| `502` \| `504` \| `507` \| `500` \| `508` \| `511` \| `510` \| `501` \| `503` \| `506` \| `505` |

#### Parameters

| Name         | Type      |
| :----------- | :-------- |
| `statusCode` | `unknown` |

#### Returns

statusCode is T

---

### isHttpException

▸ **isHttpException**(`error`): error is HttpException

#### Parameters

| Name    | Type      |
| :------ | :-------- |
| `error` | `unknown` |

#### Returns

error is HttpException

---

### isHttpServerException

▸ **isHttpServerException**(`error`): error is HttpServerException

#### Parameters

| Name    | Type      |
| :------ | :-------- |
| `error` | `unknown` |

#### Returns

error is HttpServerException

---

### isHttpStatusCode

▸ **isHttpStatusCode**(`statusCode`): statusCode is 400 \| 409 \| 417 \| 424 \| 403 \| 410 \| 418 \| 411 \| 423 \| 405 \| 421 \| 406 \| 404 \| 413 \| 402 \| 412 \| 428 \| 407 \| 416 \| 431 \| 408 \| 425 \| 429 \| 401 \| 451 \| 422 \| 415 \| 426 \| 414 \| 502 \| 504 \| 507 \| 500 \| 508 \| 511 \| 510 \| 501 \| 503 \| 506 \| 505

Check if the provided value is a valid http status code

#### Parameters

| Name         | Type      |
| :----------- | :-------- |
| `statusCode` | `unknown` |

#### Returns

statusCode is 400 \| 409 \| 417 \| 424 \| 403 \| 410 \| 418 \| 411 \| 423 \| 405 \| 421 \| 406 \| 404 \| 413 \| 402 \| 412 \| 428 \| 407 \| 416 \| 431 \| 408 \| 425 \| 429 \| 401 \| 451 \| 422 \| 415 \| 426 \| 414 \| 502 \| 504 \| 507 \| 500 \| 508 \| 511 \| 510 \| 501 \| 503 \| 506 \| 505
