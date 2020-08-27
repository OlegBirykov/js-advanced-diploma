import PositionedCharacter from './PositionedCharacter';

export function* characterGenerator(allowedTypes, maxLevel, characterCount) {
  for (let i = 0; i < characterCount; i++) {
    yield new allowedTypes[Math.trunc(Math.random() * allowedTypes.length)](
      Math.trunc(Math.random() * maxLevel) + 1,
    );
  }
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const result = [];
  const generator = characterGenerator(allowedTypes, maxLevel, characterCount);
  for (const character of generator) {
    result.push(new PositionedCharacter(character, -1));
  }
  return result;
}
