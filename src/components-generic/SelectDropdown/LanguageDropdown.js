import React from 'react';
import styled, { css } from 'styled-components/macro';
import { LanguageIcon } from './Components';

const Wrapper = styled.div`
  position: relative;
  width: 40px;
  height: 40px;
  padding: 6px;
  background-color: ${props => props.theme.palette.clrBorder};
  border-radius: 50%;
  cursor: pointer;
  &:hover {
    > div {
      display: flex;
    }
  }
`;

const Panel = styled.div`
  position: absolute;
  display: none;
  padding: 20px 25px 0px 25px;
  background: ${props => props.theme.palette.clrChartBackground};
  border-radius: ${props => props.theme.palette.borderRadius};
  border: 1px solid ${props => props.theme.palette.clrBorder};
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.5);
  z-index: 10;

  &:before {
    content: '';
    position: absolute;
    width: 40px;
    height: 20px;
  }
  &:after {
    content: '';
    position: absolute;
    width: 15px;
    height: 12px;
    border: solid 7px transparent;
  }

  ${props =>
    props.insideSettings
      ? css`
          right: -5px;
          bottom: 52px;
          &:before {
            right: 4px;
            bottom: -20px;
          }
          &:after {
            border-bottom: none;
            border-top-color: ${props => props.theme.palette.clrBorder};
            right: 17px;
            bottom: -13px;
          }
        `
      : css`
          right: -11px;
          top: 49px;
          &:before {
            right: 10px;
            top: -20px;
          }
          &:after {
            border-top: none;
            border-bottom-color: ${props => props.theme.palette.clrBorder};
            right: 23px;
            top: -13px;
          }
        `}
`;

const Column = styled.div`
  & + div {
    margin-left: 15px;
  }
`;

const Item = styled.div`
  font-size: ${props => (props.isMobile ? '24px' : '14px')};
  font-weight: 600;
  height: 38px;
  line-height: 1;
  color: ${props => (props.isSelected ? props.theme.palette.clrHighContrast : props.theme.palette.clrPurple)};
  cursor: pointer;
  ${props =>
    props.isDisabled &&
    css`
      opacity: 0.5;
      pointer-events: none;
    `}

  &:hover {
    color: ${props => props.theme.palette.clrHighContrast};
  }
`;

const LANGUAGES = [
  { name: 'Afrikaans', label: 'Afrikaans' },
  { name: 'azərbaycan', label: 'azərbaycan' },
  { name: 'Bahasa Indonesia', label: 'Bahasa Indonesia' },
  { name: 'Bahasa Melayu', label: 'Bahasa Melayu' },
  { name: 'bosanski', label: 'bosanski' },
  { name: 'català', label: 'català' },
  { name: 'Čeština', label: 'Čeština' },
  { name: 'Dansk', label: 'Dansk' },
  { name: 'Deutsch', label: 'Deutsch (Deutschland)' },
  { name: 'eesti', label: 'eesti' },
  { name: 'English', label: 'English (United States)' },
  { name: 'España', label: 'Español (España)' },
  { name: 'Latinoamérica', label: 'Español (Latinoamérica)' },
  { name: 'euskara', label: 'euskara' },
  { name: 'Filipino', label: 'Filipino' },
  { name: 'Français', label: 'Français (France)' },
  { name: 'galego', label: 'galego' },
  { name: 'Hrvatski', label: 'Hrvatski' },
  { name: 'isiZulu', label: 'isiZulu' },
  { name: 'íslenska', label: 'íslenska' },
  { name: 'Italiano', label: 'Italiano' },
  { name: 'Kiswahili', label: 'Kiswahili' },
  { name: 'latviešu', label: 'latviešu' },
  { name: 'lietuvių', label: 'lietuvių' },
  { name: 'magyar', label: 'magyar' },
  { name: 'Nederlands', label: 'Nederlands' },
  { name: 'norsk', label: 'norsk' },
  { name: 'oʻzbekcha', label: 'oʻzbekcha' },
  { name: 'polski', label: 'polski' },
  { name: 'Brasil', label: 'Português (Brasil)' },
  { name: 'Portugal', label: 'Português (Portugal)' },
  { name: 'română', label: 'română' },
  { name: 'shqip', label: 'shqip' },
  { name: 'Slovenčina', label: 'Slovenčina' },
  { name: 'slovenščina', label: 'slovenščina' },
  { name: 'Suomi', label: 'Suomi' },
  { name: 'Svenska', label: 'Svenska' },
  { name: 'Tiếng Việt', label: 'Tiếng Việt' },
  { name: 'Türkçe', label: 'Türkçe' },
  { name: 'Ελληνικά', label: 'Ελληνικά' },
  { name: 'български', label: 'български' },
  { name: 'кыргызча', label: 'кыргызча' },
  { name: 'қазақ тілі', label: 'қазақ тілі' },
  { name: 'македонски', label: 'македонски' },
  { name: 'монгол', label: 'монгол' },
  { name: 'Русский', label: 'Русский' },
  { name: 'српски', label: 'српски (ћирилица)' },
  { name: 'Українська', label: 'Українська' },
  { name: 'ქართული', label: 'ქართული' },
  { name: 'հայերեն', label: 'հայերեն' },
  { name: 'עברית', label: 'עברית' },
  { name: 'اردو', label: 'اردو' },
  { name: 'العربية', label: 'العربية' },
  { name: 'فارسی', label: 'فارسی' },
  { name: 'አማርኛ', label: 'አማርኛ' },
  { name: 'नेपाली', label: 'नेपाली' },
  { name: 'मराठी', label: 'मराठी' },
  { name: 'हिन्दी', label: 'हिन्दी' },
  { name: 'বাংলা', label: 'বাংলা' },
  { name: 'ਪੰਜਾਬੀ', label: 'ਪੰਜਾਬੀ' },
  { name: 'ગુજરાતી', label: 'ગુજરાતી' },
  { name: 'தமிழ்', label: 'தமிழ்' },
  { name: 'తెలుగు', label: 'తెలుగు' },
  { name: 'ಕನ್ನಡ', label: 'ಕನ್ನಡ' },
  { name: 'മലയാളം', label: 'മലയാളം' },
  { name: 'සිංහල', label: 'සිංහල' },
  { name: 'ไทย', label: 'ไทย' },
  { name: 'ລາວ', label: 'ລາວ' },
  { name: 'ဗမာ', label: 'ဗမာ' },
  { name: 'ខ្មែរ', label: 'ខ្មែរ' },
  { name: '한국어', label: '한국어' },
  { name: '日本語', label: '日本語' },
  { name: '简体中文', label: '简体中文' },
  { name: '繁體中文', label: '繁體中文' }
];

class LanguageDropdown extends React.PureComponent {
  render() {
    const { value, items, insideSettings, onChange, isLogin } = this.props;
    const columns = [];
    for (let i = 0; i < LANGUAGES.length; i += 19) {
      columns.push(LANGUAGES.slice(i, i + 19));
    }
    return (
      <Wrapper isLogin={isLogin}>
        <LanguageIcon isLogin={isLogin} />
        <Panel insideSettings={insideSettings}>
          {columns.map((langs, index) => (
            <Column key={index}>
              {langs.map(item => {
                const disabled = !items.find(({ name }) => item.name === name);
                return (
                  <Item
                    key={item.name}
                    isSelected={item.name === value}
                    isDisabled={disabled}
                    onClick={() => onChange(item.name)}
                  >
                    {item.name}
                  </Item>
                );
              })}
            </Column>
          ))}
        </Panel>
      </Wrapper>
    );
  }
}

export default LanguageDropdown;
