import Character from '../Character';

class Daemon extends Character {
  constructor(level) {
    super(level);
    this.level = level;
  }
}

test('object of class Character should not be created', () => {
  expect(() => new Character(1, 'daemon')).toThrow('creating an object of this class is not allowed');
});

test('object of inherited class should be created', () => {
  expect(new Daemon(1)).toBeDefined();
});

test('attack and defence should be rounded', () => {
  const daemon = new Daemon(1);
  daemon.attack = 67.92;
  daemon.defence = 58.49;
  expect(daemon.attack).toBe(68);
  expect(daemon.defence).toBe(58);
});
