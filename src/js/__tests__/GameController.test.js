import GamePlay from '../ui/GamePlay';
import GameController from '../api/GameController';
import GameStateService from '../api/GameStateService';
import cursors from '../ui/cursors';

jest.mock('../api/GameStateService');
jest.mock('../ui/GamePlay');

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

test('method should upgrade existing characters', () => {
  gameCtrl.stateService.load.mockReturnValue(gameState);
  gameCtrl.loadGame();

  gameCtrl.levelUp();

  expect(gameCtrl.gamerTeam.members[1].character.attack).toBe(33);
  expect(gameCtrl.gamerTeam.members[1].character.defence).toBe(33);
});

test('method should create new characters', () => {
  gameCtrl.stateService.load.mockReturnValue(gameState);
  gameCtrl.loadGame();

  expect(gameCtrl.gamerTeam.size).toBe(2);

  gameCtrl.levelUp();
  expect(gameCtrl.gamerTeam.size).toBe(3);

  gameCtrl.levelUp();
  expect(gameCtrl.gamerTeam.size).toBe(5);

  gameCtrl.levelUp();
  expect(gameCtrl.gamerTeam.size).toBe(7);
});

test('character should move', async () => {
  gameCtrl.stateService.load.mockReturnValue(gameState);
  gameCtrl.loadGame();

  gameCtrl.selectedCharacterIndex = 33;
  gameCtrl.targetColor = 'green';

  gameCtrl.isGamerStep = false;
  await gameCtrl.onCellClick(35);
  expect(gameCtrl.gamerTeam.members[0].position).toBe(33);

  gameCtrl.isGamerStep = true;
  await gameCtrl.onCellClick(35);
  expect(gameCtrl.gamerTeam.members[0].position).toBe(35);
});

test('character should do damage', async () => {
  gameCtrl.stateService.load.mockReturnValue(gameState);
  gameCtrl.loadGame();

  gameCtrl.selectedCharacterIndex = 33;
  gameCtrl.targetColor = 'red';
  gameCtrl.computerTeam.members[1].position = 34;

  await gameCtrl.onCellClick(34);
  expect(gameCtrl.computerTeam.members[1].character.health).toBe(46);

  gameCtrl.selectedCharacterIndex = 33;
  gameCtrl.targetColor = 'red';
  gameCtrl.computerTeam.members[1].character.health = 2;
  gameCtrl.isGamerStep = true;

  await gameCtrl.onCellClick(34);
  expect(gameCtrl.computerTeam.size).toBe(1);
});

test('level should be completed', async () => {
  gameCtrl.stateService.load.mockReturnValue(gameState);
  gameCtrl.loadGame();

  gameCtrl.selectedCharacterIndex = 33;
  gameCtrl.targetColor = 'red';
  gameCtrl.computerTeam.members[1].character.health = 2;
  gameCtrl.computerTeam.members[1].position = 34;

  gameCtrl.computerTeam.members.shift();

  gameCtrl.maxScore = 90;

  await gameCtrl.onCellClick(34);
  expect(gameCtrl.level).toBe(2);
  expect(gameCtrl.maxScore).toBe(100);
});

test('fourth level should be last', async () => {
  gameCtrl.stateService.load.mockReturnValue(gameState);
  gameCtrl.loadGame();

  gameCtrl.selectedCharacterIndex = 33;
  gameCtrl.targetColor = 'red';
  gameCtrl.computerTeam.members[1].character.health = 2;
  gameCtrl.computerTeam.members[1].position = 34;

  gameCtrl.computerTeam.members.shift();

  gameCtrl.level = 4;

  await gameCtrl.onCellClick(34);
  expect(gameCtrl.level).toBe(4);
  expect(gameCtrl.gamerTeam.size).toBe(0);
});

test('only character of gamer should be selected', async () => {
  gameCtrl.stateService.load.mockReturnValue(gameState);
  gameCtrl.loadGame();

  gameCtrl.selectedCharacterIndex = null;
  gameCtrl.targetColor = 'yellow';

  await gameCtrl.onCellClick(33);
  expect(gameCtrl.selectedCharacterIndex).toBe(33);

  await gameCtrl.onCellClick(32);
  expect(gameCtrl.selectedCharacterIndex).toBe(33);

  await gameCtrl.onCellClick(25);
  expect(gameCtrl.gamePlay.deselectCell).toBeCalledWith(33);
  expect(gameCtrl.selectedCharacterIndex).toBe(25);

  await gameCtrl.onCellClick(55);
  expect(GamePlay.showError).toBeCalledWith('This character is disable for selection');
});
