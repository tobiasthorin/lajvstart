import { describe, it, expect, vi } from 'vitest';
import { InternalError, BadRequestError, handleServiceError } from './errorUtils';

describe('InternalError', () => {
  it('should create an InternalError instance', () => {
    const error = new InternalError('Test error');
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(InternalError);
    expect(error.message).toBe('Test error');
  });

  it('should have errorCode of 500', () => {
    const error = new InternalError('Test error');
    expect(error.errorCode).toBe(500);
  });
});

describe('BadRequestError', () => {
  it('should create a BadRequestError instance', () => {
    const error = new BadRequestError('Invalid request');
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(BadRequestError);
    expect(error.message).toBe('Invalid request');
  });

  it('should have errorCode of 400', () => {
    const error = new BadRequestError('Invalid request');
    expect(error.errorCode).toBe(400);
  });
});

describe('handleServiceError', () => {
  it('should handle Error instances with message', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const error = new Error('Test service error');
    const response = handleServiceError(error);

    expect(response.status).toBe(500);
    expect(response.headers.get('Content-Type')).toBe('text/html');
    expect(response.status).toBe(500);
    
    vi.restoreAllMocks();
  });

  it('should handle unknown error types', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const response = handleServiceError('unknown error');

    expect(response.status).toBe(500);
    expect(response.headers.get('Content-Type')).toBe('text/html');
    
    vi.restoreAllMocks();
  });

  it('should handle null/undefined errors', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const response1 = handleServiceError(null);
    const response2 = handleServiceError(undefined);

    expect(response1.status).toBe(500);
    expect(response2.status).toBe(500);
    
    vi.restoreAllMocks();
  });

  it('should log errors to console', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const error = new Error('Test error');
    handleServiceError(error);

    expect(consoleSpy).toHaveBeenCalledWith(error);
    
    consoleSpy.mockRestore();
  });
});
