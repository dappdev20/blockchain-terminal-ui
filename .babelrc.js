// we can't use config-overrides.js to customize .babelrc
// because any custom plugins won't be added when NODE_ENV=test
// The solution is to use `useBabelRc` https://github.com/arackaf/customize-cra#usebabelrc-1
// and customize plugins based on the env variables
const babelConfig = {
    "presets": ["babel-preset-react-app"],
    "plugins": [["@babel/plugin-proposal-decorators", { "legacy": true }]],
};

// to expose __coverage__ for the "yarn start:coverage" build
if (process.env.COVERAGE) {
    babelConfig.plugins.push(['istanbul']);
}
 
module.exports = babelConfig;
