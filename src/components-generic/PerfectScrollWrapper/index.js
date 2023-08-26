import React from 'react';
import styled from 'styled-components/macro';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { withSafeTimeout } from '@hocs/safe-timers';

const StyleWrapper = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  width: 100%;
  height: 100%;
  overflow: hidden; //For Firefox

  .custom-ps-wrapper {
    width: 100%;
    height: 100%; //For Firefox
  }

  .ps__rail-y {
    background: ${props => props.theme.palette.clrBackground} !important;
  }

  .ps__rail-x {
    display: none !important;
  }
`;

class PerfectScrollWrapper extends React.PureComponent {
  perfectScrollRef = null;

  state = {
    isScrollTopVisible: false
  };

  clearHandleScrollTopTimeout = null;

  handleScrollReachedStart = () => {
    this.setState({
      isScrollTopVisible: false
    });
  };

  handleScrollY = ({ scrollTop }) => {
    this.setState({
      isScrollTopVisible: !!scrollTop
    });
  };

  handleScrollTop = (duration = 300) => {
    const difference = this.perfectScrollRef.scrollTop;
    const perTick = (difference / duration) * 10;

    if (this.clearHandleScrollTopTimeout) {
      this.clearHandleScrollTopTimeout();
    }
    this.clearHandleScrollTopTimeout = this.props.setSafeTimeout(() => {
      this.perfectScrollRef.scrollTop = this.perfectScrollRef.scrollTop - perTick;
      if (this.perfectScrollRef.scrollTop === 0) {
        return;
      }
      this.handleScrollTop(duration - 10);
    }, 10);
  };

  render() {
    const { scrollTop } = this.props;
    const { isScrollTopVisible } = this.state;

    return (
      <StyleWrapper>
        {scrollTop !== false && (
          <div
            className={`scroll__scrollup ${isScrollTopVisible ? '' : 'hide'}`}
            onClick={() => this.handleScrollTop(300)}
            role="button"
            tabIndex={0}
          >
            <button className="scroll-up-button">
              <svg className="sprite-icon" role="img" aria-hidden="true">
                <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="img/sprite-basic.svg#arrow-up" />
              </svg>
            </button>
          </div>
        )}
        <div className="custom-ps-wrapper">
          <PerfectScrollbar
            containerRef={element => {
              this.perfectScrollRef = element;
            }}
            onYReachStart={this.handleScrollReachedStart}
            onScrollY={this.handleScrollY}
            options={{ minScrollbarLength: 40, maxScrollbarLength: 60 }}
          >
            {this.props.children}
          </PerfectScrollbar>
        </div>
      </StyleWrapper>
    );
  }
}

export default withSafeTimeout(PerfectScrollWrapper);
