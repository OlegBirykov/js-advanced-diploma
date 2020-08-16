import themes from './themes';
import Team from './Team';
import Bowman from './Bowman';
import Swordsman from './Swordsman';
import Magician from './Magician';
import Vampire from './Vampire';
import Undead from './Undead';
import Daemon from './Daemon';
import PositionedCharacter from './PositionedCharacter';
import GameState from './GameState';
import GamePlay from './GamePlay';
import cursor from './cursors';
import { boardSize } from './utils';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.gamerTeam = new Team();
    this.computerTeam = new Team();
    this.state = GameState.from(this);
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

    // Здесь будет попытка загрузки состояния, если попытка не удалась, то:
    this.newGame();
  }

  newGame() {
    this.gamerTeam.members = [];
    this.computerTeam.members = [];
    this.state.score = 0;
    this.state.isGamerStep = true;
    this.state.level = 0;
    this.levelUp();
  }

  levelUp() {
    this.state.level++;
    this.gamePlay.drawUi(themes[this.state.level]);
    this.gamePlay.setCursor(cursor.auto);

    if (this.state.level > 1) {
      this.gamerTeam.upgrade();
    }

    switch (this.state.level) {
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
    if (!this.state.isGamerStep) {
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
        this.state.isGamerStep = false;
        this.redraw();
        setTimeout(() => this.computerStep(), 1000);
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
          this.state.isGamerStep = false;
          setTimeout(() => this.computerStep(), 1000);
          break;
        }
        this.state.score += this.gamerTeam.members.reduce(
          (sum, item) => sum + item.character.health, 0,
        );
        if (this.state.score > this.state.maxScore) {
          this.state.maxScore = this.state.score;
        }
        GamePlay.showMessage(`level ${this.state.level} completed
score: ${this.state.score}
maxscore: ${this.state.maxScore}`);
        this.levelUp();
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
    if (!this.state.isGamerStep) {
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
    if (!this.state.isGamerStep) {
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

  computerStep() {
    this.gamePlay.setCursor(cursor.auto);
    this.state.isGamerStep = true;
  }
}
