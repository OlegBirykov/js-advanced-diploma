import { calcTileType, calcHealthLevel } from '../utils';

test('position of cell should return', () => {
  expect(calcTileType(0)).toBe('top-left');
  expect(calcTileType(1)).toBe('top');
  expect(calcTileType(7)).toBe('top-right');
  expect(calcTileType(8)).toBe('left');
  expect(calcTileType(9)).toBe('center');
  expect(calcTileType(15)).toBe('right');
  expect(calcTileType(56)).toBe('bottom-left');
  expect(calcTileType(57)).toBe('bottom');
  expect(calcTileType(63)).toBe('bottom-right');
});

test('level of healt should return', () => {
  expect(calcHealthLevel(14)).toBe('critical');
  expect(calcHealthLevel(15)).toBe('normal');
  expect(calcHealthLevel(50)).toBe('high');
});
