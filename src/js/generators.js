/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */

import PositionedCharacter from './PositionedCharacter';

export function* characterGenerator(allowedTypes, maxLevel) {
  for (const Type of allowedTypes) {
    yield new Type(Math.trunc(Math.random() * maxLevel) + 1);
  }
}

export function generateTeam(allowedTypes, maxLevel, characterCount, boardSize) {
  const result = [];
  const generator = [...characterGenerator(allowedTypes, maxLevel)];
  for (let i = 0; i < characterCount; i++) {
    const character = generator[Math.trunc(Math.random() * generator.length)];
    result.push(new PositionedCharacter(character, -1, boardSize));
  }
  return result;
}
