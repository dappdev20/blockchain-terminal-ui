import styled, { css } from 'styled-components/macro';
import { Tooltip } from 'react-tippy';
import ContentEditable from 'react-contenteditable';

const CommonAmtCss = css`
  font-size: 2rem;
  font-weight: 700;
  font-family: Roboto;
  background: transparent;
  border: 0;
`;

export const CoinAmtSymbol = styled.span`
  margin-right: 5px;
  font-size: 33px;
`;

const CommonAmtInputCss = css`
  ${CommonAmtCss}

  cursor: ${props => (props.isColdStorage ? 'default' : 'text')};

  white-space: nowrap;
  display: inline;

  min-width: 30px;

  overflow: hidden;

  * {
    display: inline;
    white-space: nowrap;
  }
`;

export const CoinAmtInputLeft = styled(ContentEditable)`
  ${CommonAmtInputCss}

  text-align: right;
`;

export const CoinAmtInputRight = styled(ContentEditable)`
  ${CommonAmtInputCss}

  text-align: left;
  min-width: auto;
`;

export const SuffixDecimal = styled.span`
  margin-top: -13px;
  margin-left: 2px;
  font-size: 20px;
  font-weight: 600;
`;

export const CoinAmtInputWrapper = styled.div`
  ${CommonAmtCss}

  display: flex;
  justify-content: ${props => (props.isRight ? 'flex-start' : 'flex-end')};
  align-items: center;

  position: relative;
  white-space: nowrap;
  overflow: hidden;

  width: calc(100% - ${props => (props.isRight && props.hasUnitPrefix ? '185px' : '140px')});
  max-width: calc(100% - ${props => (props.isRight && props.hasUnitPrefix ? '185px' : '140px')});
  height: 100%;

  color: ${props => props.theme.palette.clrBorder};

  &:hover {
    color: ${props => (!props.disabled ? props.theme.palette.coinPairSelectHoverText2 : props.theme.palette.clrBorder)};
  }
`;

export const TooltipWrapper = styled.div`
  text-align: right;

  .tooltip-value {
    margin: 0 3px;
  }
`;

export const StyledTooltip = styled(Tooltip)`
  display: flex !important;
  align-items: center;
  max-width: 100%;
`;
