import React, { Component } from 'react';
import { AutoSizer } from 'react-virtualized';
import PerfectScrollbar from 'react-perfect-scrollbar';

import { withOrderFormToggleData } from '@/hocs/OrderFormToggleData';
import ExchangeList from './ExchangeList';
import { IconWrapper, DropdownFullHeight, ItemList, ListStyleWrapper } from './Components';

class ExchangeListComponent extends Component {
  wrapperRef = null;
  perfectScrollRef = null;

  state = {
    scrollTop: 0
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = event => {
    const { isFromOrderBook, toggleExchangeViewMode } = this.props;

    if (
      this.state.isOpen &&
      this.wrapperRef &&
      this.wrapperRef.contains &&
      !this.wrapperRef.contains(event.target) &&
      !this.props.isApiKeyModalOpened
    ) {
      this.setState({
        isOpen: false
      });
    }
    if (
      isFromOrderBook &&
      this.wrapperRef &&
      this.wrapperRef.contains &&
      !this.wrapperRef.contains(event.target) &&
      !this.props.isApiKeyModalOpened
    ) {
      toggleExchangeViewMode();
    }
  };

  toggleDropDown = isOpen => {
    this.setState(prevState => ({
      isOpen: typeof isOpen === 'boolean' ? isOpen : !prevState.isOpen
    }));

    setTimeout(() => {
      if (this.state.isOpen) {
        this.handleScroll({ scrollTop: 0 });
        this.forceUpdate();
      }
    });
  };

  handleScroll = ({ scrollTop }) => {
    this.setState({ scrollTop });
  };

  changeMenu = menu => {
    this.setState({ selectedMenu: menu });
  };

  scrollTop = (duration = 300) => {
    const difference = this.perfectScrollRef.scrollTop || 0;
    const perTick = (difference / duration) * 10;

    setTimeout(() => {
      if (!this.perfectScrollRef) {
        return;
      }
      this.perfectScrollRef.scrollTop = this.perfectScrollRef.scrollTop - perTick;
      if (this.perfectScrollRef.scrollTop === 0) {
        return;
      }
      this.scrollTop(duration - 10);
    }, 10);
  };

  leaveMenu = () => {
    this.setState({ selectedMenu: null });
  };

  selectExActive = (exch, status) => {
    this.props.setExchangeActive(exch, status);
    this.setState({ isOpen: false });
  };

  render() {
    const { marketExchanges, exchanges } = this.props;

    const { scrollTop, selectedMenu } = this.state;

    let items = [
      {
        name: 'Global'
      }
    ];
    items = items.concat(marketExchanges);

    const isShowingHeaderRow = selectedMenu === 'transaction' || selectedMenu === 'trading';

    return (
      <IconWrapper ref={ref => (this.wrapperRef = ref)} className="exchange-wrapper">
        <DropdownFullHeight alignRight width={this.props.width} height={this.props.height}>
          <ItemList>
            <div
              className={`scroll__scrollup ${scrollTop ? '' : ' hide'}`}
              role="button"
              tabIndex={0}
              onClick={() => this.scrollTop(300)}
            >
              <button className="scroll-up-button">
                <svg className="sprite-icon" role="img" aria-hidden="true">
                  <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="img/sprite-basic.svg#arrow-up" />
                </svg>
              </button>
            </div>
            <AutoSizer>
              {({ width, height }) => (
                <ListStyleWrapper width={this.props.width || width + 2} height={this.props.height - 62 || height + 10}>
                  <PerfectScrollbar
                    containerRef={element => {
                      this.perfectScrollRef = element;
                    }}
                    options={{
                      suppressScrollX: true,
                      minScrollbarLength: 50
                    }}
                    onScrollY={this.handleScroll}
                  >
                    <ExchangeList
                      width={this.props.width || width}
                      height={this.props.height || height - (isShowingHeaderRow ? 60 : 0)}
                      rowHeight={60}
                      headerHeight={60}
                      searchValue={this.props.searchValue}
                      scrollTop={scrollTop}
                      items={items}
                      exchanges={exchanges}
                      setExchangeActive={this.props.setExchangeActive}
                      selectExchangeActive={this.selectExActive}
                      toggleDropDown={this.toggleDropDown}
                      toggleMenu={this.toggleMenu}
                      leaveMenu={this.leaveMenu}
                      changeMenu={this.changeMenu}
                      searchComponent={this.props.searchComponent}
                      className="settings-exchange-list"
                      expanded={this.props.expanded}
                      isOpened={this.props.isOpened}
                    />
                  </PerfectScrollbar>
                </ListStyleWrapper>
              )}
            </AutoSizer>
          </ItemList>
        </DropdownFullHeight>
      </IconWrapper>
    );
  }
}

export default withOrderFormToggleData()(ExchangeListComponent);
