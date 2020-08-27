export const boardSize = 8;

export function calcTileType(index) {
  const x = index % boardSize;
  const y = Math.floor(index / boardSize);
  const max = boardSize - 1;
  if (!x && !y) {
    return 'top-left';
  }
  if (x === max && !y) {
    return 'top-right';
  }
  if (!x && y === max) {
    return 'bottom-left';
  }
  if (x === max && y === max) {
    return 'bottom-right';
  }
  if (!x) {
    return 'left';
  }
  if (!y) {
    return 'top';
  }
  if (x === max) {
    return 'right';
  }
  if (y === max) {
    return 'bottom';
  }
  return 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}
