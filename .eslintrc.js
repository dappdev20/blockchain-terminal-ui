/**
 * @description
 * Main ESLint config. Most rules are inherited from the `extends` key,
 * but our own overrides live within the `rules` key. Ultimately, the
 * rules that are enforced should add value and consistency to our code -
 * not to inhibit one's ability to get work done and be productive.
 *
 * NOTE: If altering `rules`, leave a small explanation for why the change
 * was made. This config once lived within our package.json, but that
 * restricted us from adding comments to explain certain rules.
 *
 * @see https://eslint.org/docs/user-guide/configuring
 */
module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      modules: true
    }
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', './src']],
        extensions: ['.js', '.jsx', '.json']
      }
    }
  },
  extends: ['airbnb', 'prettier', 'prettier/react'],
  plugins: ['import', 'react-hooks'],
  env: {
    browser: true,
    jest: true
  },
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'arrow-body-style': 0,
    // Often times, API data comes in camel cased, converting to and from all the time is a pain
    // and disabling inline would be insanely verbose. Seek to limit camel cased variables to API
    // data only.
    camelcase: 0,
    'class-methods-use-this': 0,
    //  If all variables in destructuring should be const, this rule warns the variables. Otherwise, ignores them.
    'prefer-const': [
      'error',
      {
        destructuring: 'all'
      }
    ],
    'global-require': 0,
    'import/no-named-as-default': 0,
    'import/no-useless-path-segments': 0,
    'import/prefer-default-export': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/label-has-associated-control': [
      2,
      {
        assert: 'either'
      }
    ],
    'jsx-a11y/label-has-for': 0,
    'linebreak-style': 0,
    // This is perfectly valid syntax...
    'no-plusplus': 0,
    'no-console': 0,
    'no-lonely-if': 0,
    'no-restricted-globals': 1,
    'no-extra-boolean-cast': 0,
    'no-param-reassign': [
      'error',
      {
        props: false
      }
    ],
    'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
    'no-underscore-dangle': 0,
    semi: [2, 'always'],
    // Expressions are extremely useful constructs — especially in JSX
    'no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
        allowTernary: true
      }
    ],
    'no-shadow': 0,
    'no-undef': ['error', { typeof: false }],
    radix: 0,
    'prefer-promise-reject-errors': 0,
    'no-case-declarations': 0,
    'no-param-reassign': ['error', { props: false }],
    // Disabled to allow for defining propTypes/defaultProps above function declaration components
    'no-use-before-define': ['error', { functions: false }],
    'no-useless-escape': 0,
    'no-return-assign': 0,
    'consistent-return': 0,
    'prefer-destructuring': 0,
    'react/destructuring-assignment': 0,
    'react/jsx-boolean-value': 0,
    'react/jsx-filename-extension': 0,
    'react/no-array-index-key': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/label-has-associated-control': 0,
    'react/sort-comp': 0,
    'react/button-has-type': 0,
    'react/prop-types': 0, // TODO: Add props validation in next stage
    'react/forbid-prop-types': 0, // TODO: Add props validation in next stage
    'no-nested-ternary': 0,
    'no-unneeded-ternary': 2,
    'react/jsx-props-no-spreading': 0,
    'react/state-in-constructor': 0,
    'max-classes-per-file': 0
  }
};
