import React from 'react';

import { FILTERS } from '@/stores/HistoricalPricesStore';
import { animateButton } from '@/utils/CustomControls';

import { ToolbarGroupWrapper, ToolbarItem, PulsateDot, ToolbarLiveItem } from './styles';

const TimerTools = ({ onChange, selected, minTime = 0, isDisabled, show, onMoveOut }) => {
  const now = Date.now();
  const filterValues = Object.values(FILTERS);

  return (
    <ToolbarGroupWrapper show={show} onMouseEnter={() => onMoveOut(true)} onMouseLeave={() => onMoveOut(false)}>
      <ToolbarLiveItem onClick={() => onChange()}>
        <PulsateDot />
        LIVE
      </ToolbarLiveItem>
      {filterValues.map((item, i) => {
        const disabled = i && minTime && minTime > now - filterValues[i - 1].ms;
        return (
          <ToolbarItem
            id={item.key}
            key={item.key}
            onClick={() => {
              animateButton(item.key);
              if (disabled || isDisabled) {
                return undefined;
              }

              onChange(item.key);
            }}
            isActive={selected === item.key}
            disabled={disabled || isDisabled}
          >
            {item.key}
          </ToolbarItem>
        );
      })}
    </ToolbarGroupWrapper>
  );
};

export default TimerTools;
