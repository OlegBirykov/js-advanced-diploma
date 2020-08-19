export default class GameState {
  static from(object) {
    const {
      gamerTeam,
      computerTeam,
      level,
      isGamerStep,
      score,
      maxScore,
    } = object;
    return {
      gamerTeam,
      computerTeam,
      level,
      isGamerStep,
      score,
      maxScore,
    };
  }
}
