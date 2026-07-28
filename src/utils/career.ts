import { getCollection } from 'astro:content';
import { useTranslations, type Lang } from '../i18n/ui';
import { fullYearsBetween, spellYears } from './experience';

/** Début de carrière = la plus ancienne expérience du contenu, pas une constante à maintenir. */
async function careerStart(): Promise<Date> {
  const all = await getCollection('experiences');
  return all.reduce(
    (min, e) => (e.data.startDate < min ? e.data.startDate : min),
    all[0].data.startDate
  );
}

/**
 * Chapô de la page Expériences, avec la durée calculée au build.
 * Un déploiement mensuel programmé garde la valeur à jour sans intervention.
 */
export async function experienceIntro(lang: Lang): Promise<string> {
  const t = useTranslations(lang);
  const annees = fullYearsBetween(await careerStart(), new Date());
  return t('experiences.intro').replace('{years}', spellYears(annees, lang));
}
