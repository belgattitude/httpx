import type { HttpErrorStatusCodeOrNumber } from "../types";
import type { HttpExceptionParams } from "../types/HttpExceptionParams";
import { brandKey } from "../utils/brand";
import { getNormalizedParams } from "../utils/getNormalizedParams";
import { initProtoAndName } from "../utils/initProtoAndName";
import { HttpException } from "./HttpException";

/**
 * Construct a new HttpClientException class
 *
 * @param statusCode http status code between 400-499, no checks are done on the validity of the number.
 * @param msgOrParams either a message or an object containing HttpExceptionParams
 */
export class HttpClientException extends HttpException {
  static override readonly [brandKey]: string = "HttpClientException";
  constructor(
    statusCode: HttpErrorStatusCodeOrNumber,
    msgOrParams?: HttpExceptionParams | string
  ) {
    const name = "ClientException";
    super(statusCode, getNormalizedParams(name, msgOrParams));
    initProtoAndName(this, name, HttpClientException);
  }
}
