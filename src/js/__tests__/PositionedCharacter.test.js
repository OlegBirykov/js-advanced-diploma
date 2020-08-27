import PositionedCharacter from '../characters/PositionedCharacter';
import Character from '../characters/Character';

class Daemon extends Character {
  constructor(level) {
    super(level);
    this.level = level;
  }
}

test('object should be created', () => {
  expect(new PositionedCharacter(new Daemon(1), 25)).toBeDefined();
});

test('object constructor should throw an error', () => {
  const error1 = 'character must be instance of Character or its children';
  const error2 = 'position must be a number';
  expect(() => new PositionedCharacter({ level: 1 }, 25)).toThrow(error1);
  expect(() => new PositionedCharacter(new Daemon(1))).toThrow(error2);
});

test('position number should be converted to coordinates', () => {
  const character = new PositionedCharacter(new Daemon(1), 23);
  expect(character.x).toBe(7);
  expect(character.y).toBe(2);
});

test('coordinates should be converted to position number', () => {
  const character = new PositionedCharacter(new Daemon(1), 0);
  character.x = 4;
  character.y = 2;
  expect(character.position).toBe(20);
});
