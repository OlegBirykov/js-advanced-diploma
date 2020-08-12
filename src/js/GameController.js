import themes from './themes';
import Team from './Team';
import Bowman from './Bowman';
import Swordsman from './Swordsman';
import Magician from './Magician';
import Vampire from './Vampire';
import Undead from './Undead';
import Daemon from './Daemon';
import PositionedCharacter from './PositionedCharacter';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    this.gamerTeam = new Team(this.gamePlay.boardSize);
    this.computerTeam = new Team(this.gamePlay.boardSize);
    this.gamerPos = new Set();
    this.computerPos = new Set();
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.level = 0;
    this.levelUp();
  }

  levelUp() {
    this.level++;
    this.gamePlay.drawUi(themes[this.level]);

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
    const { boardSize } = this.gamePlay;
    for (let i = 0; i < this.gamePlay.boardSize; i++) {
      this.gamerPos.add(PositionedCharacter.xyToIndex(0, i, boardSize));
      this.gamerPos.add(PositionedCharacter.xyToIndex(1, i, boardSize));
      this.computerPos.add(PositionedCharacter.xyToIndex(boardSize - 2, i, boardSize));
      this.computerPos.add(PositionedCharacter.xyToIndex(boardSize - 1, i, boardSize));
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

    console.log(this.gamerTeam);
    console.log(this.computerTeam);
  }

  redraw() {
    this.gamePlay.redrawPositions([...this.gamerTeam.members, ...this.computerTeam.members]);
  }

  //  onCellClick(index) {
  // TODO: react to click
  //  }

  //  onCellEnter(index) {
  // TODO: react to mouse enter
  //  }

//  onCellLeave(index) {
  // TODO: react to mouse leave
//  }
}
