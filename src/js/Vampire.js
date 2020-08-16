import Character from './Character';

export default class Vampire extends Character {
  constructor(level = 1) {
    super(level, 'vampire');
    this.attack = 25 * this.k;
    this.defence = 25 * this.k;
    delete this.k;
  }
}
