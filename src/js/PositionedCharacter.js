/* eslint-disable no-underscore-dangle */

import Character from './Character';

export default class PositionedCharacter {
  constructor(character, position, boardSize) {
    if (!(character instanceof Character)) {
      throw new Error('character must be instance of Character or its children');
    }

    if (typeof position !== 'number') {
      throw new Error('position must be a number');
    }

    if (typeof boardSize !== 'number') {
      throw new Error('boardSize must be a number');
    }

    this.character = character;
    this.boardSize = boardSize;
    this.position = position;
  }

  static indexToXY(index, boardSize) {
    return { x: index % boardSize, y: Math.floor(index / boardSize) };
  }

  static xyToIndex(x, y, boardSize) {
    return y * boardSize + x;
  }

  set position(value) {
    this._position = value;
    const { x, y } = PositionedCharacter.indexToXY(this._position, this.boardSize);
    this._x = x;
    this._y = y;
  }

  get position() {
    return this._position;
  }

  set x(value) {
    this._x = value;
    this._position = PositionedCharacter.xyToIndex(this._x, this._y, this.boardSize);
  }

  get x() {
    return this._x;
  }

  set y(value) {
    this._y = value;
    this._position = PositionedCharacter.xyToIndex(this._x, this._y, this.boardSize);
  }

  get y() {
    return this._y;
  }
}
