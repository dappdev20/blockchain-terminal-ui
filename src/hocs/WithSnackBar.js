import { inject } from 'mobx-react';
import { compose } from 'recompose';
import { STORE_KEYS } from '../stores';

const { SNACKBARSTORE: SNACKBAR_STORE_KEY } = STORE_KEYS;
export const withSnackBar = compose(
  inject(stores => ({
    snackbar: stores[SNACKBAR_STORE_KEY]
  }))
);
