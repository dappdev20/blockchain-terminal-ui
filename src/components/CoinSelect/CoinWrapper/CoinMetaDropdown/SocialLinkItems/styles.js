import styled from 'styled-components/macro';

export const PaginationWrapper = styled.div`
  display: flex;
  padding: 0px 10px !important;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  flex-direction: row;
  width: 250px;
  height: 32px;
`;
export const StageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 220px;
  height: 100%;
  .carousel-stage {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
`;
export const ArrowWrapper = styled.div`
  width: 16px;
  height: 100%;
  display: flex;
  z-index: 300;
  justify-content: center;
  align-items: center;
  text-align: center;
  .blank-space {
    width: 16px;
  }
`;
