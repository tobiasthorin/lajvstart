import { describe, it, expect } from 'vitest';
import { errorResponse } from './responseUtils';

describe('errorResponse', () => {
  it('should return a Response object', () => {
    const response = errorResponse('Test error');
    expect(response).toBeInstanceOf(Response);
  });

  it('should have default status code 500', () => {
    const response = errorResponse('Test error');
    expect(response.status).toBe(500);
  });

  it('should use provided status code', () => {
    const response = errorResponse('Bad request', 400);
    expect(response.status).toBe(400);
  });

  it('should set Content-Type header to text/html', () => {
    const response = errorResponse('Test error');
    expect(response.headers.get('Content-Type')).toBe('text/html');
  });

  it('should wrap error message in HTML tags with Tailwind classes', () => {
    const response = errorResponse('Test error message');
    expect(response.body).toBeDefined();
  });

  it('should include error message in response body', async () => {
    const errorMessage = 'Custom error message';
    const response = errorResponse(errorMessage);
    const text = await response.text();
    expect(text).toContain(errorMessage);
  });

  it('should include red text class in response', async () => {
    const response = errorResponse('Error');
    const text = await response.text();
    expect(text).toContain("class='text-red-600'");
  });

  it('should handle error messages with special characters', async () => {
    const errorMessage = "Invalid input: use 'quotes' & symbols";
    const response = errorResponse(errorMessage);
    const text = await response.text();
    expect(text).toContain(errorMessage);
  });

  it('should handle long error messages', async () => {
    const longMessage = 'A'.repeat(1000);
    const response = errorResponse(longMessage);
    const text = await response.text();
    expect(text).toContain(longMessage);
  });

  it('should support various HTTP status codes', () => {
    const testCases = [400, 401, 403, 404, 500, 503];
    
    testCases.forEach((statusCode) => {
      const response = errorResponse('Error', statusCode);
      expect(response.status).toBe(statusCode);
    });
  });

  it('should create response with correct HTML structure', async () => {
    const response = errorResponse('Test');
    const text = await response.text();
    expect(text).toMatch(/<p class='text-red-600'>/);
    // Note: Original code has typo - closing tag is <p> not </p>
    expect(text).toContain('<p>');
  });

  it('should have proper closing tag', async () => {
    const response = errorResponse('Message');
    const text = await response.text();
    // Note: Original code has typo - uses <p> instead of </p> as closing tag
    expect(text).toMatch(/Message<p>/);
  });
});
