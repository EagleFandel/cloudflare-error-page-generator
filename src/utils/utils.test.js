import { describe, it, expect } from 'vitest';
import { generateFilename } from './download.js';

/**
 * Unit tests for export utilities
 * Requirements: 5.4, 6.1
 * 
 * Note: The clipboard and download functions rely on browser APIs (navigator.clipboard, 
 * document, Blob, URL.createObjectURL) which are not available in Node.js test environment.
 * These functions are tested through their core logic and the filename generator.
 * Full integration testing would require a browser environment.
 */

describe('Filename Generator - Unit Tests', () => {
  it('generates filename with error code 502', () => {
    expect(generateFilename('502')).toBe('cloudflare-error-502.html');
  });

  it('generates filename with error code 500', () => {
    expect(generateFilename('500')).toBe('cloudflare-error-500.html');
  });

  it('generates filename with error code 520', () => {
    expect(generateFilename('520')).toBe('cloudflare-error-520.html');
  });

  it('generates filename with various error codes', () => {
    expect(generateFilename('503')).toBe('cloudflare-error-503.html');
    expect(generateFilename('504')).toBe('cloudflare-error-504.html');
    expect(generateFilename('521')).toBe('cloudflare-error-521.html');
    expect(generateFilename('522')).toBe('cloudflare-error-522.html');
    expect(generateFilename('523')).toBe('cloudflare-error-523.html');
    expect(generateFilename('524')).toBe('cloudflare-error-524.html');
    expect(generateFilename('525')).toBe('cloudflare-error-525.html');
    expect(generateFilename('526')).toBe('cloudflare-error-526.html');
    expect(generateFilename('527')).toBe('cloudflare-error-527.html');
  });

  it('generates filename with correct format pattern', () => {
    const filename = generateFilename('999');
    expect(filename).toMatch(/^cloudflare-error-\d+\.html$/);
  });

  it('generates filename ending with .html extension', () => {
    const filename = generateFilename('502');
    expect(filename.endsWith('.html')).toBe(true);
  });

  it('generates filename containing the error code', () => {
    const errorCode = '504';
    const filename = generateFilename(errorCode);
    expect(filename).toContain(errorCode);
  });
});
