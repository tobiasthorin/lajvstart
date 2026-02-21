import { describe, it, expect } from 'vitest';
import { extractEventFormData, groupEvents } from './eventUtils';
import type { LARPEvent } from '../types/types';
import { createMock } from 'vitest-create-mock';


describe('extractEventFormData', () => {
  it('should extract basic event form data', () => {
    const formData = new FormData();
    formData.set('name', 'Test Event');
    formData.set('startDate', '2025-03-10');
    formData.set('endDate', '2025-03-15');
    formData.set('location', 'Stockholm');
    formData.set('descriptionShort', 'Short description');
    formData.set('description', 'Long description');
    formData.set('tags', 'Fantasy,Nordic LARP');

    const result = extractEventFormData(formData);

    expect(result.name).toBe('Test Event');
    expect(result.startDate).toBe('2025-03-10');
    expect(result.endDate).toBe('2025-03-15');
    expect(result.location).toBe('Stockholm');
    expect(result.descriptionShort).toBe('Short description');
    expect(result.description).toBe('Long description');
    expect(result.tags).toBe('Fantasy,Nordic LARP');
  });

  it('should extract optional fields', () => {
    const formData = new FormData();
    formData.set('name', 'Test Event');
    formData.set('startDate', '2025-03-10');
    formData.set('endDate', '2025-03-15');
    formData.set('location', 'Stockholm');
    formData.set('descriptionShort', 'Short description');
    formData.set('description', 'Long description');
    formData.set('tags', 'Fantasy');
    formData.set('beginnerFriendly', 'true');
    formData.set('ageRestriction', '18');
    formData.set('maximumParticipants', '50');
    formData.set('latitude', '59.3293');
    formData.set('longitude', '18.0686');
    formData.set('useLajvstartSystem', 'true');
    formData.set('finalSignupDate', '2025-03-05');
    formData.set('externalWebsiteURL', 'https://example.com');
    formData.set('isFree', 'false');

    const result = extractEventFormData(formData);

    expect(result.beginnerFriendly).toBe('true');
    expect(result.ageRestriction).toBe('18');
    expect(result.maximumParticipants).toBe('50');
    expect(result.latitude).toBe('59.3293');
    expect(result.longitude).toBe('18.0686');
    expect(result.useLajvstartSystem).toBe('true');
    expect(result.finalSignupDate).toBe('2025-03-05');
    expect(result.externalWebsiteURL).toBe('https://example.com');
    expect(result.isFree).toBe('false');
  });

  it('should extract price levels', () => {
    const formData = new FormData();
    formData.set('name', 'Test Event');
    formData.set('startDate', '2025-03-10');
    formData.set('endDate', '2025-03-15');
    formData.set('location', 'Stockholm');
    formData.set('descriptionShort', 'Short description');
    formData.set('description', 'Long description');
    formData.set('tags', 'Fantasy');
    formData.set('priceValue-0', '200');
    formData.set('priceDescription-0', 'Early bird');
    formData.set('priceValue-1', '300');
    formData.set('priceDescription-1', 'Regular');

    const result = extractEventFormData(formData);

    expect(result.prices).toHaveLength(2);
    expect(result.prices[0]).toEqual({ price: 200, description: 'Early bird' });
    expect(result.prices[1]).toEqual({ price: 300, description: 'Regular' });
  });

  it('should handle empty prices', () => {
    const formData = new FormData();
    formData.set('name', 'Test Event');
    formData.set('startDate', '2025-03-10');
    formData.set('endDate', '2025-03-15');
    formData.set('location', 'Stockholm');
    formData.set('descriptionShort', 'Short description');
    formData.set('description', 'Long description');
    formData.set('tags', 'Fantasy');

    const result = extractEventFormData(formData);

    expect(result.prices).toEqual([]);
  });

  it('should throw error when required fields are missing', () => {
    const formData = new FormData();
    formData.set('name', 'Test Event');

    expect(() => extractEventFormData(formData)).toThrow();
  });

  it('should throw error when name is missing', () => {
    const formData = new FormData();
    formData.set('startDate', '2025-03-10');
    formData.set('endDate', '2025-03-15');
    formData.set('location', 'Stockholm');
    formData.set('descriptionShort', 'Short description');
    formData.set('description', 'Long description');
    formData.set('tags', 'Fantasy');

    expect(() => extractEventFormData(formData)).toThrow('Missing form data name');
  });
});

describe('groupEvents', () => {
  it('should group events by year and month', () => {
    const events = [
      createMock<LARPEvent>({
        id: '1',
        name: 'Event 1',
        date_start: '2025-03-10',
        date_end: '2025-03-15',
        location_name:'Stockholm',
      }),
      createMock<LARPEvent>({
        id: '2',
        name: 'Event 2',
        date_start: '2025-03-20',
        date_end: '2025-03-22',
        location_name:'Gothenburg',
      }),
      createMock<LARPEvent>({
        id: '3',
        name: 'Event 3',
        date_start: '2025-04-10',
        date_end: '2025-04-12',
        location_name:'Malmö',
      }),
    ];

    const groups = groupEvents(events as LARPEvent[]);

    expect(groups[2025]).toBeDefined();
    expect(groups[2025]['mars']).toHaveLength(2);
    expect(groups[2025]['april']).toHaveLength(1);
  });

  it('should handle events from multiple years', () => {
    const events: LARPEvent[] = [
      {
        id: '1',
        name: 'Event 2024',
        date_start: '2024-12-10',
        date_end: '2024-12-15',
        location_name:'Stockholm',
      } as LARPEvent,
      {
        id: '2',
        name: 'Event 2025',
        date_start: '2025-01-10',
        date_end: '2025-01-15',
        location_name:'Gothenburg',
      } as LARPEvent,
    ];

    const groups = groupEvents(events);

    expect(groups[2024]).toBeDefined();
    expect(groups[2025]).toBeDefined();
    expect(groups[2024]['december']).toHaveLength(1);
    expect(groups[2025]['januari']).toHaveLength(1);
  });

  it('should return empty object for empty events array', () => {
    const groups = groupEvents([]);
    expect(groups).toEqual({});
  });

  it('should group multiple events in same month', () => {
    const events: LARPEvent[] = [
      {
        id: '1',
        name: 'Event 1',
        date_start: '2025-03-05',
        date_end: '2025-03-07',
        location_name:'City A',
      } as LARPEvent,
      {
        id: '2',
        name: 'Event 2',
        date_start: '2025-03-15',
        date_end: '2025-03-17',
        location_name:'City B',
      } as LARPEvent,
      {
        id: '3',
        name: 'Event 3',
        date_start: '2025-03-25',
        date_end: '2025-03-27',
        location_name:'City C',
      } as LARPEvent,
    ];

    const groups = groupEvents(events);

    expect(groups[2025]['mars']).toHaveLength(3);
    expect(groups[2025]['mars']).toEqual(events);
  });
});
