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
    for (const { character } of this.members) {
      character.level++;

      character.attack = Math.max(
        character.attack,
        character.attack * ((80 + character.health) / 100),
      );

      character.defence = Math.max(
        character.defence,
        character.defence * ((80 + character.health) / 100),
      );

      character.health += 80;
    }
  }

  get size() {
    return this.members.length;
  }
}
