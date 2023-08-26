import React from 'react';

import { HeaderCellStyled } from '../../Cells/commonStyles';
import { TooltipContainer, TooltipInner } from './styles';

const HeaderCell = ({ children, tooltipText, cellWidth, position = 'top', type }) => (
  <HeaderCellStyled
    cellWidth={cellWidth}
    arrow={true}
    animation="fade"
    position={position}
    placement="top"
    distance={4}
    theme="bct"
    disabled={!tooltipText}
    style={{ display: 'flex' }}
    type={type}
    html={
      <TooltipContainer>
        <TooltipInner>{tooltipText}</TooltipInner>
      </TooltipContainer>
    }
    popperOptions={{
      modifiers: {
        preventOverflow: {
          enabled: false
        },
        flip: {
          enabled: false
        },
        hide: {
          enabled: false
        }
      }
    }}
  >
    {children}
  </HeaderCellStyled>
);

export default HeaderCell;
