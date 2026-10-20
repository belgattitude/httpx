import { describe, expectTypeOf, it } from "vitest";

import type { HttpNotFound } from "../../client/HttpNotFound";
import type { HttpUnprocessableEntity } from "../../client/HttpUnprocessableEntity";
import type { StatusMap } from "../../status";
import type { HttpErrorStatusCode } from "../HttpErrorStatusCode";

describe("HttpErrorStatusCode", () => {
  it("should be the union of the assigned error status codes", () => {
    expectTypeOf<HttpErrorStatusCode>().toEqualTypeOf<
      | 400
      | 401
      | 402
      | 403
      | 404
      | 405
      | 406
      | 407
      | 408
      | 409
      | 410
      | 411
      | 412
      | 413
      | 414
      | 415
      | 416
      | 417
      | 418
      | 421
      | 422
      | 423
      | 424
      | 425
      | 426
      | 428
      | 429
      | 431
      | 451
      | 500
      | 501
      | 502
      | 503
      | 504
      | 505
      | 506
      | 507
      | 508
      | 510
      | 511
    >();
  });

  it("should map each status code to its exception class", () => {
    expectTypeOf<StatusMap[404]>().toEqualTypeOf<typeof HttpNotFound>();
    expectTypeOf<StatusMap[422]>().toEqualTypeOf<
      typeof HttpUnprocessableEntity
    >();
  });
});
