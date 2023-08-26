import React from 'react';
import { HeaderWrapper, TableHeaderRow } from './styles';

function ActiveTable() {
  return (
    <TableHeaderRow>
      <HeaderWrapper className="cell-exchange">Exchanges</HeaderWrapper>
      <HeaderWrapper className="cell-api">API</HeaderWrapper>
      <HeaderWrapper className="cell-trading_pair">
        <div className="trading-top">Trading Pair</div>
        <div className="trading-bottom">
          <div className="trading-bottom__base">Base</div>
          <div className="trading-bottom__quote">Quote</div>
        </div>
      </HeaderWrapper>
      {/* TODO: Might be added later from the BE
            <HeaderWrapper className="cell-rate">Rate</HeaderWrapper>
            */}
      <HeaderWrapper className="cell-balance">Basecoin Balance</HeaderWrapper>
      <HeaderWrapper className="cell-reserved">Reserved</HeaderWrapper>
      <HeaderWrapper className="cell-total">Total</HeaderWrapper>
      <HeaderWrapper className="cell-action" />
    </TableHeaderRow>
  );
}

export default ActiveTable;
