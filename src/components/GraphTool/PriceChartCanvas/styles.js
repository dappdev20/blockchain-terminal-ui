import styled from 'styled-components/macro';

export const ChartWrapper = styled.div`
  position: absolute;
  right: 0;
  left: 0;
  height: 100%;
  cursor: crosshair;
  z-index: 3;
`;

export const ChartInfoWrapper = styled.div`
  position: absolute;
  right: 100px;
  bottom: 50px;
`;

export const ChartCanvasWrapper = styled.div`
  height: 100%;
  canvas {
    border-radius: ${props => props.theme.palette.borderRadius};
  }
`;
