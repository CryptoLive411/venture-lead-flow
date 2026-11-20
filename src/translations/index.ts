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
import { account } from './account';

export type Language = 'en' | 'es' | 'pt' | 'fr' | 'ar' | 'de' | 'it' | 'zh' | 'ru' | 'nl';

// `account`: the player account step, highlight upload and success screen (account.ts).
export const translations = {
  en: { ...en, account: account.en },
  es: { ...es, account: account.es },
  pt: { ...pt, account: account.pt },
  fr: { ...fr, account: account.fr },
  ar: { ...ar, account: account.ar },
  de: { ...de, account: account.de },
  it: { ...it, account: account.it },
  zh: { ...zh, account: account.zh },
  ru: { ...ru, account: account.ru },
  nl: { ...nl, account: account.nl },
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
