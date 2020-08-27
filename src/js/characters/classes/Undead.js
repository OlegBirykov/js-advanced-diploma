import Character from '../Character';

export default class Undead extends Character {
  constructor(level = 1) {
    super(level, 'undead');
    this.attack = 40 * this.k;
    this.defence = 10 * this.k;
    delete this.k;
  }
}
