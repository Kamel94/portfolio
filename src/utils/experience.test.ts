import { describe, expect, it } from 'vitest';
import { fullYearsBetween, spellYears } from './experience';

describe('fullYearsBetween', () => {
  const debut = new Date('2020-10-01');

  it('ne compte pas une année dont l’anniversaire n’est pas atteint', () => {
    expect(fullYearsBetween(debut, new Date('2026-09-30'))).toBe(5);
  });
  it('compte l’année le jour de l’anniversaire', () => {
    expect(fullYearsBetween(debut, new Date('2026-10-01'))).toBe(6);
  });
  it('ne renvoie jamais de valeur négative', () => {
    expect(fullYearsBetween(debut, new Date('2019-01-01'))).toBe(0);
  });
});

describe('spellYears', () => {
  it('écrit le nombre en toutes lettres', () => {
    expect(spellYears(5, 'fr')).toBe('cinq ans');
    expect(spellYears(6, 'en')).toBe('six years');
  });
  it('accorde le singulier', () => {
    expect(spellYears(1, 'fr')).toBe('un an');
    expect(spellYears(1, 'en')).toBe('one year');
  });
  it('repasse aux chiffres au-delà de vingt', () => {
    expect(spellYears(21, 'fr')).toBe('21 ans');
  });
});
