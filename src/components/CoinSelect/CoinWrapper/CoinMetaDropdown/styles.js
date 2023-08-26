import React from 'react';
import styled from 'styled-components/macro';

export const DropdownWrapper = styled.div`
  position: absolute;
  padding-top: 23px;
  margin-left: -13px;
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  z-index: 100;
  cursor: initial;

  .social-link-list {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2px 4px;
    a {
      margin: 4px 4px;
    }
  }

  .img-icon {
    width: 24px;
    height: 24px;
  }
`;

export const CurrentPopup = styled.div`
  padding: 0 12px;
  z-index: 100;
  background-color: ${props => props.theme.palette.clrChartBackground};
  border: 1px solid ${props => props.theme.palette.coinPairSelectBorder};
  border-bottom-right-radius: 3px;
  box-shadow: -1px 0px 10px 3px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  ::before {
    content: '';
    -ms-transform: rotate(90deg); /* IE 9 */
    -webkit-transform: rotate(90deg); /* Safari prior 9.0 */
    transform: rotate(90deg); /* Standard syntax */
    position: absolute;
    left: 27px;
    top: 13.3px;
    border-right: 7px solid ${props => props.theme.palette.clrHighContrast};
    border-top: 7px solid transparent;
    border-bottom: 6px solid transparent;
  }
  .left-info-wrapper {
    padding: 5px;
  }
  .extra-info {
    display: flex;
    flex-direction: column;
    border-top: 1px solid ${props => props.theme.palette.clrBorder};
    .tab-description {
      p {
        margin: 0;
        padding: 10px;
        color: ${props => props.theme.palette.clrHighContrast};
      }
    }
    .delivery-actions {
      display: flex;
      flex-direction: row;
      margin: 0 10px 10px 10px;
      align-items: center;
      .transaction-input {
        display: flex;
        margin-left: 10px;
        width: 40%;
        align-items: center;
        height: 32px;
      }
      .deliver-button {
        display: flex;
        font-weight: bold;
        background-color: ${props => props.theme.palette.clrBorder};
        border-top-right-radius: ${props => props.theme.palette.borderRadius};
        border-bottom-right-radius: ${props => props.theme.palette.borderRadius};
        align-items: center;
        justify-content: center;
        padding: 4px 10px;
        width: 100px;
        height: 32px;
        color: ${props => props.theme.palette.clrHighContrast};
        cursor: pointer;
      }
    }
  }
`;

export const BaseCurrentInfo = styled.div`
  display: flex;
  flex-direction: row;
`;
export const CurrentInfo = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;
export const InfoTab = styled.div`
  border-left: 1px solid ${props => props.theme.palette.clrBorder};
  display: flex;
  min-height: 65px;
  flex: 1;
  justify-content: center;
  padding: 8px;
  font-size: 14px;
  text-align: center;
  align-items: center;
  color: white;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    color: ${props => props.theme.palette.clrHighContrast};
    background-color: ${props => props.theme.palette.clrBorder};
  }
`;

const IconSvg = styled.svg`
  width: ${props => props.size || 38}px;
  height: ${props => props.size || 38}px;
  cursor: pointer;

  .cls-1 {
    fill: ${props => props.theme.palette.clrHighContrast};
  }

  .cls-2 {
    fill: none;
    stroke: ${props => props.theme.palette.clrHighContrast};
    stroke-miterlimit: 10;
    stroke-width: 1.52px;
  }
`;

export const InfoIcon = props => (
  <IconSvg {...props} viewBox="0 0 38.62 38.62">
    <path className="cls-1" d="M31.17,10.19a.76.76,0,1,0,.76-.76.76.76,0,0,0-.76.76Z" />
    <path
      className="cls-1"
      d="M34.21,19.31a14.76,14.76,0,0,1-.29,2.89.75.75,0,0,0,.59.89l.15,0a.77.77,0,0,0,.75-.61,16.2,16.2,0,0,0,.32-3.19,15.88,15.88,0,0,0-1.54-6.85.76.76,0,1,0-1.38.66,14.2,14.2,0,0,1,1.4,6.19Z"
    />
    <path
      className="cls-1"
      d="M23.11,26.15h-.76V16.27a.76.76,0,0,0-.76-.76H15.51a.76.76,0,0,0-.76.76v3a.76.76,0,0,0,.76.76h.76v6.08h-.76a.76.76,0,0,0-.76.76v3a.76.76,0,0,0,.76.76h7.6a.76.76,0,0,0,.76-.76v-3a.76.76,0,0,0-.76-.76Zm-.76,3H16.27V27.67H17a.76.76,0,0,0,.76-.76v-7.6a.76.76,0,0,0-.76-.76h-.76V17h4.56v9.88a.76.76,0,0,0,.76.76h.76Z"
    />
    <path
      className="cls-1"
      d="M19.31,14a3,3,0,1,0-3-3,3,3,0,0,0,3,3Zm0-4.56A1.52,1.52,0,1,1,17.79,11a1.52,1.52,0,0,1,1.52-1.52Z"
    />
    <circle className="cls-2" cx="19.31" cy="19.31" r="18.55" />
  </IconSvg>
);

export const InfoWrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.palette.clrPurple};
  white-space: nowrap;
  padding: 0 4px;
  div {
    display: flex;
    align-items: center;
  }
  span {
    &.plus_change {
      color: ${props => props.theme.palette.exchBarItemPlusPrice};
    }
    &.minus_change {
      color: ${props => props.theme.palette.exchBarItemMinusPrice};
    }
    &.amount {
      color: white;
      margin-right: 10px;
    }
  }
`;

export const InputWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  border: 2px solid ${props => props.theme.palette.clrBorder};
  padding: 0px 4px;
  input {
    width: 100%;
    background-color: ${props => props.theme.palette.clrChartBackground} !important;
    border: none;
    font-size: 12px;
    color: ${props => props.theme.palette.clrBorder};
    font-weight: bold;

    &::placeholder {
      font-weight: bold;
      color: ${props => props.theme.palette.clrBorder};
    }
  }
`;

export const TransactionInput = styled.div`
  display: flex;
  flex: 1;
  margin-left: 10px;
  width: 40%;
  align-items: center;
  height: 32px;
`;
