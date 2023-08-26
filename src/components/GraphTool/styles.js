import styled from 'styled-components/macro';

export const BGraph = styled.div.attrs({ className: 'bgraph' })`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const BGraphControls = styled.div`
  position: relative;
  flex-grow: 1;
  min-height: 0;
`;
