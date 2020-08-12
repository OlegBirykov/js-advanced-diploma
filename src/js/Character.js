/* eslint-disable no-underscore-dangle */

export default class Character {
  constructor(level, type = 'generic') {
    this.level = level;
    this.k = 1.3 ** (level - 1);
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
    if (new.target.name === 'Character') {
      throw new Error('creating an object of this class is not allowed');
    }
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
