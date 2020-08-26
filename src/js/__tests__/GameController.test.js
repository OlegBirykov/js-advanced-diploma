import GamePlay from '../GamePlay';
import GameController from '../GameController';
import GameStateService from '../GameStateService';
import cursors from '../cursors';

jest.mock('../GameStateService');
jest.mock('../GamePlay');

beforeEach(() => {
  jest.resetAllMocks();
});

const gamePlay = new GamePlay();
const stateService = new GameStateService(localStorage);
const gameCtrl = new GameController(gamePlay, stateService);

const gameState = {
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
};

test('event listeners should be added', () => {
  gameCtrl.init();

  expect(gamePlay.addCellClickListener).toBeCalled();
  expect(gamePlay.addCellEnterListener).toBeCalled();
  expect(gamePlay.addCellLeaveListener).toBeCalled();

  expect(gamePlay.addNewGameListener).toBeCalled();
  expect(gamePlay.addLoadGameListener).toBeCalled();
  expect(gamePlay.addSaveGameListener).toBeCalled();
});

test('method should load saved state of game', () => {
  gameCtrl.stateService.load.mockReturnValue(gameState);
  gameCtrl.loadGame();

  expect(gameCtrl.gamerTeam.members[0].character.level).toBe(1);
  expect(gameCtrl.gamerTeam.members[0].character.type).toBe('swordsman');
  expect(gameCtrl.gamerTeam.members[1].character.attack).toBe(25);
  expect(gameCtrl.gamerTeam.members[1].character.defence).toBe(25);
  expect(gameCtrl.gamerTeam.members[1].character.health).toBe(50);
  expect(gameCtrl.gamerTeam.members[1].position).toBe(25);
  expect(gameCtrl.computerTeam.members[0].character.level).toBe(1);
  expect(gameCtrl.computerTeam.members[0].character.type).toBe('vampire');
  expect(gameCtrl.computerTeam.members[1].character.attack).toBe(10);
  expect(gameCtrl.computerTeam.members[1].character.defence).toBe(40);
  expect(gameCtrl.computerTeam.members[1].character.health).toBe(50);
  expect(gameCtrl.computerTeam.members[1].position).toBe(46);
  expect(gameCtrl.level).toBe(1);
  expect(gameCtrl.isGamerStep).toBe(true);
  expect(gameCtrl.score).toBe(0);
  expect(gameCtrl.maxScore).toBe(1350);
});

test('method should show an error when loading fails', () => {
  gameCtrl.stateService.load.mockReturnValue(new Error());
  gameCtrl.loadGame();

  expect(GamePlay.showError).toBeCalledWith('Load state error');
});

test('new game should be created', () => {
  gameState.level = 0;
  gameState.score = 100;
  gameCtrl.stateService.load.mockReturnValue(gameState);
  gameCtrl.loadGame();

  expect(gameCtrl.score).toBe(0);

  gameState.level = 1;
  gameState.score = 0;
});

test('cursor should be selected', () => {
  gameState.isGamerStep = false;
  gameCtrl.stateService.load.mockReturnValue(gameState);
  gameCtrl.loadGame();

  expect(gameCtrl.gamePlay.setCursor).toBeCalledWith(cursors.notallowed);

  gameState.isGamerStep = true;
});

/*

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

*/
