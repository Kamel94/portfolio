import { describe, expect, it } from 'vitest';
import { obfuscateEmail } from './email';

describe('obfuscateEmail', () => {
  it('encode chaque caractère en entité HTML décimale', () => {
    expect(obfuscateEmail('a@b.c')).toBe('&#97;&#64;&#98;&#46;&#99;');
  });
});
