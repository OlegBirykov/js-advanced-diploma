import Character from './Character';
import { boardSize } from './utils';

export default class PositionedCharacter {
  constructor(character, position) {
    if (!(character instanceof Character)) {
      throw new Error('character must be instance of Character or its children');
    }

    if (typeof position !== 'number') {
      throw new Error('position must be a number');
    }

    this.character = character;
    this.position = position;
  }

  static indexToXY(index) {
    return { x: index % boardSize, y: Math.floor(index / boardSize) };
  }

  static xyToIndex(x, y) {
    return y * boardSize + x;
  }

  set x(value) {
    const { y } = this.constructor.indexToXY(this.position);
    this.position = this.constructor.xyToIndex(value, y);
  }

  get x() {
    const { x } = this.constructor.indexToXY(this.position);
    return x;
  }

  set y(value) {
    const { x } = this.constructor.indexToXY(this.position);
    this.position = this.constructor.xyToIndex(x, value);
  }

  get y() {
    const { y } = this.constructor.indexToXY(this.position);
    return y;
  }
}
