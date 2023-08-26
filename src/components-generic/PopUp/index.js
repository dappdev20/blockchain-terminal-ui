import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withSafeTimeout } from '@hocs/safe-timers';

import { Wrapper } from '../Wrappers';
import { Overlayer } from '../Overlayer';
import { AnitmatedContent } from './styles';

const PopUp = ({ contentWidth, contentHeight, contentStyle, fixed, open, children, setSafeTimeout, onClose }) => {
  // isOpen is used to represent the content is mounted or not.
  const [isOpen, setIsOpen] = useState(open);
  // isShowAnimation is used to represent which animation we apply.
  const [isShowAnimation, setIsShowAnimation] = useState(true);

  function handleOverlayClick() {
    setIsShowAnimation(false);
    setSafeTimeout(() => {
      setIsOpen(false);
      onClose();
    }, 500);
  }

  useEffect(() => {
    setIsShowAnimation(open);
    setSafeTimeout(() => {
      setIsOpen(open);
    }, 500);
  }, [open, setSafeTimeout]);

  if (!isOpen) {
    return null;
  }

  return (
    <Wrapper fixed={fixed}>
      <Overlayer fixed={fixed} show={isShowAnimation} onClick={handleOverlayClick} />
      <AnitmatedContent style={contentStyle} show={isShowAnimation} width={contentWidth} height={contentHeight}>
        {children}
      </AnitmatedContent>
    </Wrapper>
  );
};

PopUp.propTypes = {
  contentWidth: PropTypes.number,
  contentHeight: PropTypes.number,
  contentStyle: PropTypes.object,
  fixed: PropTypes.bool,
  open: PropTypes.bool,
  onClose: PropTypes.func
};
PopUp.defaultProps = {
  contentWidth: null,
  contentHeight: null,
  contentStyle: {},
  fixed: false,
  open: false,
  onClose: () => {}
};

export default withSafeTimeout(PopUp);
