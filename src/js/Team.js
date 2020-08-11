import { generateTeam } from './generators';

export default class Team {
  constructor() {
    this.members = [];
  }

  addCharacters(allowedTypes, maxLevel, characterCount) {
    const add = generateTeam(allowedTypes, maxLevel, characterCount);
    this.members = [...this.members, ...add];
  }

  upgrade() {
    console.log(this);
  }

  get size() {
    return this.members.length;
  }
}
