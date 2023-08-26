const path = require('path');
const { override, useEslintRc, addWebpackResolve, useBabelRc } = require('customize-cra');

module.exports = override(
    useEslintRc(),
    useBabelRc(),
    addWebpackResolve({
        alias: {
            '@': path.resolve('src/')
        }
    })
);
