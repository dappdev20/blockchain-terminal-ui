import React, { Component } from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { STORE_KEYS } from '@/stores';
import Spinner from '@/components-generic/Spinner';

const OuterWrapper = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: ${props => props.theme.palette.clrMainWindow};
  color: ${props => props.theme.palette.clrHighContrast};
  border-radius: ${props => props.theme.palette.borderRadius};
  font-size: 20px;
  box-shadow: 0 3px 10px 5px rgba(0, 0, 0, 0.52);

  #client-snackbar {
    display: flex;
    align-items: center;

    svg {
      opacity: 0.9;
      margin-right: 8px;
    }
  }

  .error {
    background: #d32f2f;
    color: white;
  }

  .success {
    background: #43a047;
    color: white;
  }
`;

const SpinnerWrapper = styled.div`
  position: relative;
  height: 80px;
`;

const TextDescription = styled.span`
  margin: 32px 0;
  width: 100%;
  text-align: center;
  color: ${props => props.theme.palette.clrHighContrast};
  font-size: 20px;
  font-weight: bold;
`;

class ConfirmEmail2FA extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      isSuccess: false,
      isLoad: false,
      time: 5,
      intervalHandler: null
    };
  }

  componentDidMount() {
    this.checkCodeStatus();
  }

  checkCodeStatus() {
    this.setState({ isLoad: false });

    const { verifyEmail2FA } = this.props[STORE_KEYS.SMSAUTHSTORE];

    const { code } = this.props;

    verifyEmail2FA(code)
      .then(res => {
        this.setState({
          isLoad: true,
          isSuccess: true,
          message: res
        });

        this.redirectToMainPage();
      })
      .catch(err => {
        this.setState({
          isLoad: true,
          isSuccess: false,
          message: err
        });
      });
  }

  redirectToMainPage() {
    this.calculateRedirectTime();
    setTimeout(() => {
      clearInterval(this.state.intervalHandler);
      this.setState(
        {
          intervalHandler: null
        },
        () => {
          this.props.history.push('/');
        }
      );
    }, 5000);
  }

  calculateRedirectTime() {
    const intervalHandler = setInterval(() => {
      const { time } = this.state;

      if (time > 0) {
        this.setState(prevState => ({
          time: prevState.time - 1
        }));
      }
    }, 1000);
    this.setState({
      intervalHandler
    });
  }

  renderRedirectAlert() {
    const { time } = this.state;

    return (
      <>
        <TextDescription>
          <FormattedMessage
            id="modal.2fa.label_redirection"
            defaultMessage="It will be redirected to the home page in 5 seconds."
          />
        </TextDescription>

        {time}
      </>
    );
  }

  render() {
    const { message, isLoad, isSuccess } = this.state;

    if (!isLoad) {
      return (
        <OuterWrapper>
          <SpinnerWrapper>
            <Spinner />
          </SpinnerWrapper>
        </OuterWrapper>
      );
    }

    const variant = isSuccess ? 'success' : 'error';

    return (
      <OuterWrapper>
        <SnackbarContent
          className={variant}
          aria-describedby="client-snackbar"
          message={
            <span id="client-snackbar">
              {isSuccess ? <CheckCircleIcon /> : <ErrorIcon />}
              {message}
            </span>
          }
        />

        {isSuccess && this.renderRedirectAlert()}
      </OuterWrapper>
    );
  }
}

export default inject(STORE_KEYS.SMSAUTHSTORE)(observer(withRouter(ConfirmEmail2FA)));
