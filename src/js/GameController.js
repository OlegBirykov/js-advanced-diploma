import themes from './themes';
import Team from './Team';
import Bowman from './Bowman';
import Swordsman from './Swordsman';
import Magician from './Magician';
import Vampire from './Vampire';
import Undead from './Undead';
import Daemon from './Daemon';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    this.gamerTeam = new Team();
    this.computerTeam = new Team();
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

    console.log(this.gamerTeam);
    console.log(this.computerTeam);
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
