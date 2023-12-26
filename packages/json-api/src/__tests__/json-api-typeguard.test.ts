import {
  isJsonApiErrorResponse,
  isJsonApiResponse,
  isJsonApiSuccessResponse,
} from '../json-api.typeguard';

describe('json-api typeguards', () => {
  describe('isJsonApiResponse', () => {
    it('should accept valid json responses', () => {
      const payload = {
        data: 'cool',
        meta: {},
        success: true,
      };
      expect(isJsonApiResponse(payload)).toBe(true);
    });

    it('should reject invalid json responses', () => {
      const payload = {
        meta: {},
        success: 'biloute',
      };
      expect(isJsonApiResponse(payload)).toBe(false);
    });
  });

  describe('isJsonApiSuccessResponse', () => {
    it('should say yes when payload is success', () => {
      const payload = {
        data: 'cool',
        meta: {},
        success: true,
      };
      expect(isJsonApiSuccessResponse(payload)).toBe(true);
    });

    it('should say no when payload is success', () => {
      const payload = {
        data: 'cool',
        meta: {},
        success: false,
      };
      expect(isJsonApiSuccessResponse(payload)).toBe(false);
    });
  });

  describe('isJsonApiErrorResponse', () => {
    it('should say false when payload is success', () => {
      const payload = {
        data: 'cool',
        meta: {},
        success: true,
      };
      expect(isJsonApiErrorResponse(payload)).toBe(false);
    });

    it('should say yes when payload is error', () => {
      const payload = {
        errors: [],
        success: false,
      };
      expect(isJsonApiErrorResponse(payload)).toBe(true);
    });
  });
});
