/* eslint-disable */
import { IntlProvider, addLocaleData } from 'react-intl';
import locale_en from 'react-intl/locale-data/en';
import locale_ko from 'react-intl/locale-data/ko';
import locale_de from 'react-intl/locale-data/de';
import locale_es from 'react-intl/locale-data/es';
import locale_nl from 'react-intl/locale-data/nl';
import locale_fr from 'react-intl/locale-data/fr';
import locale_hi from 'react-intl/locale-data/hi';
import locale_it from 'react-intl/locale-data/it';
import locale_hu from 'react-intl/locale-data/hu';
import locale_ro from 'react-intl/locale-data/ro';
import locale_sv from 'react-intl/locale-data/sv';
import locale_pl from 'react-intl/locale-data/pl';
import locale_in from 'react-intl/locale-data/in';
import locale_ja from 'react-intl/locale-data/ja';
import locale_pt from 'react-intl/locale-data/pt';
import locale_ru from 'react-intl/locale-data/ru';
import locale_tr from 'react-intl/locale-data/tr';
import locale_vi from 'react-intl/locale-data/vi';
import locale_zh from 'react-intl/locale-data/zh';
import locale_th from 'react-intl/locale-data/th';
import locale_ar from 'react-intl/locale-data/ar';

import messages_en from './en.json';
import messages_ko from './ko.json';
import messages_de from './de.json';
import messages_es from './es.json';
import messages_nl from './nl.json';
import messages_fr from './fr.json';
import messages_hi from './hi.json';
import messages_it from './it.json';
import messages_hu from './hu.json';
import messages_ro from './ro.json';
import messages_sv from './sv.json';
import messages_pl from './pl.json';
import messages_in from './in.json';
import messages_ja from './ja.json';
import messages_pt from './pt.json';
import messages_ru from './ru.json';
import messages_tr from './tr.json';
import messages_vi from './vi.json';
import messages_zh from './zh.json';
import messages_th from './th.json';
import messages_ar from './ar.json';

// Multi Languages
addLocaleData([
  ...locale_en,
  ...locale_ko,
  ...locale_de,
  ...locale_es,
  ...locale_nl,
  ...locale_fr,
  ...locale_hi,
  ...locale_it,
  ...locale_hu,
  ...locale_ro,
  ...locale_sv,
  ...locale_pl,
  ...locale_in,
  ...locale_ja,
  ...locale_pt,
  ...locale_ru,
  ...locale_tr,
  ...locale_vi,
  ...locale_zh,
  ...locale_th,
  ...locale_ar
]);

export const messages = {
  ko: messages_ko,
  en: messages_en,
  de: messages_de,
  es: messages_es,
  nl: messages_nl,
  fr: messages_fr,
  hi: messages_hi,
  it: messages_it,
  hu: messages_hu,
  ro: messages_ro,
  sv: messages_sv,
  pl: messages_pl,
  in: messages_in,
  ja: messages_ja,
  pt: messages_pt,
  ru: messages_ru,
  tr: messages_tr,
  vi: messages_vi,
  zh: messages_zh,
  th: messages_th,
  ar: messages_ar
};
