import React from 'react';

import { withSafeTimeout } from '@hocs/safe-timers';
import PopUp from '@/components-generic/PopUp';
import { Wrapper } from '@/components-generic/Wrappers';
import privacyPolicy from './privacy-policy.md';
import termsOfUse from './terms-of-use.md';
import Modal from './Modal';
import { CONTENT_STYLE } from './styles';

const pages = {};

class TermsModal extends React.Component {
  state = {
    isOpen: true,
    pageId: null,
    text: '',
    isLoading: true
  };

  componentDidMount() {
    if (pages[this.props.pageId]) {
      this.setState({
        text: pages[this.props.pageId],
        isLoading: false,
        pageId: this.props.pageId
      });
    } else {
      this.loadPage(this.props.pageId);
    }
  }

  componentDidUpdate() {
    if (pages[this.props.pageId]) {
      if (this.props.pageId !== this.state.pageId) {
        // eslint-disable-next-line
        this.setState({
          text: pages[this.props.pageId],
          isLoading: false,
          pageId: this.props.pageId
        });
      }
    } else {
      this.loadPage(this.props.pageId);
    }
  }

  loadPage = pageId => {
    let page;
    if (pageId === 'privacy-policy') {
      page = privacyPolicy;
    } else if (pageId === 'terms-of-use') {
      page = termsOfUse;
    }
    fetch(page)
      .then(response => response.text())
      .then(text => {
        this.setState({
          text,
          isLoading: false,
          pageId
        });
        pages[pageId] = text;
      })
      .catch(e => {
        console.error(e);
        this.setState({
          isLoading: false
        });
      });
  };

  handleClose = () => {
    const { toggleModal, setSafeTimeout } = this.props;
    this.setState({ isOpen: false }, () => {
      setSafeTimeout(() => {
        toggleModal();
      }, 500);
    });
  };

  render() {
    const { isOpen, text, isLoading } = this.state;
    return (
      <PopUp fixed contentStyle={CONTENT_STYLE} open={isOpen} onClose={this.handleClose}>
        <Wrapper>
          <Modal toggleModal={this.handleClose} text={text} isLoading={isLoading} />
        </Wrapper>
      </PopUp>
    );
  }
}

export default withSafeTimeout(TermsModal);
