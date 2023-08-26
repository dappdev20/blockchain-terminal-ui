import React, { PureComponent } from 'react';
import { Tooltip } from 'react-tippy';

import { getScreenInfo } from '@/utils';
import TooltipContent from './TooltipContent';

import { Wrapper } from './styles';

const IS_MOBILE = getScreenInfo().isMobileDevice;

const TOOLTIP_OPTIONS = {
  modifiers: {
    preventOverflow: { enabled: true },
    flip: { enabled: true },
    hide: { enabled: false },
    interactiveBorder: 200
  }
};

class RowTooltip extends PureComponent {
  getTooltipContent = () => {
    const {
      isBuy,
      price,
      siblingPrice,
      exchange,
      total,
      priceFractionDigits,
      priceIntLength,
      priceDigitsGap
    } = this.props;

    return (
      <TooltipContent
        isBuy={isBuy}
        price={price}
        siblingPrice={siblingPrice}
        exchange={exchange}
        total={total}
        fractionDigits={priceFractionDigits}
        intLength={priceIntLength}
        digitsGap={priceDigitsGap}
      />
    );
  };

  render() {
    const { isBuy, className, children, onClick, onMouseEnter, onMouseLeave } = this.props;

    return (
      <Wrapper onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <Tooltip
          arrow
          unmountHTMLWhenHide
          delay={300}
          duration={250}
          animation="fade"
          position="right"
          placement="right"
          theme={isBuy ? 'orderbook' : 'orderbook-sell'}
          className={className}
          style={{ display: 'Wrapper' }}
          disabled={IS_MOBILE}
          html={this.getTooltipContent()}
          popperOptions={TOOLTIP_OPTIONS}
          interactive={true}
        >
          {children}
        </Tooltip>
      </Wrapper>
    );
  }
}

export default RowTooltip;
