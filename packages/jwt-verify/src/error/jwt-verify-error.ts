import type { JOSEError } from "jose/errors";

import { createHasInstance, type TypedError } from "../base/typed-error";

export class JwtVerifyError extends Error implements TypedError {
  readonly type = "jwt-verify";
  readonly code: string;
  constructor(msg: string, options: { cause: Error | JOSEError }) {
    super(msg, { cause: options.cause });
    Object.setPrototypeOf(this, JwtVerifyError.prototype);
    const causeCode = (options.cause as JOSEError)?.code;
    this.code =
      causeCode !== undefined && causeCode !== ""
        ? causeCode
        : "JwtVerifyError";
  }
  static override [Symbol.hasInstance] = createHasInstance("jwt-verify", Error);
}
