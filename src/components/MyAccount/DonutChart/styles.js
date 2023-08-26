import styled from 'styled-components/macro';

export const Wrapper = styled.div`
  position: relative;
  height: 100%;
  border-right: 1px solid ${props => props.theme.palette.orderFormBorder}7f;

  > canvas {
    width: 229px !important;
  }
`;

export const BalanceLabel = styled.div`
  position: absolute;
  height: 50%;
  margin: auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  color: ${props => props.theme.palette.donutTotalBalanceLabel};
  font-size: 20px;
  text-align: center;
  font-weight: bold;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 200px;
  .title {
    display: flex;
    align-items: center;
    color: white;
    font-size: ${props => (props.isShowingPercent || props.isHoverPortfolio ? '28px' : '21px')};
    color: ${props => props.theme.palette.clrPurple};
    margin-left: ${props => (props.isTotalBalance ? '0px' : '-30px')};

    .percent-title {
      position: relative;
      .integer {
        display: flex;
        left: 0;
        top: 0;
        font-size: 51px;
        font-weight: 600;
        line-height: 1.7;
      }
      .decimal {
        position: absolute;
        top: 18px;
        font-size: 20px;
        font-weight: 600;
        right: -27px;
      }
      .percent {
        position: absolute;
        bottom: 13px;
        right: -24px;
      }
    }

    .decimal-title {
      font-size: 33px;

      span {
        font-size: 16px;
        vertical-align: super;
      }
    }
  }

  .details {
    font-size: 13px;
    color: ${props => props.theme.palette.clrPurple};
    text-transform: uppercase;
    ${props =>
      !props.isTotalBalance &&
      `
      position: absolute;
      right: 0;
      bottom: -40px;
    `}
  }
`;
