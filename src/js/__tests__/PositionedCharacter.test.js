import PositionedCharacter from '../PositionedCharacter';
import Character from '../Character';

class Daemon extends Character {
  constructor(level) {
    super(level);
    this.level = level;
  }
}

test('object should be created', () => {
  expect(new PositionedCharacter(new Daemon(1), 25, 8)).toBeDefined();
});

test('object constructor should throw an error', () => {
  const error1 = 'character must be instance of Character or its children';
  const error2 = 'position must be a number';
  const error3 = 'boardSize must be a number';
  expect(() => new PositionedCharacter({ level: 1 }, 25, 8)).toThrow(error1);
  expect(() => new PositionedCharacter(new Daemon(1), null, 8)).toThrow(error2);
  expect(() => new PositionedCharacter(new Daemon(1), 25)).toThrow(error3);
});

test('position number should be converted to coordinates', () => {
  const character = new PositionedCharacter(new Daemon(1), 23, 7);
  expect(character.x).toBe(2);
  expect(character.y).toBe(3);
});

test('coordinates should be converted to position number', () => {
  const character = new PositionedCharacter(new Daemon(1), 0, 5);
  character.x = 4;
  character.y = 2;
  expect(character.position).toBe(14);
});
