import React, { useState } from 'react';
import styled from 'styled-components/macro';
import DataLoader from '@/components-generic/DataLoader';
import OrderRow from './OrderRow';
import OrderButton from './OrderButton';

const Wrapper = styled.div.attrs({ className: 'order-container' })`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 12px;
  width: 50%;

  & + & {
    border-left: 1px solid ${props => props.theme.palette.clrSubBorder};
  }
`;

const OrderButtonTextWrapper = styled.div.attrs({ className: 'order-button-text-wrapper' })`
  position: absolute;
  margin-left: -20px;
  height: 100%;
`;

let animate = false;
const OrderContainer = ({ isBuy, animation }) => {
  const [buttonAnimate, setButtonAnimate] = useState(false);
  const [orderButtonText, setOrderButtonText] = useState(`${isBuy ? 'Buy' : 'Sell'}`);
  const buttonAnimation = !animate && (isBuy ? animation === 1 : animation === 3);
  if (buttonAnimation) {
    animate = true;
    setButtonAnimate(true);
    setTimeout(() => {
      setButtonAnimate(false);
      setTimeout(() => {
        setOrderButtonText(
          <div>
            <OrderButtonTextWrapper>
              <DataLoader width={20} height={20} />
            </OrderButtonTextWrapper>
            {isBuy ? 'Buy' : 'Sell'}
          </div>
        );
      }, 350);
      setTimeout(() => {
        setOrderButtonText(`${isBuy ? 'Buy' : 'Sell'}`);
      }, 2300);
    }, 350);
    setTimeout(() => {
      animate = false;
    }, 6000);
  }
  return (
    <Wrapper>
      <OrderRow isBuy={isBuy} animation={animation} isLeft />
      <OrderRow isBuy={isBuy} animation={animation} />
      <OrderButton active={buttonAnimate} isBuy={isBuy} onClick={() => {}} orderButtonText={orderButtonText} />
    </Wrapper>
  );
};

export default OrderContainer;
