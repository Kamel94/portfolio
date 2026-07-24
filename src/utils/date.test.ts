import { describe, expect, it } from 'vitest';
import { formatMonthYear } from './date';

describe('formatMonthYear', () => {
  const d = new Date('2024-06-01');
  it('formate en français', () => {
    expect(formatMonthYear(d, 'fr')).toBe('juin 2024');
  });
  it('formate en anglais', () => {
    expect(formatMonthYear(d, 'en')).toBe('June 2024');
  });
});
