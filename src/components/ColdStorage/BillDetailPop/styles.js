import Code from 'qrcode.react';
import styled, { css } from 'styled-components/macro';
import { FlexWrapper } from '@/components-generic/Wrappers';
import { BILL_IMG_RATIO, BILL_RIGHT_GAP_RATIO } from '@/config/constants';

export const CONTENT_STYLE = {
  background: 'white',
  width: '65%',
  height: 0,
  paddingTop: `${65 / BILL_IMG_RATIO}%`
};

/**
 * Left details container styles
 * |                                                    |
 * |  QRRRRRRRRRQ                                       |
 * |  RRRRRRRRRRR                                       |
 * |  RRRRRRRRRRR                                       |
 * |  RRRRRRRRRRR                                       |
 * |  QRRRRRRRRRQ                                       |
 * |                                                    |
 * |  SIGN AREA                                         |
 * |                                                    |
 * |  BILL UNIT                                         |
 * |                                                    |
 */
export const LeftDetails = styled(FlexWrapper).attrs({
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'flex-start'
})`
  flex: 1;
  height: 100%;
  padding: 16px 30px 16px 16px;
`;

export const LeftAnnotation = styled.div`
  position: absolute;
  left: -12px;
  top: 100%;
  width: 100%;
  transform: rotate(-90deg);
  transform-origin: top left;
  text-align: center;
  font-size: 9px;
  color: black;
`;

export const LeftQRCodeWrapper = styled.div`
  position: relative;
  width: 38%;
  height: 0;
  padding-top: 38%;
  margin-bottom: auto;

  color: black;
  font-size: 12px;
  word-break: break-all;

  svg {
    margin-bottom: 12px;
  }
  p {
    margin: 0;
  }
`;

export const QRCode = styled(Code).attrs({
  bgColor: 'transparent',
  renderAs: 'svg'
})`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  ${props =>
    props.disabled &&
    css`
      filter: blur(4px);
    `}
`;

/**
 * Right details container styles
 * |              |
 * |       O  P   |
 * |       W  U   |
 * |       N  B   |
 * |       E  L   |
 * |       R  I   |
 * |          C   |
 * |              |
 * |              |
 * |              |
 * |  QRRRRRRRRQ  |
 * |  RRRRRRRRRR  |
 * |  RRRRRRRRRR  |
 * |  QRRRRRRRRQ  |
 * |              |
 */
export const RightDetails = styled(FlexWrapper).attrs({
  flexDirection: 'column',
  justifyContent: 'flex-end',
  alignItems: 'flex-start'
})`
  position: relative;
  width: ${BILL_RIGHT_GAP_RATIO * 100}%;
  height: 100%;
  padding: 12px;
`;

export const BillInfo = styled.div`
  flex: 1;
  margin-top: 58%;
  word-break: break-all;
  margin-bottom: 12px;
  font-size: 12px;
  writing-mode: vertical-rl;
  color: black;
`;

export const RightQRCodeWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 100%;
`;
