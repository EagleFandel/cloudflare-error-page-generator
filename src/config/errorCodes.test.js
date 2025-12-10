import { describe, it, expect } from 'vitest';
import { ERROR_CODES, getErrorByCode, getAvailableCodes } from './errorCodes.js';

describe('Error Codes Data Module', () => {
  const REQUIRED_CODES = ['500', '502', '503', '504', '520', '521', '522', '523', '524', '525', '526', '527'];
  const REQUIRED_FIELDS = ['code', 'title', 'description', 'whatHappened', 'whatCanIDo'];

  describe('ERROR_CODES array', () => {
    it('should contain all required Cloudflare error codes', () => {
      const availableCodes = ERROR_CODES.map(e => e.code);
      
      REQUIRED_CODES.forEach(code => {
        expect(availableCodes).toContain(code);
      });
    });

    it('should have all required fields for each error code', () => {
      ERROR_CODES.forEach(errorCode => {
        REQUIRED_FIELDS.forEach(field => {
          expect(errorCode).toHaveProperty(field);
          expect(errorCode[field]).toBeTruthy();
        });
      });
    });

    it('should have unique error codes', () => {
      const codes = ERROR_CODES.map(e => e.code);
      const uniqueCodes = [...new Set(codes)];
      expect(codes.length).toBe(uniqueCodes.length);
    });
  });

  describe('getErrorByCode', () => {
    it('should return correct error definition for valid code', () => {
      const error = getErrorByCode('502');
      expect(error).toBeDefined();
      expect(error.code).toBe('502');
      expect(error.title).toBe('Bad Gateway');
    });

    it('should return undefined for invalid code', () => {
      const error = getErrorByCode('999');
      expect(error).toBeUndefined();
    });
  });

  describe('getAvailableCodes', () => {
    it('should return array of all error code strings', () => {
      const codes = getAvailableCodes();
      expect(Array.isArray(codes)).toBe(true);
      expect(codes.length).toBe(ERROR_CODES.length);
      expect(codes).toContain('500');
      expect(codes).toContain('527');
    });
  });
});
