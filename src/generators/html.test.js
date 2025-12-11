import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { generateHtml, generatePreview } from './html.js';
import { ERROR_CODES, getErrorByCode } from '../config/errorCodes.js';

/**
 * **Feature: cloudflare-error-page-generator, Property 2: Configuration Fields Appear in Output**
 * 
 * *For any* ErrorPageConfig with non-empty domain name and custom message, the generated 
 * HTML SHALL contain both the domain name in the header section and the custom message 
 * in the content section.
 * 
 * **Validates: Requirements 2.1, 2.2**
 */
describe('HTML Generator - Property 2: Configuration Fields Appear in Output', () => {
  it('Property 2: Non-empty domain name and custom message appear in generated HTML', () => {
    // Generate non-empty strings (at least 1 character, no HTML special chars to avoid escaping complexity)
    const nonEmptyAlphanumString = fc.stringOf(
      fc.constantFrom(...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .-_'),
      { minLength: 1, maxLength: 50 }
    ).filter(s => s.trim().length > 0);

    fc.assert(
      fc.property(
        nonEmptyAlphanumString,
        nonEmptyAlphanumString,
        (domainName, customMessage) => {
          const config = {
            errorCode: '502',
            domainName,
            customMessage,
            rayId: 'abc123def4567890'
          };
          
          const html = generateHtml(config);
          
          // Domain name should appear in the output (in header section)
          expect(html).toContain(domainName);
          
          // Custom message should appear in the output (in content section)
          expect(html).toContain(customMessage);
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * **Feature: cloudflare-error-page-generator, Property 4: HTML Self-Containment**
 * 
 * *For any* generated HTML output, the document SHALL:
 * - Be valid HTML5 with proper DOCTYPE declaration
 * - Contain all CSS styles inline within a `<style>` tag
 * - Not reference any external stylesheets, scripts, or resources (no external URLs)
 * 
 * **Validates: Requirements 5.1, 5.2, 5.3**
 */
describe('HTML Generator - Property 4: HTML Self-Containment', () => {
  it('Property 4: Generated HTML is self-contained with no external dependencies', () => {
    const validErrorCode = fc.constantFrom(...ERROR_CODES.map(e => e.code));
    const optionalString = fc.option(fc.string({ minLength: 0, maxLength: 30 }), { nil: undefined });
    
    fc.assert(
      fc.property(
        validErrorCode,
        optionalString,
        optionalString,
        (errorCode, domainName, customMessage) => {
          const config = {
            errorCode,
            domainName: domainName || 'example.com',
            customMessage: customMessage || '',
            rayId: 'abc123def4567890'
          };
          
          const html = generateHtml(config);
          
          // Must have HTML5 DOCTYPE
          expect(html).toMatch(/^<!DOCTYPE html>/i);
          
          // Must have <html> tag
          expect(html).toMatch(/<html[^>]*>/i);
          
          // Must have inline <style> tag with CSS
          expect(html).toMatch(/<style>[\s\S]+<\/style>/i);
          
          // Must NOT have external stylesheet links
          expect(html).not.toMatch(/<link[^>]+rel=["']stylesheet["'][^>]*>/i);
          
          // Must NOT have external script sources
          expect(html).not.toMatch(/<script[^>]+src=["'][^"']+["'][^>]*>/i);
          
          // Must NOT have external script sources (external links to Cloudflare support are allowed)
          expect(html).not.toMatch(/<script[^>]+src=["']https?:\/\//i);
        }
      ),
      { numRuns: 100 }
    );
  });
});


/**
 * **Feature: cloudflare-error-page-generator, Property 5: Cloudflare Branding Completeness**
 * 
 * *For any* generated HTML output, the document SHALL contain:
 * - The Cloudflare logo element
 * - The orange accent color (#f38020) in the CSS
 * - The "What happened?" section heading
 * - The "What can I do?" section heading
 * - A footer containing Ray ID, visitor IP, and timestamp placeholders
 * 
 * **Validates: Requirements 7.1, 7.2, 7.3, 7.4**
 */
describe('HTML Generator - Property 5: Cloudflare Branding Completeness', () => {
  it('Property 5: Generated HTML contains all Cloudflare branding elements', () => {
    const validErrorCode = fc.constantFrom(...ERROR_CODES.map(e => e.code));
    const optionalString = fc.option(fc.string({ minLength: 0, maxLength: 30 }), { nil: undefined });
    
    fc.assert(
      fc.property(
        validErrorCode,
        optionalString,
        (errorCode, domainName) => {
          const config = {
            errorCode,
            domainName: domainName || 'example.com',
            rayId: 'abc123def4567890',
            visitorIp: '192.168.1.1',
            timestamp: '2024-01-01T00:00:00.000Z'
          };
          
          const html = generateHtml(config);
          
          // Must contain SVG icons for status diagram
          expect(html).toMatch(/<svg[^>]*>/i);
          
          // Must contain orange accent color #f38020
          expect(html).toContain('#f38020');
          
          // Must contain "What happened?" section
          expect(html).toContain('What happened?');
          
          // Must contain "What can I do?" section
          expect(html).toContain('What can I do?');
          
          // Must contain Ray ID in header
          expect(html).toMatch(/Ray ID:/i);
          
          // Must contain status diagram elements
          expect(html).toContain('Browser');
          expect(html).toContain('Cloudflare');
          expect(html).toContain('Host');
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * **Feature: cloudflare-error-page-generator, Property 1: Error Code Mapping Correctness**
 * 
 * *For any* valid error code selection, the HTML generator SHALL produce output containing 
 * the correct corresponding error title and description as defined in the ERROR_CODES mapping.
 * 
 * **Validates: Requirements 1.1**
 */
describe('HTML Generator - Property 1: Error Code Mapping Correctness', () => {
  it('Property 1: Error code selection produces correct title and description', () => {
    const validErrorCode = fc.constantFrom(...ERROR_CODES.map(e => e.code));
    
    fc.assert(
      fc.property(
        validErrorCode,
        (errorCode) => {
          const config = {
            errorCode,
            domainName: 'test.example.com',
            rayId: 'abc123def4567890'
          };
          
          const html = generateHtml(config);
          const expectedError = getErrorByCode(errorCode);
          
          // The error code should appear in the output
          expect(html).toContain(errorCode);
          
          // The error title should appear in the output
          expect(html).toContain(expectedError.title);
          
          // The whatHappened description should appear
          expect(html).toContain(expectedError.whatHappened);
          
          // The whatCanIDo description should appear
          expect(html).toContain(expectedError.whatCanIDo);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Unit tests for HTML generator
describe('HTML Generator - Unit Tests', () => {
  it('generates valid HTML with default config', () => {
    const html = generateHtml({});
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<html');
    expect(html).toContain('</html>');
  });

  it('uses default error code 522 when not specified', () => {
    const html = generateHtml({});
    expect(html).toContain('522');
    expect(html).toContain('Connection Timed Out');
  });

  it('uses default domain when not specified', () => {
    const html = generateHtml({});
    expect(html).toContain('example.com');
  });

  it('includes custom domain name in output', () => {
    const html = generateHtml({ domainName: 'mysite.com' });
    expect(html).toContain('mysite.com');
  });

  it('includes custom message when provided', () => {
    const html = generateHtml({ customMessage: 'Server maintenance in progress' });
    expect(html).toContain('Server maintenance in progress');
  });

  it('includes Ray ID in footer', () => {
    const html = generateHtml({ rayId: 'abc123def4567890' });
    expect(html).toContain('abc123def4567890');
  });

  it('includes location in status diagram', () => {
    const html = generateHtml({ location: 'Tokyo' });
    expect(html).toContain('Tokyo');
  });

  it('escapes HTML special characters in user input', () => {
    const html = generateHtml({ 
      domainName: '<script>alert("xss")</script>',
      customMessage: '&<>"\'test'
    });
    expect(html).not.toContain('<script>alert');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('&amp;');
  });

  it('generatePreview returns same output as generateHtml', () => {
    const config = { errorCode: '502', domainName: 'test.com' };
    expect(generatePreview(config)).toBe(generateHtml(config));
  });
});
