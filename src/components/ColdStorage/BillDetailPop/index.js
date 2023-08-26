import React, { memo, useState } from 'react';
import { withSafeTimeout } from '@hocs/safe-timers';
import PropTypes from 'prop-types';

import PopUp from '@/components-generic/PopUp';
import { Wrapper } from '@/components-generic/Wrappers';
import CloseButton from '@/components-generic/CloseButton';
import { BackgroundImg } from '../styles';
import {
  CONTENT_STYLE,
  LeftDetails,
  LeftQRCodeWrapper,
  LeftAnnotation,
  RightDetails,
  BillInfo,
  RightQRCodeWrapper,
  QRCode
} from './styles';

const BillDetailPop = memo(({ level, publicAddress, publicKey, ownerId, onClose, setSafeTimeout }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const bgURL = `./img/bills/bill_${level + 1}.png`;
  const qrLink = `demo.bct.trade/publickey/${ownerId}`;

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  const handleImageLoaded = () => {
    setIsLoaded(true);
    setIsOpen(true);
  };

  const onCloseButton = () => {
    setIsOpen(false);
    setSafeTimeout(() => {
      onClose();
    }, 500);
  };

  if (!isLoaded) {
    return <BackgroundImg src={bgURL} onLoad={handleImageLoaded} />;
  }

  return (
    <PopUp contentStyle={CONTENT_STYLE} open={isOpen} onClose={handleClose}>
      {/* Darwin Background Img */}
      <BackgroundImg src={bgURL} isVisible />

      <Wrapper>
        <LeftDetails>
          {/* Show big QR code containing userId + Withdraw Guide */}
          <LeftQRCodeWrapper>
            <LeftAnnotation>PUBLIC KEY & ADDRESS FOR THIS SMART CONTRACT</LeftAnnotation>
            <QRCode value={publicAddress} fgColor="#000000A0" />
            <p>WITHDRAW OF THIS SMART CONTRACT WILL RETURN IT TO BTC WALLET</p>
            <p>{publicKey}</p>
          </LeftQRCodeWrapper>
        </LeftDetails>

        <RightDetails>
          {/* Show Currency value + Date */}
          <BillInfo>
            SMART CONTRACT:: {publicKey}.{/* {withdrawAddress} // Can be shown later */}
          </BillInfo>

          {/* Show small QR code containing link to user Private Key */}
          <RightQRCodeWrapper>
            <QRCode value={qrLink} />
          </RightQRCodeWrapper>
        </RightDetails>
        <CloseButton onClose={onCloseButton} />
      </Wrapper>
    </PopUp>
  );
});

BillDetailPop.propTypes = {
  level: PropTypes.number,
  publicAddress: PropTypes.string,
  publicKey: PropTypes.string,
  // withdrawAddress: PropTypes.string,
  ownerId: PropTypes.string,
  onClose: PropTypes.func.isRequired
};

BillDetailPop.defaultProps = {
  level: 0,
  publicAddress: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
  publicKey: 'E9873D79C6D87DC0FB6A5778633389F4453213303DA61F20BD67FC233AA33262',
  // withdrawAddress: '1BoatSLRHtKNngkdXEeobR76b53LETtpyT',
  ownerId: '1234567890123456'
};

export default withSafeTimeout(BillDetailPop);
