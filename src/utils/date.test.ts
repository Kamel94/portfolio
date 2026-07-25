import { describe, expect, it } from 'vitest';
import { formatMonthYear, formatFullDate } from './date';

describe('formatMonthYear', () => {
  const d = new Date('2024-06-01');
  it('formate en français', () => {
    expect(formatMonthYear(d, 'fr')).toBe('juin 2024');
  });
  it('formate en anglais', () => {
    expect(formatMonthYear(d, 'en')).toBe('June 2024');
  });
});

describe('formatFullDate', () => {
  const d = new Date('2026-07-19');
  it('formate en français', () => {
    expect(formatFullDate(d, 'fr')).toBe('19 juillet 2026');
  });
  it('formate en anglais', () => {
    expect(formatFullDate(d, 'en')).toBe('July 19, 2026');
  });
});
