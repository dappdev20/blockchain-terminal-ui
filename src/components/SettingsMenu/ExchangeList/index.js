import React from 'react';
import { Table, Column } from 'react-virtualized';
import sortBy from 'lodash/sortBy';
import isEqual from 'lodash/isEqual';
import { Tooltip } from 'react-tippy';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';
import ReactMarkdown from 'react-markdown';

import { STORE_KEYS } from '@/stores';
import { highlightSearchDom } from '@/utils';
import { animateButton } from '@/utils/CustomControls';
import ExchangeFields from '@/mock/exchange-fields-data';
import { ListItem } from '@/components-generic/SelectDropdown/Components';
import { ExchangesDropdownSearchIcon } from '@/components-generic/SvgIcon';
import { Checkbox, InfoIcon, ApiIcon } from '@/components-generic/Icons';
import ApiKey from './ApiKey';
import { LogoWrapper, Logo, DocumentContentWrapper } from './styles';

import ApiModal from '@/components/Modals/ApiModal';
import document from '@/components/Modals/ApiModal/document';

class ExchangeList extends React.Component {
  state = {
    tableItems: [],
    hoveredIndex: -1,
    selectedExchange: null,
    selectedMenu: null,
    isOpenAPIDocs: false,
    apiDocument: null
  };

  componentDidMount() {
    this.updateTableItems(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.searchValue !== nextProps.searchValue || !isEqual(this.props.items, nextProps.items)) {
      this.updateTableItems(nextProps);
    }
  }

  isSearched = (item, query) => {
    if (!query) {
      return 999;
    }

    const lowerCaseQuery = query.toString().toLowerCase();
    const srcStr = item.name ? (item.name === 'Global' ? 'all' : item.name.toString().toLowerCase()) : '';

    const srcContains = srcStr.includes(lowerCaseQuery);
    const srcWeight = Math.abs(lowerCaseQuery.length - srcStr.length);

    return srcContains ? srcWeight : -1;
  };

  updateTableItems = propsInput => {
    const props = propsInput || this.props;

    let tableItems = [];

    if (props && props.items && props.items.length) {
      const items = props.items;
      for (let i = 0; i < items.length; i++) {
        const weight = this.isSearched(items[i], props.searchValue);

        if (weight >= 0) {
          tableItems.push({
            weight,
            value: items[i]
          });
        }
      }

      tableItems = sortBy(tableItems, item => item.weight).map(item => item.value);

      if (tableItems.filter(item => item.name === 'Global').length === 0) {
        tableItems = [{ name: 'Global' }].concat(tableItems);
      }
    }

    this.setState({
      tableItems
    });
  };

  handleSelectItem = (rowData, status) => () => {
    if (rowData.name === 'Global') return;

    if (rowData.status === 'active') {
      this.props.selectExchangeActive(rowData.name, status);
    }
  };

  handleItemMouseEnter = rowIndex => () => {
    this.setState({
      hoveredIndex: rowIndex
    });
  };

  handleExchangeIconClicked = (rowData, menu) => e => {
    e.stopPropagation();
    this.setState(
      {
        selectedExchange: rowData,
        selectedMenu: menu,
        isOpenAPIDocs: true
      },
      () => this.getApiDocument()
    );

    const { setRightBottomSectionOpenMode } = this.props[STORE_KEYS.VIEWMODESTORE];
    if (menu === 'transaction') {
      setRightBottomSectionOpenMode('reports');
    } else if (menu === 'trading') {
      setRightBottomSectionOpenMode('accounts');
    } else {
      this.props.changeMenu(menu);
    }
    animateButton(menu);
  };

  handleApiKeyClose = () => {
    this.setState({
      selectedExchange: null,
      selectedMenu: null
    });
  };

  closeApiKey = () => {
    this.setState({
      selectedMenu: null,
      isOpenAPIDocs: false
    });
  };

  getApiDocument = () => {
    const pageName = this.state.selectedExchange.name.toLowerCase().replace(/\s+/g, '');
    const page = document[pageName];
    fetch(page)
      .then(response => response.text())
      .then(text => {
        this.setState({ apiDocument: text });
      })
      .catch(e => {
        console.error(e);
      });
  };

  handleCheckClick = (key, value) => () => {
    this.props.setExchangeActive(key, value);
    animateButton(key);
  };

