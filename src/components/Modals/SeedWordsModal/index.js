import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';

import { STORE_KEYS } from '@/stores';
import GradientButton from '@/components-generic/GradientButtonSquare';
import DataLoader from '@/components-generic/DataLoader';

import {
  Wrapper,
  Label,
  Heading,
  Text,
  IconWarning,
  Buttons,
  NumberWrapper,
  WordInput,
  WordInputWrapper,
  InputValueWrapper,
  InputRowWrapper
} from './styles';

// TODO: Needs update in the future
const SEED_WORDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

class SeedWordsModal extends Component {
  state = {
    isShow: false,
    isBackUp: false,
    isInProgress: false
  };

  componentDidMount() {
    this.setState({
      isShow: this.props.isShow,
      isBackUp: this.props.isBackUp || false
    });
  }

  handleConfirmButton = () => {
    this.props[STORE_KEYS.MODALSTORE].onClose();
  };

  handleShowButton = () => {
    this.setState({
      isShow: true
    });
  };

  handleBackUpButton = () => {
    this.setState({
      isBackUp: true
    });
  };

  render() {
    const { isShow, isBackUp, isInProgress } = this.state;

    return (
      <Wrapper>
        <Label>
          <span>
            {!isShow ? (
              <FormattedMessage id="modal.seed_words.label_warning" defaultMessage="WARNING" />
            ) : isBackUp ? (
              <FormattedMessage id="modal.seed_words.label_enter_word" defaultMessage="Enter Your 12-Word Phrase" />
            ) : (
              <FormattedMessage id="modal.seed_words.label_view_word" defaultMessage="View Your 12-Word Phrase" />
            )}
          </span>
        </Label>

        <>
          {!isShow ? (
            <>
              <IconWarning />

              <Heading>
                <FormattedMessage id="modal.seed_words.label_heading" defaultMessage="Show 12-Word Phrase?" />
              </Heading>

              <Text>
                <FormattedMessage
                  id="modal.seed_words.label_text1"
                  defaultMessage="Are you sure you want to show your 12-word phrase?"
                />
                <span>
                  <FormattedMessage
                    id="modal.seed_words.label_text2"
                    defaultMessage="DO NOT give this phrase to anyone. Giving this phrase to anyone may result in the THEFT OF YOUR FUNDS!"
                  />
                </span>
              </Text>

              <GradientButton
                className="negative-solid confirm-button"
                width="100%"
                height="60px"
                disabled={isInProgress}
                onClick={this.handleShowButton}
              >
                {isInProgress ? (
                  <DataLoader />
                ) : (
                  <span className="btn-text">
                    <FormattedMessage id="modal.seed_words.label_show_phrase" defaultMessage="SHOW PHRASE" />
                  </span>
                )}
              </GradientButton>
            </>
          ) : (
            <>
              {/* <Heading>View Your 12-Word Phrase</Heading> */}

              <InputRowWrapper>
                {SEED_WORDS.map((word, idx) => (
                  <WordInputWrapper key={idx}>
                    <NumberWrapper>{word}</NumberWrapper>
                    <InputValueWrapper>
                      <WordInput />
                    </InputValueWrapper>
                  </WordInputWrapper>
                ))}
              </InputRowWrapper>

              <Buttons>
                <GradientButton
                  className="positive-solid confirm-button"
                  width="100%"
                  height="60px"
                  disabled={isInProgress}
                  onClick={this.handleConfirmButton}
                >
                  {isInProgress ? (
                    <DataLoader />
                  ) : (
                    <span className="btn-text">
                      <FormattedMessage
                        id={isBackUp ? 'modal.seed_words.label_restore' : 'modal.seed_words.label_done'}
                        defaultMessage={isBackUp ? 'RESTORE' : 'DONE'}
                      />
                    </span>
                  )}
                </GradientButton>
              </Buttons>
            </>
          )}
        </>
      </Wrapper>
    );
  }
}

export default inject(STORE_KEYS.MODALSTORE, STORE_KEYS.EXCHANGESSTORE)(observer(SeedWordsModal));
