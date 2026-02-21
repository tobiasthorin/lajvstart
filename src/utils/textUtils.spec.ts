import { describe, it, expect } from 'vitest';
import { escapeCharacters, prettifyURL, getLowestEventAgeLimit } from './textUtils';
import type { LARPEvent } from '../types/types';

describe('escapeCharacters', () => {
  it('should escape double quotes', () => {
    const input = 'He said "hello"';
    const result = escapeCharacters(input);
    expect(result).toBe('He said &quot;hello&quot;');
  });

  it('should escape multiple double quotes', () => {
    const input = '"quote1" and "quote2"';
    const result = escapeCharacters(input);
    expect(result).toBe('&quot;quote1&quot; and &quot;quote2&quot;');
  });

  it('should not affect other characters', () => {
    const input = "It's a test!";
    const result = escapeCharacters(input);
    expect(result).toBe("It's a test!");
  });

  it('should handle empty strings', () => {
    const result = escapeCharacters('');
    expect(result).toBe('');
  });

  it('should handle strings without quotes', () => {
    const input = 'No quotes here';
    const result = escapeCharacters(input);
    expect(result).toBe('No quotes here');
  });

  it('should handle special HTML characters that are not quotes', () => {
    const input = 'Test < > & symbols';
    const result = escapeCharacters(input);
    // Should only escape quotes, not other HTML special chars
    expect(result).toBe('Test < > & symbols');
  });

  it('should handle only quote marks', () => {
    const input = '"""';
    const result = escapeCharacters(input);
    expect(result).toBe('&quot;&quot;&quot;');
  });
});

describe('prettifyURL', () => {
  it('should remove https protocol', () => {
    const url = 'https://example.com';
    const result = prettifyURL(url);
    expect(result).toBe('example.com');
  });

  it('should remove http protocol', () => {
    const url = 'http://example.com';
    const result = prettifyURL(url);
    expect(result).toBe('example.com');
  });

  it('should remove trailing slash', () => {
    const url = 'https://example.com/';
    const result = prettifyURL(url);
    expect(result).toBe('example.com');
  });

  it('should remove protocol and trailing slash', () => {
    const url = 'https://example.com/';
    const result = prettifyURL(url);
    expect(result).toBe('example.com');
  });

  it('should trim whitespace', () => {
    const url = '  https://example.com  ';
    const result = prettifyURL(url);
    expect(result).toBe('example.com');
  });

  it('should handle URLs with paths', () => {
    const url = 'https://example.com/path/to/page';
    const result = prettifyURL(url);
    expect(result).toBe('example.com/path/to/page');
  });

  it('should handle URLs with subdomains', () => {
    const url = 'https://subdomain.example.com';
    const result = prettifyURL(url);
    expect(result).toBe('subdomain.example.com');
  });

  it('should handle URLs with query parameters', () => {
    const url = 'https://example.com/page?param=value';
    const result = prettifyURL(url);
    expect(result).toBe('example.com/page?param=value');
  });

  it('should handle URLs with fragments', () => {
    const url = 'https://example.com/page#section';
    const result = prettifyURL(url);
    expect(result).toBe('example.com/page#section');
  });

  it('should handle plain domain without protocol', () => {
    const url = 'example.com';
    const result = prettifyURL(url);
    expect(result).toBe('example.com');
  });

  it('should handle www prefix', () => {
    const url = 'https://www.example.com';
    const result = prettifyURL(url);
    expect(result).toBe('www.example.com');
  });
});

describe('getLowestEventAgeLimit', () => {
  it('should return formatted age limit when minimum_age is set', () => {
    const event = { minimum_age: 18 } as LARPEvent;
    const result = getLowestEventAgeLimit(event);
    expect(result).toBe('18+');
  });

  it('should return "Alla åldrar" when minimum_age is null', () => {
    const event = { minimum_age: null } as LARPEvent;
    const result = getLowestEventAgeLimit(event);
    expect(result).toBe('Alla åldrar');
  });

  it('should return "Alla åldrar" when minimum_age is undefined', () => {
    const event = {} as LARPEvent;
    const result = getLowestEventAgeLimit(event);
    expect(result).toBe('Alla åldrar');
  });

  it('should return "Alla åldrar" when minimum_age is 0', () => {
    const event = { minimum_age: 0 } as LARPEvent;
    const result = getLowestEventAgeLimit(event);
    // 0 is falsy, so returns default text
    expect(result).toBe('Alla åldrar');
  });

  it('should handle various ages', () => {
    const testCases = [3, 12, 16, 18, 21, 50];
    testCases.forEach((age) => {
      const event = { minimum_age: age } as LARPEvent;
      const result = getLowestEventAgeLimit(event);
      expect(result).toBe(`${age}+`);
    });
  });

  it('should use Swedish text for no age restriction', () => {
    const event = { minimum_age: null } as LARPEvent;
    const result = getLowestEventAgeLimit(event);
    expect(result).toBe('Alla åldrar');
    expect(result).not.toBe('All ages');
  });
});
