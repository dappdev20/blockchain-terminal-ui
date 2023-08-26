import React from 'react';
import CloseButton from '@/components-generic/CloseButton';
import {
  DefaultWrapper,
  RightSectionWrapper,
  LeftLowerSectionModalWrapper,
  InnerWrapper,
  VerticalSpace,
  VerticalSpaceTop
} from './styles';

const Modal = ({
  open,
  onClose,
  onConfirm,
  ModalComponentFn,
  location,
  additionalVerticalSpace,
  showClose = true,
  ...props
}) => {
  const handleClick = onClose => ({ target: { dataset } }) => {
    if (dataset && dataset.zone === 'modal-wrapper') {
      onClose();
    }
  };
  // can be extracted to HOC/render props/etc.
  return location === 'graph-chart-parent' ? (
    <DefaultWrapper
      {...props}
      open={open}
      onClose={onClose}
      onClick={handleClick(onClose)}
      data-zone="modal-wrapper"
      additionalVerticalSpace={additionalVerticalSpace}
    >
      <InnerWrapper>
        {showClose && <CloseButton onClick={onClose} size="11px" />}
        {ModalComponentFn({
          open,
          onClose,
          onConfirm
        })}
      </InnerWrapper>

      {additionalVerticalSpace && (
        <>
          <VerticalSpace data-zone="modal-wrapper" />
          <VerticalSpaceTop data-zone="modal-wrapper" />
        </>
      )}
    </DefaultWrapper>
  ) : location === 'left-lower-section' ? (
    <LeftLowerSectionModalWrapper {...props} data-zone="modal-wrapper">
      {showClose && <CloseButton onClick={onClose} size="11px" />}
      {ModalComponentFn({
        open,
        onClose,
        onConfirm
      })}
    </LeftLowerSectionModalWrapper>
  ) : (
    <RightSectionWrapper
      {...props}
      open={open}
      onClose={onClose}
      onClick={handleClick(onClose)}
      data-zone="modal-wrapper"
      additionalVerticalSpace={additionalVerticalSpace}
    >
      <InnerWrapper>
        {showClose && <CloseButton onClick={onClose} size="11px" />}
        {ModalComponentFn({
          open,
          onClose,
          onConfirm
        })}
      </InnerWrapper>

      {additionalVerticalSpace && (
        <>
          <VerticalSpace data-zone="modal-wrapper" />
          <VerticalSpaceTop data-zone="modal-wrapper" />
        </>
      )}
    </RightSectionWrapper>
  );
};

export default Modal;
