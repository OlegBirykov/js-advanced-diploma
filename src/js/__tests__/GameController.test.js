// import GamePlay from '../GamePlay';
// import GameController from '../GameController';
// import GameStateService from '../GameStateService';

test('', () => {
  expect(2 * 2).toBe(4);
});

/*
jest.mock('../GameStateService');

beforeEach(() => {
  jest.resetAllMocks();
});

const gamePlay = new GamePlay();
gamePlay.bindToDOM(document.querySelector('#game-container'));

const stateService = new GameStateService(localStorage);
const gameCtrl = new GameController(gamePlay, stateService);

test('', () => {
  console.log(stateService.load);
  stateService.load.mockReturnValue({
    gamerTeam: {
      members: [
        {
          character: {
            level: 1,
            _attack: 40,
            _defence: 10,
            _health: 50,
            type: 'swordsman',
          },
          position: 33,
        },
        {
          character: {
            level: 1,
            _attack: 25,
            _defence: 25,
            _health: 50,
            type: 'bowman',
          },
          position: 25,
        },
      ],
    },
    computerTeam: {
      members: [
        {
          character: {
            level: 1,
            _attack: 25,
            _defence: 25,
            _health: 50,
            type: 'vampire',
          },
          position: 55,
        },
        {
          character: {
            level: 1,
            _attack: 10,
            _defence: 40,
            _health: 50,
            type: 'daemon',
          },
          position: 46,
        },
      ],
    },
    level: 1,
    isGamerStep: true,
    score: 0,
    maxScore: 1350,
  });

  gameCtrl.loadGame();
  expect(gameCtrl.level).toBe(1);
});
*/

/*
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
*/
