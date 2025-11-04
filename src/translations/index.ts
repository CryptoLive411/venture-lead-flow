import { en } from './en';
import { es } from './es';
import { pt } from './pt';
import { fr } from './fr';
import { ar } from './ar';

export type Language = 'en' | 'es' | 'pt' | 'fr' | 'ar';

export const translations = {
  en,
  es,
  pt,
  fr,
  ar,
};

export const languages = [
  { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
  { code: 'es' as Language, name: 'Español', flag: '🇪🇸' },
  { code: 'pt' as Language, name: 'Português', flag: '🇵🇹' },
  { code: 'fr' as Language, name: 'Français', flag: '🇫🇷' },
  { code: 'ar' as Language, name: 'العربية', flag: '🇸🇦' },
];
