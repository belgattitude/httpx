import type { ZodTypeAny } from 'zod';
import { z } from 'zod';

export const zodStringToInt = (schema: ZodTypeAny) =>
  z.preprocess((v): number | undefined => {
    if (typeof v === 'string') {
      return parseInt(v, 10);
    }
    if (typeof v === 'number') return v;
    return undefined;
  }, schema);
