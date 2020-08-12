import { generateTeam } from './generators';

export default class Team {
  constructor(boardSize) {
    this.members = [];
    this.boardSize = boardSize;
  }

  addCharacters(allowedTypes, maxLevel, characterCount) {
    const add = generateTeam(allowedTypes, maxLevel, characterCount, this.boardSize);
    this.members = [...this.members, ...add];
  }

  upgrade() {
    console.log(this);
  }

  get size() {
    return this.members.length;
  }
}
