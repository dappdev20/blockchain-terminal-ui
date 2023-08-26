import styled from 'styled-components/macro';

export const Wrapper = styled.div`
  display: flex;
  flex-grow: 1;

  &:last-child {
    & > div {
      border: none;
    }
  }
`;
