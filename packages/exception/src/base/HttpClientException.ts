import { brandKey } from "../utils/brand";
import { HttpException } from "./HttpException";

/**
 * Construct a new HttpClientException class
 *
 * @param statusCode http status code between 400-499, no checks are done on the validity of the number.
 * @param msgOrParams either a message or an object containing HttpExceptionParams
 */
export class HttpClientException extends HttpException {
  static override readonly [brandKey]: string = "HttpClientException";
}
