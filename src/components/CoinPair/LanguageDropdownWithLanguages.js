import React from 'react';
import { inject, observer } from 'mobx-react';
import { compose, withProps } from 'recompose';

import { STORE_KEYS } from '@/stores';
import { languages } from '@/lib/translations/languages';
import LanguageDropdown from '@/components-generic/SelectDropdown/LanguageDropdown';

const LanguageDropdownWithLanguages = ({ language, setLanguage }) => {
  const languagesArray = [];
  for (let i = 0; i < languages.length; i++) {
    languagesArray.push({
      name: languages[i].value,
      flag: languages[i].flag
    });
  }
  return <LanguageDropdown value={language} items={languagesArray} onChange={setLanguage} />;
};

export default compose(
  inject(STORE_KEYS.SETTINGSSTORE, STORE_KEYS.TELEGRAMSTORE),
  observer,
  withProps(props => {
    const {
      [STORE_KEYS.SETTINGSSTORE]: { language, setLanguage },
      [STORE_KEYS.TELEGRAMSTORE]: { isLoggedIn }
    } = props;
    return {
      language,
      setLanguage,
      isLoggedIn
    };
  })
)(LanguageDropdownWithLanguages);
