import { Builder } from 'selenium-webdriver';
import libCoverage from 'istanbul-lib-coverage';
const fs = require('fs');

jest.setTimeout(30000);

it('report code coverage after end-to-end testing', async () => {
    // Go to site
    const builder = new Builder();
    const driver = builder.forBrowser('chrome').build();
    await driver.get('https://dev.bct.trade');

    // A real test would do more here of course

    // Collect coverage data and report it
    const __coverage__ = await driver.executeScript('return __coverage__;');

    // Write coverage to `.nyc_output` folder in root
    // This can be used to generate coverage reports ( such as HTML )
    const outputFolder = __dirname + '/../../../.nyc_output';
    // Check if the directory exist, if not, create it.
    if (!fs.existsSync(outputFolder)){
        fs.mkdirSync(outputFolder);
    }

    fs.writeFileSync(outputFolder + '/out.json', JSON.stringify(__coverage__));

    const map = libCoverage.createCoverageMap(__coverage__);
    let result = '';
    map.files().forEach(function(f) {
        var fc = map.fileCoverageFor(f);
        result += `${fc.computeSimpleTotals('s').pct + '%'} for ${f}\n`;
    });
    console.log(result);

    await driver.quit();
});
