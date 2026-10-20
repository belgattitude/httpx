import { HttpClientException } from "../base/HttpClientException";
import type { HttpExceptionParams } from "../types/HttpExceptionParams";
import { brandKey } from "../utils/brand";

/**
 * 416 Range Not Satisfiable (client)
 *
 * The range specified by the Range header field in the request cannot be fulfilled.
 * It's possible that the range is outside the size of the target URI's data.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/416
 * @see https://httpstatus.in/416/
 */
const status = 416;
export class HttpRangeNotSatisfiable extends HttpClientException {
  static readonly STATUS = status;
  static override readonly [brandKey]: string = "HttpRangeNotSatisfiable";
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, msgOrParams);
  }
}
