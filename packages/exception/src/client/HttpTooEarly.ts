import { HttpClientException } from "../base/HttpClientException";
import type { HttpExceptionParams } from "../types/HttpExceptionParams";
import { brandKey } from "../utils/brand";

/**
 * 425 Too early (client / experimental)
 *
 * Indicates that the server is unwilling to risk processing a request that might be replayed.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/425
 */
const status = 425;
export class HttpTooEarly extends HttpClientException {
  static readonly STATUS = status;
  static override readonly [brandKey]: string = "HttpTooEarly";
  constructor(msgOrParams?: HttpExceptionParams | string) {
    super(status, msgOrParams);
  }
}
