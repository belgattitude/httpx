import type { NumberSafeInt } from "./number.types";

export const isNumberSafeInt = (v: unknown): v is NumberSafeInt =>
  typeof v === "number" && Number.isSafeInteger(v);
