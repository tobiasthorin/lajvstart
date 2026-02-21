import { describe, it, expect } from 'vitest';
import { getEventDateString, getFriendlyDate } from './dateUtils';

describe('getEventDateString', () => {
  it('should return only the end date when start and end dates are the same', () => {
    const date = new Date('2025-03-15');
    const result = getEventDateString(date, date);
    expect(result).toBe('15 mars');
  });

  it('should return day range without month when dates are in the same month', () => {
    const startDate = new Date('2025-03-10');
    const endDate = new Date('2025-03-15');
    const result = getEventDateString(startDate, endDate);
    expect(result).toBe('10 - 15 mars');
  });

  it('should include month for start date when crossing month boundary', () => {
    const startDate = new Date('2025-02-28');
    const endDate = new Date('2025-03-05');
    const result = getEventDateString(startDate, endDate);
    expect(result).toMatch(/^28 feb\. - 5 mars$/);
  });

  it('should respect monthFormat option for start date', () => {
    const startDate = new Date('2025-02-28');
    const endDate = new Date('2025-03-05');
    const result = getEventDateString(startDate, endDate, { monthFormat: 'long' });
    expect(result).toMatch(/^28 februari - 5 mars$/);
  });

  it('should respect monthFormat option for end date', () => {
    const startDate = new Date('2025-03-10');
    const endDate = new Date('2025-03-15');
    const result = getEventDateString(startDate, endDate, { monthFormat: 'long' });
    expect(result).toMatch(/^10 - 15 mars$/);
  });

  it('should handle year boundaries correctly', () => {
    const startDate = new Date('2024-12-29');
    const endDate = new Date('2025-01-05');
    const result = getEventDateString(startDate, endDate);
    expect(result).toMatch(/^29 dec\. - 5 jan\.$/);
  });

  it('should format dates in Swedish locale', () => {
    const startDate = new Date('2025-01-10');
    const endDate = new Date('2025-01-15');
    const result = getEventDateString(startDate, endDate);
    // Should contain Swedish month abbreviation
    expect(result).toContain('10');
    expect(result).toContain('15');
  });
});

describe('getFriendlyDate', () => {
  it('should format date in Swedish locale with day, month, and year', () => {
    const date = new Date('2025-03-15');
    const result = getFriendlyDate(date, { displayYear: true });
    expect(result).toMatch(/^15 mars 2025$/);
  });

  it('should format date without year when displayYear is false', () => {
    const date = new Date('2025-03-15');
    const result = getFriendlyDate(date, { displayYear: false });
    expect(result).toMatch(/^15 mars$/);
  });

  it('should format date without year by default', () => {
    const date = new Date('2025-03-15');
    const result = getFriendlyDate(date);
    expect(result).toMatch(/^15 mars$/);
  });

  it('should handle different months correctly', () => {
    const dates = [
      new Date('2025-01-15'),
      new Date('2025-06-15'),
      new Date('2025-12-15'),
    ];

    dates.forEach(date => {
      const result = getFriendlyDate(date, { displayYear: true });
      expect(result).toMatch(/^\d+ \w+ 2025$/);
    });
  });

  it('should format leap year date correctly', () => {
    const date = new Date('2024-02-29');
    const result = getFriendlyDate(date, { displayYear: true });
    expect(result).toMatch(/^29 februari 2024$/);
  });

  it('should use Swedish month names', () => {
    const date = new Date('2025-05-15');
    const result = getFriendlyDate(date);
    expect(result).toContain('maj');
  });
});
