export default class GameState {
  static from(object) {
    const gameState = {
      level: 0,
      isGamerStep: true,
      score: 0,
      maxScore: 0,
    };
    gameState.gamerTeam = object.gamerTeam;
    gameState.computerTeam = object.computerTeam;
    return gameState;
  }
}
