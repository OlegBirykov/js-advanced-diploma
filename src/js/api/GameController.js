import themes from '../ui/themes';
import Team from '../characters/Team';
import Bowman from '../characters/classes/Bowman';
import Swordsman from '../characters/classes/Swordsman';
import Magician from '../characters/classes/Magician';
import Vampire from '../characters/classes/Vampire';
import Undead from '../characters/classes/Undead';
import Daemon from '../characters/classes/Daemon';
import PositionedCharacter from '../characters/PositionedCharacter';
import GameState from './GameState';
import GamePlay from '../ui/GamePlay';
import cursor from '../ui/cursors';
import { boardSize } from '../ui/utils';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;

    this.gamerTeam = new Team();
    this.computerTeam = new Team();
    this.score = 0;
    this.maxScore = 0;
    this.isGamerStep = true;
    this.level = 0;

    this.gamerPos = new Set();
    this.computerPos = new Set();

    this.selectedCharacterIndex = null;
    this.targetIndex = null;
    this.targetColor = 'yellow';
  }

  init() {
    this.gamePlay.addCellClickListener((index) => this.onCellClick(index));
    this.gamePlay.addCellEnterListener((index) => this.onCellEnter(index));
    this.gamePlay.addCellLeaveListener((index) => this.onCellLeave(index));

    this.gamePlay.addNewGameListener(() => this.newGame());
    this.gamePlay.addLoadGameListener(() => this.loadGame());
    this.gamePlay.addSaveGameListener(() => this.saveGame());

    window.addEventListener('unload', () => this.saveGame());

    this.loadGame();
  }

  newGame() {
    this.gamerTeam.members = [];
    this.computerTeam.members = [];
    this.score = 0;
    this.isGamerStep = true;
    this.level = 0;

    this.selectedCharacterIndex = null;
    this.targetIndex = null;
    this.targetColor = 'yellow';

    this.levelUp();
    this.saveGame();
  }

  loadGame() {
    try {
      const {
        gamerTeam,
        computerTeam,
        level: shareLevel,
        isGamerStep,
        score,
        maxScore,
      } = this.stateService.load();

      this.gamerTeam.members = [];
      this.computerTeam.members = [];

      const Classes = {
        bowman: Bowman,
        swordsman: Swordsman,
        magician: Magician,
        vampire: Vampire,
        undead: Undead,
        daemon: Daemon,
      };

      gamerTeam.members.forEach((item, index) => {
        const {
          character: {
            level, _attack: attack, _defence: defence, _health: health, type,
          },
          position,
        } = item;
        this.gamerTeam.members.push(new PositionedCharacter(new Classes[type](level), position));
        this.gamerTeam.members[index].character.attack = attack;
        this.gamerTeam.members[index].character.defence = defence;
        this.gamerTeam.members[index].character.health = health;
      });

      computerTeam.members.forEach((item, index) => {
        const {
          character: {
            level, _attack: attack, _defence: defence, _health: health, type,
          },
          position,
        } = item;
        this.computerTeam.members.push(new PositionedCharacter(new Classes[type](level), position));
        this.computerTeam.members[index].character.attack = attack;
        this.computerTeam.members[index].character.defence = defence;
        this.computerTeam.members[index].character.health = health;
      });

      this.level = shareLevel;
      this.isGamerStep = isGamerStep;
      this.score = score;
      this.maxScore = maxScore;
    } catch (err) {
      GamePlay.showError('Load state error');
      this.newGame();
      return;
    }

    if (!this.level) {
      this.newGame();
      return;
    }

    this.selectedCharacterIndex = null;
    this.targetIndex = null;
    this.targetColor = 'yellow';

    this.gamePlay.drawUi(themes[this.level]);
    this.redraw();

    if (!this.isGamerStep && this.computerTeam.size) {
      this.gamePlay.setCursor(cursor.notallowed);
      setTimeout(() => this.computerStep(), 300);
    } else {
      this.gamePlay.setCursor(cursor.auto);
    }
  }

  saveGame() {
    this.stateService.save(GameState.from(this));
  }

  levelUp() {
    this.level++;
    this.gamePlay.drawUi(themes[this.level]);
    this.gamePlay.setCursor(cursor.auto);

    if (this.level > 1) {
      this.gamerTeam.upgrade();
    }

    switch (this.level) {
      case 1:
        this.gamerTeam.addCharacters([Bowman, Swordsman], 1, 2);
        this.computerTeam.addCharacters([Vampire, Undead, Daemon], 1, 2);
        break;
      case 2:
        this.gamerTeam.addCharacters([Bowman, Swordsman, Magician], 1, 1);
        this.computerTeam.addCharacters([Vampire, Undead, Daemon], 2, this.gamerTeam.size);
        break;
      case 3:
        this.gamerTeam.addCharacters([Bowman, Swordsman, Magician], 2, 2);
        this.computerTeam.addCharacters([Vampire, Undead, Daemon], 3, this.gamerTeam.size);
        break;
      default:
        this.gamerTeam.addCharacters([Bowman, Swordsman, Magician], 3, 2);
        this.computerTeam.addCharacters([Vampire, Undead, Daemon], 4, this.gamerTeam.size);
        break;
    }

    this.gamerPos.clear();
    this.computerPos.clear();
    for (let i = 0; i < boardSize; i++) {
      this.gamerPos.add(PositionedCharacter.xyToIndex(0, i));
      this.gamerPos.add(PositionedCharacter.xyToIndex(1, i));
      this.computerPos.add(PositionedCharacter.xyToIndex(boardSize - 2, i));
      this.computerPos.add(PositionedCharacter.xyToIndex(boardSize - 1, i));
    }

    for (const { position } of this.gamerTeam.members) {
      this.gamerPos.delete(position);
      this.computerPos.delete(position);
    }

    for (let i = 0; i < this.gamerTeam.size; i++) {
      if (this.gamerTeam.members[i].position < 0) {
        const index = Math.trunc(Math.random() * this.gamerPos.size);
        const position = [...this.gamerPos][index];
        this.gamerTeam.members[i].position = position;
        this.gamerPos.delete(position);
      }
    }

    for (let i = 0; i < this.computerTeam.size; i++) {
      const index = Math.trunc(Math.random() * this.computerPos.size);
      const position = [...this.computerPos][index];
      this.computerTeam.members[i].position = position;
      this.computerPos.delete(position);
    }

    this.redraw();
  }

  redraw() {
    this.gamePlay.redrawPositions([...this.gamerTeam.members, ...this.computerTeam.members]);
  }

  async onCellClick(index) {
    if (!this.isGamerStep) {
      return;
    }

    const ch = this.getCharacter(index);
    const selCh = this.getCharacter(this.selectedCharacterIndex);

    switch (this.targetColor) {
      case 'green':
        this.gamePlay.deselectCell(this.selectedCharacterIndex);
        this.selectedCharacterIndex = null;
        this.gamePlay.deselectCell(this.targetIndex);
        this.targetIndex = null;
        this.gamePlay.setCursor(cursor.notallowed);
        this.targetColor = 'yellow';

        selCh.position = index;
        this.isGamerStep = false;
        this.redraw();

        setTimeout(() => this.computerStep(), 300);
        break;

      case 'red':
        this.gamePlay.deselectCell(this.selectedCharacterIndex);
        this.selectedCharacterIndex = null;
        this.gamePlay.deselectCell(this.targetIndex);
        this.targetIndex = null;
        this.gamePlay.setCursor(cursor.notallowed);
        this.targetColor = 'yellow';

        ch.character.health = await this.attack(selCh, ch);
        if (ch.character.health === 0) {
          const i = this.computerTeam.members.findIndex((item) => item.position === index);
          this.computerTeam.members.splice(i, 1);
        }
        this.redraw();

        if (this.computerTeam.size) {
          this.isGamerStep = false;
          setTimeout(() => this.computerStep(), 300);
          break;
        }

        this.score += this.gamerTeam.members.reduce(
          (sum, item) => sum + item.character.health, 0,
        );
        if (this.score > this.maxScore) {
          this.maxScore = this.score;
        }
        GamePlay.showMessage(`Level ${this.level} completed
Score: ${this.score}
Maxscore: ${this.maxScore}`);

        if (this.level < 4) {
          this.levelUp();
          break;
        }

        GamePlay.showMessage('This is a victory!');
        this.isGamerStep = false;
        this.gamerTeam.members = [];
        this.redraw();
        break;

      default:
        if (!ch) {
          break;
        }
        if (!this.constructor.isGamerCharacter(ch)) {
          GamePlay.showError('This character is disable for selection');
          break;
        }
        if (this.selectedCharacterIndex !== null) {
          this.gamePlay.deselectCell(this.selectedCharacterIndex);
        }
        this.gamePlay.selectCell(index, this.targetColor);
        this.selectedCharacterIndex = index;
        this.gamePlay.setCursor(cursor.pointer);
    }
  }

  onCellEnter(index) {
    if (!this.isGamerStep) {
      return;
    }

    const ch = this.getCharacter(index);
    if (ch) {
      const message = `\u{1F396}${ch.character.level} \u{2694}${ch.character.attack} \u{1F6E1}${ch.character.defence} \u{2764}${ch.character.health}`;
      this.gamePlay.showCellTooltip(message, index);
    }

    if (this.selectedCharacterIndex === null) {
      return;
    }

    if (this.targetIndex !== null) {
      this.gamePlay.deselectCell(this.targetIndex);
    }

    if (ch && this.constructor.isGamerCharacter(ch)) {
      this.targetIndex = null;
      this.targetColor = 'yellow';
      this.gamePlay.setCursor(cursor.pointer);
      return;
    }

    const selCh = this.getCharacter(this.selectedCharacterIndex);

    if (!ch && this.isMove(selCh, PositionedCharacter.indexToXY(index))) {
      this.targetIndex = index;
      this.targetColor = 'green';
      this.gamePlay.selectCell(index, this.targetColor);
      this.gamePlay.setCursor(cursor.pointer);
      return;
    }

    if (ch && !this.constructor.isGamerCharacter(ch)
      && this.isAttack(selCh, PositionedCharacter.indexToXY(index))) {
      this.targetIndex = index;
      this.targetColor = 'red';
      this.gamePlay.selectCell(index, this.targetColor);
      this.gamePlay.setCursor(cursor.crosshair);
      return;
    }

    this.targetIndex = null;
    this.targetColor = 'yellow';
    this.gamePlay.setCursor(cursor.notallowed);
  }

  onCellLeave(index) {
    if (!this.isGamerStep) {
      return;
    }

    this.gamePlay.hideCellTooltip(index);
  }

  getCharacter(index) {
    let i = this.gamerTeam.members.findIndex((item) => item.position === index);
    if (i !== -1) {
      return this.gamerTeam.members[i];
    }
    i = this.computerTeam.members.findIndex((item) => item.position === index);
    if (i !== -1) {
      return this.computerTeam.members[i];
    }
    return null;
  }

  static isGamerCharacter(character) {
    const { type } = character.character;
    return (type === 'bowman') || (type === 'swordsman') || (type === 'magician');
  }

  static getDistance(character, target) {
    const { x, y } = character;
    const { x: xTarget, y: yTarget } = target;
    return Math.max(Math.abs(x - xTarget), Math.abs(y - yTarget));
  }

  isMove(character, target) {
    const { type } = character.character;
    const distance = this.constructor.getDistance(character, target);
    switch (type) {
      case 'swordsman':
      case 'undead':
        return distance <= 4;
      case 'bowman':
      case 'vampire':
        return distance <= 2;
      default:
        return distance <= 1;
    }
  }

  isFreeMove(character) {
    const { x: x0, y: y0 } = character;
    for (let x = Math.max(x0 - 4, 0); x <= Math.min(x0 + 4, boardSize - 1); x++) {
      for (let y = Math.max(y0 - 4, 0); y <= Math.min(y0 + 4, boardSize - 1); y++) {
        const index = PositionedCharacter.xyToIndex(x, y);
        if (!this.getCharacter(index) && this.isMove(character, { x, y })) {
          return true;
        }
      }
    }
    return false;
  }

  isAttack(character, target) {
    const { type } = character.character;
    const distance = this.constructor.getDistance(character, target);
    switch (type) {
      case 'magician':
      case 'daemon':
        return distance <= 4;
      case 'bowman':
      case 'vampire':
        return distance <= 2;
      default:
        return distance <= 1;
    }
  }

  async attack(attacker, target) {
    const { attack } = attacker.character;
    const { defence, health } = target.character;
    const damage = Math.round(Math.max(attack - defence, attack * 0.1));
    await this.gamePlay.showDamage(target.position, damage);
    return health - damage;
  }

  async computerStep() {
    const attackPair = { damage: 0 };
    const movePair = { damage: 0 };
    for (const compChar of this.computerTeam.members) {
      for (const gamerChar of this.gamerTeam.members) {
        const { attack } = compChar.character;
        const { defence } = gamerChar.character;
        const damage = Math.round(Math.max(attack - defence, attack * 0.1));

        if (this.isAttack(compChar, { x: gamerChar.x, y: gamerChar.y })) {
          if (damage > attackPair.damage) {
            attackPair.compChar = compChar;
            attackPair.gamerChar = gamerChar;
            attackPair.damage = damage;
          }
        } else if (this.isFreeMove(compChar) && (damage > movePair.damage)) {
          movePair.compChar = compChar;
          movePair.gamerChar = gamerChar;
          movePair.damage = damage;
        }
      }
    }

    if (attackPair.damage) {
      const { compChar, gamerChar } = attackPair;
      gamerChar.character.health = await this.attack(compChar, gamerChar);
      if (!gamerChar.character.health) {
        const i = this.gamerTeam.members.findIndex((item) => item === gamerChar);
        this.gamerTeam.members.splice(i, 1);
      }
      this.redraw();

      if (!this.gamerTeam.size) {
        GamePlay.showMessage('Game over :(');
        return;
      }

      this.gamePlay.setCursor(cursor.auto);
      this.isGamerStep = true;
      return;
    }

    const { compChar, gamerChar } = movePair;
    const { x: x0, y: y0 } = compChar;
    let distance = boardSize;
    let position;

    for (let x = Math.max(x0 - 4, 0); x <= Math.min(x0 + 4, boardSize - 1); x++) {
      for (let y = Math.max(y0 - 4, 0); y <= Math.min(y0 + 4, boardSize - 1); y++) {
        const index = PositionedCharacter.xyToIndex(x, y);
        if (!this.getCharacter(index) && this.isMove(compChar, { x, y })) {
          const newDistance = this.constructor.getDistance({ x, y }, gamerChar);
          if (newDistance < distance) {
            distance = newDistance;
            position = index;
          }
        }
      }
    }

    compChar.position = position;
    this.redraw();

    this.gamePlay.setCursor(cursor.auto);
    this.isGamerStep = true;
  }
}
