import { partitionBuysSells, getInnerQuartileRangeOrders } from '../../../../stores/utils/storeUtils';

const AllOrders = [
    [0.05598, 38.5353, 'Sell'],
    [0.05602, 38.2899, 'Sell'],
    [0.05607, 31.6107, 'Sell'],
    [0.05613, 4.58, 'Sell'],
    [0.05616, 5.348332, 'Sell'],
    [0.05618, 48.983591, 'Sell'],
    [0.05619, 0.375525, 'Sell'],
    [0.05621, 0.509501, 'Sell'],
    [0.05622, 0.45, 'Sell'],
    [0.05623, 33.1087, 'Sell'],
    [0.05625, 15, 'Sell'],
    [0.0564, 0.725636, 'Sell'],
    [0.05641, 2.08, 'Sell'],
    [0.05644, 0.527551, 'Sell'],
    [0.05645, 3.301883, 'Sell'],
    [0.05646, 1.075877, 'Sell'],
    [0.05647, 5.355121, 'Sell'],
    [0.05648, 16.56485, 'Sell'],
    [0.05649, 137.467738, 'Sell'],
    [0.0565, 267.503401, 'Sell'],
    [0.05651, 12.183912, 'Sell'],
    [0.05652, 131.170038, 'Sell'],
    [0.05653, 27.440091, 'Sell'],
    [0.05654, 11.658855, 'Sell'],
    [0.05655, 198.709572, 'Sell'],
    [0.05656, 48.414833, 'Sell'],
    [0.05657, 337.265529, 'Sell'],
    [0.05658, 117.590932, 'Sell'],
    [0.05659, 111.579327, 'Sell'],
    [0.0566, 144.119634, 'Sell'],
    [0.05661, 166.945563, 'Sell'],
    [0.05662, 60.917347, 'Sell'],
    [0.05801, 3.200578, 'Buy'],
    [0.058, 0.519333, 'Buy'],
    [0.05793, 0.010132, 'Buy'],
    [0.05791, 0.141181, 'Buy'],
    [0.05783, 0.011197, 'Buy'],
    [0.0572, 0.004032, 'Buy'],
    [0.057, 2.316119, 'Buy'],
    [0.05689, 0.006344, 'Buy'],
    [0.05669, 0.23, 'Buy'],
    [0.05668, 0.018, 'Buy'],
    [0.05665, 0.012, 'Buy'],
    [0.05663, 0.1, 'Buy'],
    [0.05662, 0.067, 'Buy'],
    [0.05659, 0.0036, 'Buy'],
    [0.05658, 30, 'Buy'],
    [0.05656, 14.213778, 'Buy'],
    [0.05651, 6, 'Buy'],
    [0.0565, 6.5051, 'Buy'],
    [0.05649, 3.577169, 'Buy'],
    [0.05646, 2.645, 'Buy'],
    [0.05645, 0.575161, 'Buy'],
    [0.05644, 5.544292, 'Buy'],
    [0.05643, 12.69, 'Buy'],
    [0.05642, 0.106895, 'Buy'],
    [0.05641, 4.590461, 'Buy'],
    [0.0564, 52.604524, 'Buy'],
    [0.05639, 87.890628, 'Buy'],
    [0.05638, 42.867022, 'Buy'],
    [0.05637, 196.489507, 'Buy'],
    [0.05636, 116.937606, 'Buy'],
    [0.05635, 243.82495, 'Buy'],
    [0.05634, 57.615363, 'Buy'],
    [0.05633, 134.618913, 'Buy'],
    [0.05632, 571.805039, 'Buy'],
    [0.05631, 162.867853, 'Buy'],
    [0.0563, 2.692719, 'Buy'],
    [0.05625, 0.088887, 'Buy']
];

describe('test', () => {
    //sort order is tested in each new function as the wrong sort in any function can break the chart

    test('IQR function returns the same Snapshot', () => {
        const iqr = getInnerQuartileRangeOrders(AllOrders);
        expect(iqr).toMatchSnapshot();
    });

    test('Data is partitioned back into orignal order buy and sells', () => {
        const iqr = getInnerQuartileRangeOrders(AllOrders);
        const [buys, sells] = partitionBuysSells(iqr, 'Buy', 'Sell');

        expect(buys.every(buyTriplet => buyTriplet[2] === 'Buy')).toBe(true);

        buys.forEach((buyTriplet, idx) => {
            if (idx > 0) {
                expect(buyTriplet[0]).toBeLessThanOrEqual(buys[idx - 1][0]);
            }
        });

        expect(sells.every(sellTriplet => sellTriplet[2] === 'Sell')).toBe(true);

        sells.forEach((sellTriplet, idx) => {
            if (idx > 0) {
                expect(sellTriplet[0]).toBeGreaterThanOrEqual(sells[idx - 1][0]);
            }
        });
    });
});
