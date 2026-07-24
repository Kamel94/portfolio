import { describe, expect, it } from 'vitest';
import { getLangFromUrl, useTranslations } from './ui';

describe('useTranslations', () => {
  it('retourne la chaîne de la langue demandée', () => {
    expect(useTranslations('en')('nav.experiences')).toBe('Experience');
  });
  it('retourne la chaîne française pour la langue fr', () => {
    expect(useTranslations('fr')('nav.experiences')).toBe('Expériences');
  });
});

describe('getLangFromUrl', () => {
  it('détecte /en/', () => {
    expect(getLangFromUrl(new URL('https://x.dev/en/articles'))).toBe('en');
  });
  it('retombe sur fr à la racine', () => {
    expect(getLangFromUrl(new URL('https://x.dev/experiences'))).toBe('fr');
  });
});
