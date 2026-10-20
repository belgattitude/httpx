import {
  HttpBadRequest,
  HttpConflict,
  HttpExpectationFailed,
  HttpFailedDependency,
  HttpForbidden,
  HttpGone,
  HttpImATeapot,
  HttpLengthRequired,
  HttpLocked,
  HttpMethodNotAllowed,
  HttpMisdirectedRequest,
  HttpNotAcceptable,
  HttpNotFound,
  HttpPayloadTooLarge,
  HttpPaymentRequired,
  HttpPreconditionFailed,
  HttpPreconditionRequired,
  HttpProxyAuthenticationRequired,
  HttpRangeNotSatisfiable,
  HttpRequestHeaderFieldsTooLarge,
  HttpRequestTimeout,
  HttpTooEarly,
  HttpTooManyRequests,
  HttpUnauthorized,
  HttpUnavailableForLegalReasons,
  HttpUnprocessableEntity,
  HttpUnsupportedMediaType,
  HttpUpgradeRequired,
  HttpUriTooLong,
} from "../client";
import {
  HttpBadGateway,
  HttpGatewayTimeout,
  HttpInsufficientStorage,
  HttpInternalServerError,
  HttpLoopDetected,
  HttpNetworkAuthenticationRequired,
  HttpNotExtended,
  HttpNotImplemented,
  HttpServiceUnavailable,
  HttpVariantAlsoNegotiates,
  HttpVersionNotSupported,
} from "../server";

const classes = [
  HttpBadRequest,
  HttpUnauthorized,
  HttpPaymentRequired,
  HttpForbidden,
  HttpNotFound,
  HttpMethodNotAllowed,
  HttpNotAcceptable,
  HttpProxyAuthenticationRequired,
  HttpRequestTimeout,
  HttpConflict,
  HttpGone,
  HttpLengthRequired,
  HttpPreconditionFailed,
  HttpPayloadTooLarge,
  HttpUriTooLong,
  HttpUnsupportedMediaType,
  HttpRangeNotSatisfiable,
  HttpExpectationFailed,
  HttpImATeapot,
  HttpMisdirectedRequest,
  HttpUnprocessableEntity,
  HttpLocked,
  HttpFailedDependency,
  HttpTooEarly,
  HttpUpgradeRequired,
  HttpPreconditionRequired,
  HttpTooManyRequests,
  HttpRequestHeaderFieldsTooLarge,
  HttpUnavailableForLegalReasons,
  HttpInternalServerError,
  HttpNotImplemented,
  HttpBadGateway,
  HttpServiceUnavailable,
  HttpGatewayTimeout,
  HttpVersionNotSupported,
  HttpVariantAlsoNegotiates,
  HttpInsufficientStorage, // webdav
  HttpLoopDetected, // webdav
  // Well-known (unassigned by ietf https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml)
  // 509: 'BandwidthLimitExceeded',
  HttpNotExtended,
  HttpNetworkAuthenticationRequired,
  // Well-known Cloudflare (unassigned by ietf https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml)
  /*
  520: 'Unknown Error',
  521: 'Web Server Is Down',
  522: 'Connection Timed Out',
  523: 'Origin Is Unreachable',
  524: 'A Timeout Occurred',
  525: 'SSL Handshake Failed',
  526: 'Invalid SSL Certificate',
   */
];

type StatusClass = (typeof classes)[number];

/**
 * Concrete exception classes keyed by their status code
 */
export type StatusMap = { [Cls in StatusClass as Cls["STATUS"]]: Cls };

let statusMap: StatusMap | undefined;

/**
 * Return the concrete exception classes keyed by their status code (built from
 * their STATUS on first call: no top-level code, so unused classes stay tree-shakeable)
 */
export const getStatusMap = (): StatusMap =>
  (statusMap ??= Object.fromEntries(
    classes.map((cls) => [cls.STATUS, cls])
  ) as StatusMap);
