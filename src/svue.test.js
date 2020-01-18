import { getParamNames } from "./svue";

function add(a, b) { }

const sum = (a, b) => { };

const shortArrow = a => { };

const shortArrowDeceiving = a => b => a + b;

const deceiving = a => a.map(b => async () => { });

test('param names works', () => {
  expect(getParamNames(add)).toStrictEqual(['a', 'b']);
  expect(getParamNames(sum)).toStrictEqual(['a', 'b']);
  expect(getParamNames(shortArrow)).toStrictEqual(['a']);
  expect(getParamNames(shortArrowDeceiving)).toStrictEqual(['a']);
  expect(getParamNames(deceiving)).toStrictEqual(['a']);
});
