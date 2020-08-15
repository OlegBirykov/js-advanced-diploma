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
    yield { Type, level: Math.trunc(Math.random() * maxLevel) + 1 };
  }
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const result = [];
  const generator = [...characterGenerator(allowedTypes, maxLevel)];
  for (let i = 0; i < characterCount; i++) {
    const { Type, level } = generator[Math.trunc(Math.random() * generator.length)];
    result.push(new PositionedCharacter(new Type(level), -1));
  }
  return result;
}
