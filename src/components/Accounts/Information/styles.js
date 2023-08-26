import styled from 'styled-components/macro';

export const InfoWrapper = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem 1rem 1rem;
  .label {
    color: ${props => props.theme.palette.clrPurple};
    font-weight: 700;
    margin: 0 10px;
  }
`;

export const DetailWrapper = styled.div`
  display: flex;
  padding: 12px;
  flex-direction: column;
  width: 250px;
`;

export const DetailItem = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  color: #7f8bc2;
  line-height: 28px;
  border-bottom: 1px solid rgba(69, 76, 115, 0.498);
  .label {
    font-weight: 400;
  }
`;
