import React, { memo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import SMSVerification from '@/components-generic/SMSVerification3';
import CoinPair from '@/components/CoinPair';
import { StyledWrapper, CoinPairWrapper, AvatarWrapper, AvatarIcon, LoginTextWrapper } from './styles';

const Login = memo(() => {
  const [loginMode, setLoginMode] = useState(false);

  const handleLogin = () => {
    setLoginMode(!loginMode);
  };

  return (
    <StyledWrapper>
      <CoinPairWrapper>{loginMode ? <SMSVerification /> : <CoinPair />}</CoinPairWrapper>
      <AvatarWrapper onClick={handleLogin} width="60">
        <AvatarIcon />
        <LoginTextWrapper>
          <span className="login-title">
            <FormattedMessage id="pay_app.pay_window.label_login" defaultMessage="Login" />
          </span>
        </LoginTextWrapper>
      </AvatarWrapper>
    </StyledWrapper>
  );
});

export default Login;
