/* eslint-disable no-underscore-dangle */

export default class Character {
  constructor(level, type = 'generic') {
    this.level = level;
    this.k = 1.3 ** (level - 1);
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
    // TODO: throw error if user use "new Character()"
  }

  get attack() {
    return this._attack;
  }

  set attack(value) {
    this._attack = Math.round(value);
  }

  get defence() {
    return this._defence;
  }

  set defence(value) {
    this._defence = Math.round(value);
  }
}
