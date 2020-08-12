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
    const { y } = PositionedCharacter.indexToXY(this.position);
    this.position = PositionedCharacter.xyToIndex(value, y);
  }

  get x() {
    const { x } = PositionedCharacter.indexToXY(this.position);
    return x;
  }

  set y(value) {
    const { x } = PositionedCharacter.indexToXY(this.position);
    this.position = PositionedCharacter.xyToIndex(x, value);
  }

  get y() {
    const { y } = PositionedCharacter.indexToXY(this.position);
    return y;
  }
}
