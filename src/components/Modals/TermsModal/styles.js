import styled from 'styled-components/macro';

export const CONTENT_STYLE = {
  width: '50%',
  height: 600,
  paddingTop: '25%',
  'min-width': '640px'
};

export const PageModalWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 1000000;
  ${props => (props.hoverMode ? 'pointer-events: none;' : '')}
  ${props => (props.inLineMode ? 'display:none;' : '')}
`;

export const ModalWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000001;
  background: rgba(0, 0, 0, 0.435);
  border-radius: ${props => props.theme.palette.borderRadius};
`;

export const ModalInnerWrapper = styled.div`
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;
`;

export const ContentOuterWrapper = styled.section`
  background-color: ${props => props.theme.palette.clrMainWindow};
  color: ${props => props.theme.palette.clrHighContrast};
  border-radius: ${props => props.theme.palette.borderRadius};
  font-size: 12px;
  box-shadow: 0 3px 10px 5px rgba(0, 0, 0, 0.52);

  height: 100%;
  width: 100%;
`;

export const ContentInnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 15px;
`;

export const TextDescription = styled.div`
  margin-top: 20px;
  width: 100%;
  color: ${props => props.theme.palette.settingsText};
  font-size: 17px;
  font-weight: normal;
  overflow-y: scroll;
  & a {
    color: ${props => props.theme.palette.settingsText};
  }
`;
