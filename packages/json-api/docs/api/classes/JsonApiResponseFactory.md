[**@httpx/json-api v0.5.25**](../README.md)

***

[@httpx/json-api](../README.md) / JsonApiResponseFactory

# Class: JsonApiResponseFactory

## Constructors

### new JsonApiResponseFactory()

> **new JsonApiResponseFactory**(): [`JsonApiResponseFactory`](JsonApiResponseFactory.md)

#### Returns

[`JsonApiResponseFactory`](JsonApiResponseFactory.md)

## Methods

### fromError()

> `readonly` `static` **fromError**(`errors`, `httpStatus`?): [`JsonApiErrorResponse`](../type-aliases/JsonApiErrorResponse.md)

#### Parameters

##### errors

`string` | [`JsonApiError`](../type-aliases/JsonApiError.md) | [`JsonApiError`](../type-aliases/JsonApiError.md)[]

##### httpStatus?

`number`

fallback http status if not present in JsonApiError

#### Returns

[`JsonApiErrorResponse`](../type-aliases/JsonApiErrorResponse.md)

***

### fromSuccess()

> `readonly` `static` **fromSuccess**\<`T`\>(`data`, `metadata`?): [`JsonApiSuccessResponse`](../type-aliases/JsonApiSuccessResponse.md)\<`T`\>

#### Type Parameters

• **T**

#### Parameters

##### data

`T`

##### metadata?

`object` & `Record`\<`string`, `string` \| `number` \| `boolean` \| `Record`\<`string`, `unknown`\>\>

#### Returns

[`JsonApiSuccessResponse`](../type-aliases/JsonApiSuccessResponse.md)\<`T`\>