  itemCellRenderer = ({ rowData, rowIndex }) => {
    const { searchValue, exchanges, setExchangeActive } = this.props;
    const { hoveredIndex, selectedExchange, selectedMenu } = this.state;
    let isActive = false;
    let isApiSynced = false;
    let apiKey = null;
    let apiSecret = null;
    if (exchanges && exchanges[rowData.name]) {
      const exchangeValue = exchanges[rowData.name];
      apiKey = exchangeValue && exchangeValue.apiKey;
      apiSecret = exchangeValue && exchangeValue.apiSecret;
      isActive = exchangeValue && exchangeValue.active;
      isApiSynced = exchangeValue && exchangeValue.apiSynced;
    }

    const isGlobal = rowData.name === 'Global';
    const name = rowData.name === 'Global' ? 'Datafeed' : rowData.name;
    const isHovered = rowIndex === hoveredIndex;
    const activeExchange = isGlobal || rowData.status === 'active';

    let apiIcon = (
      <ApiIcon
        marginLeft={15}
        active={selectedMenu === 'api'}
        isApiSynced={isApiSynced}
        onClick={this.handleExchangeIconClicked(rowData, 'api')}
      />
    );

    // Wrap the icon which indicates whether or not an exchange has
    // been connected with a tooltip which shows the obfuscated
    // credentials for this exchange.
    if (apiKey && apiSecret) {
      apiIcon = (
        <Tooltip
          arrow
          animation="shift"
          position="bottom"
          theme="bct"
          title={`Key: ${apiKey}\nSecret: ${apiSecret}`}
          distance={30}
          style={{ marginLeft: 15 }}
        >
          {apiIcon}
        </Tooltip>
      );
    }

    const SearchComponent = this.props.searchComponent;

    return (
      <ListItem
        className={`exchange-item${activeExchange ? '' : ' disabled'}`}
        onClick={this.handleSelectItem(rowData, !isActive)}
      >
        {isGlobal ? (
          <ExchangesDropdownSearchIcon />
        ) : (
          <LogoWrapper size={28}>
            <Logo src={`/img/exchange/${rowData.icon}`} alt="" />
          </LogoWrapper>
        )}

        {!isGlobal && <div className="exchange-item-name">{highlightSearchDom(name, searchValue)}</div>}

        {isGlobal && <SearchComponent />}

        {!isHovered && !isGlobal && ExchangeFields[rowData.name] && !isApiSynced && (
          <InfoIcon marginLeft={15} onMouseEnter={this.handleItemMouseEnter(rowIndex)} />
        )}

        {((isHovered && !isGlobal) || isApiSynced) && (
          <div className="exchange-action">{ExchangeFields[rowData.name] && apiIcon}</div>
        )}

        {activeExchange && setExchangeActive && (
          <div
            className="api-link"
            role="button"
            tabIndex={0}
            onClick={e => {
              e.stopPropagation();
            }}
          >
            <Checkbox
              size={20}
              active={isActive}
              id={rowData.name}
              onClick={this.handleCheckClick(rowData.name, !isActive)}
            />
          </div>
        )}

        {selectedMenu === 'api' && ExchangeFields[selectedExchange.name] && selectedExchange.name === rowData.name && (
          <ApiKey
            hasAPIKey={!!apiKey}
            selectedExchange={selectedExchange}
            onClick={e => {
              e.stopPropagation();
              animateButton('api');
            }}
            onCloseHandler={this.handleApiKeyClose}
            closeApiKey={this.closeApiKey}
          />
        )}
      </ListItem>
    );
  };

  render() {
    const { tableItems, isOpenAPIDocs } = this.state;
    const { scrollTop, width, height, rowHeight, headerHeight, expanded, isOpened } = this.props;
    return (
      <>
        {isOpened && isOpenAPIDocs && expanded && (
          <ApiModal>
            <DocumentContentWrapper>
              <ReactMarkdown source={this.state.apiDocument} className="api-modal" />
            </DocumentContentWrapper>
          </ApiModal>
        )}
        <Table
          autoHeight
          width={width}
          height={height}
          headerHeight={headerHeight}
          disableHeader
          rowCount={tableItems.length}
          rowGetter={({ index }) => tableItems[index]}
          rowHeight={rowHeight}
          overscanRowCount={0}
          scrollTop={scrollTop}
        >
          <Column width={width} dataKey="Dropdown" cellRenderer={this.itemCellRenderer} />
        </Table>
      </>
    );
  }
}

export default compose(
  inject(STORE_KEYS.VIEWMODESTORE),
  observer
)(ExchangeList);
