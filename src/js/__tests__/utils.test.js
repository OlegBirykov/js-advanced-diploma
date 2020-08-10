import { calcTileType, calcHealthLevel } from '../utils';

test('position of cell should return', () => {
  expect(calcTileType(0, 7)).toBe('top-left');
  expect(calcTileType(1, 7)).toBe('top');
  expect(calcTileType(6, 7)).toBe('top-right');
  expect(calcTileType(7, 7)).toBe('left');
  expect(calcTileType(8, 7)).toBe('center');
  expect(calcTileType(13, 7)).toBe('right');
  expect(calcTileType(42, 7)).toBe('bottom-left');
  expect(calcTileType(43, 7)).toBe('bottom');
  expect(calcTileType(48, 7)).toBe('bottom-right');
});

test('level of healt should return', () => {
  expect(calcHealthLevel(14)).toBe('critical');
  expect(calcHealthLevel(15)).toBe('normal');
  expect(calcHealthLevel(50)).toBe('high');
});
