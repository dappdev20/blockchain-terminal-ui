import styled from 'styled-components/macro';

export const LogoWrapper = styled.div.attrs({ className: 'exchange-icon' })`
  width: ${props => (props.size ? props.size : 30)}px;
  height: ${props => (props.size ? props.size : 30)}px;
  margin-right: 15px;
  border-radius: 50%;
  overflow: hidden;
`;

export const Logo = styled.img`
  margin: 0 !important;
  border: none !important;
  padding: 0 !important;
  width: 100% !important;
  height: 100% !important;
`;

export const ApiKeyWrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 45px;
  bottom: 0;
  padding: 5px 12px 5px 15px;
  display: flex;
  align-items: center;
  background-color: transparent;
  cursor: initial;
`;

export const Wrapper = styled.div`
  position: relative;
  height: 40px;
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export const WrapperWithBorder = styled(Wrapper)`
  background-color: ${props => props.theme.palette.clrBackground};
  border: 1px solid ${props => props.theme.palette.clrBorder};
  border-radius: ${props => props.theme.palette.borderRadius};
  margin-right: 12px;
`;

export const Input = styled.input`
  padding: 0 15px;
  flex: 1;
  background: none;
  border: none;
  font-size: 13px;
  color: ${props => props.theme.palette.clrPurple};

  &::placeholder {
    color: ${props => props.theme.palette.clrPurple};
  }
`;

export const InputAddon = styled.div`
  position: relative;
  width: 132px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.palette.clrBorder};
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.theme.palette.clrHighContrast};
  text-transform: uppercase;
  cursor: pointer;
`;

export const Button = styled.button`
  position: relative;
  height: 100%;
  margin: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: transparent;
  color: ${props => props.theme.palette.clrPurple};
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in;

  &:hover {
    color: ${props => props.theme.palette.clrHighContrast};
    text-decoration: underline;
  }
`;

export const DocumentContentWrapper = styled.div`
  width: 700px;
  max-height: 500px;
  background-color: ${props => props.theme.palette.apiDocumentModalBgColor};
  color: ${props => props.theme.palette.settingsHeaderFontColor};
  padding: 30px 20px;
  .api-modal {
    width: 100%;
    max-height: 440px;
    overflow: auto;
    & > p {
      text-align: center;
      img {
        max-width: calc(100% - 80px);
      }
    }
  }
`;
