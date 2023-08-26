import { sortBy } from 'lodash';

const isSearched = (item, query, filter) => {
  const symbol = item.symbol || '';
  const name = item.name || '';
  const lowerCaseQuery = query.toLowerCase();

  let filterFlag = true;
  if (filter !== 'All') {
    if (filter === 'Fiat') {
      filterFlag = symbol.includes('F:');
    } else if (filter === 'Stocks') {
      filterFlag = symbol.includes('S:');
    } else if (filter === 'Crypto') {
      filterFlag = !symbol.includes('F:') && !symbol.includes('S:');
    }
  }

  let weight = 9999;
  if (query) {
    const index1 = symbol
      .replace('S:', '')
      .replace('F:', '')
      .toLowerCase()
      .indexOf(lowerCaseQuery);
    if (index1 !== -1) {
      weight = index1;
    } else {
      const index2 = name.toLowerCase().indexOf(lowerCaseQuery);
      if (index2 !== -1) {
        weight = index2 + 100;
      }
    }

    if (!filterFlag) {
      weight += 1000;
    }
  } else {
    if (filterFlag) {
      weight = 0;
    }
  }

  return weight;
};

export const getTableItems = ({ topGroupItems = [], mainItems = [] }, { searchInputValue, filterItem }) => {
  let tableItems = [];

  let searchedTopGroupItemsWeights = [];
  topGroupItems.forEach(item => {
    const weight = isSearched(item, searchInputValue, filterItem);
    if (weight !== 9999) {
      searchedTopGroupItemsWeights.push({
        weight,
        item
      });
    }
  });

  searchedTopGroupItemsWeights = sortBy(searchedTopGroupItemsWeights, item => item.weight);
  tableItems = searchedTopGroupItemsWeights.map(val => val.item);

  let searchedMainItemsWeights = [];
  mainItems.forEach(item => {
    const weight = isSearched(item, searchInputValue, filterItem);
    if (weight !== 9999) {
      if (!topGroupItems.find(({ symbol }) => symbol === item.symbol)) {
        searchedMainItemsWeights.push({
          weight,
          item
        });
      }
    }
  });

  searchedMainItemsWeights = sortBy(searchedMainItemsWeights, item => item.weight);
  tableItems = tableItems.concat(searchedMainItemsWeights.map(val => val.item));

  return tableItems;
};
