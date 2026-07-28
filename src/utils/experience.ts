import type { Lang } from '../i18n/ui';

const WORDS: Record<Lang, string[]> = {
  fr: ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix',
       'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf', 'vingt'],
  en: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
       'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'],
};

/**
 * Années révolues entre deux dates, en UTC (même convention que formatMonthYear).
 * Arrondi à l'inférieur : l'anniversaire doit être passé pour compter l'année.
 * Un arrondi supérieur combiné à « Plus de » annoncerait une expérience non acquise.
 */
export function fullYearsBetween(start: Date, end: Date): number {
  let years = end.getUTCFullYear() - start.getUTCFullYear();
  const avantAnniversaire =
    end.getUTCMonth() < start.getUTCMonth() ||
    (end.getUTCMonth() === start.getUTCMonth() && end.getUTCDate() < start.getUTCDate());
  if (avantAnniversaire) years -= 1;
  return Math.max(0, years);
}

/** « cinq ans » / « five years », en chiffres au-delà de vingt. */
export function spellYears(count: number, lang: Lang): string {
  const mot = count <= 20 ? WORDS[lang][count] : String(count);
  if (lang === 'fr') return count === 1 ? `${mot} an` : `${mot} ans`;
  return count === 1 ? `${mot} year` : `${mot} years`;
}
