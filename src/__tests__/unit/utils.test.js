import {
    splitAmtOnDecimal,
} from 'utils';

describe('splitAmtOnDecimal fcn works as intended', () => {
    it('fcn returns an array of length 2; each filled with strings', () => {
        expect(typeof splitAmtOnDecimal(1.454)[0]).toEqual('string');
        expect(typeof splitAmtOnDecimal(1.454)[1]).toEqual('string');
    });

    it('Splits floating number into before and after decimal', () => {
        expect(splitAmtOnDecimal(1.454)).toEqual(['1', '454']);
    });

    it('splits whole numbers into [someval, emptyString]', () => {
        expect(splitAmtOnDecimal(1.0)).toEqual(['1', '']);
    });

    it('Splits float correctly when < 1 but > 0', () => {
        expect(splitAmtOnDecimal(0.1223)).toEqual(['0', '1223']);
    });

    it('Splits float correctly when is 0', () => {
        expect(splitAmtOnDecimal(0)).toEqual(['0', '']);
        expect(splitAmtOnDecimal(0.0)).toEqual(['0', '']);
    });
});
