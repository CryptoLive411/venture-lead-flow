import { en } from './en';
import { es } from './es';
import { pt } from './pt';
import { fr } from './fr';
import { ar } from './ar';
import { de } from './de';
import { it } from './it';
import { zh } from './zh';
import { ru } from './ru';
import { nl } from './nl';

export type Language = 'en' | 'es' | 'pt' | 'fr' | 'ar' | 'de' | 'it' | 'zh' | 'ru' | 'nl';

export const translations = {
  en,
  es,
  pt,
  fr,
  ar,
  de,
  it,
  zh,
  ru,
  nl,
};

export const languages = [
  { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
  { code: 'es' as Language, name: 'Español', flag: '🇪🇸' },
  { code: 'pt' as Language, name: 'Português', flag: '🇵🇹' },
  { code: 'fr' as Language, name: 'Français', flag: '🇫🇷' },
  { code: 'ar' as Language, name: 'العربية', flag: '🇸🇦' },
  { code: 'de' as Language, name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it' as Language, name: 'Italiano', flag: '🇮🇹' },
  { code: 'zh' as Language, name: '中文', flag: '🇨🇳' },
  { code: 'ru' as Language, name: 'Русский', flag: '🇷🇺' },
  { code: 'nl' as Language, name: 'Nederlands', flag: '🇳🇱' },
];
