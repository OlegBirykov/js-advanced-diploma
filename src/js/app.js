/**
 * Entry point of app: don't change this
 */
import GamePlay from './ui/GamePlay';
import GameController from './api/GameController';
import GameStateService from './api/GameStateService';

const gamePlay = new GamePlay();
gamePlay.bindToDOM(document.querySelector('#game-container'));

const stateService = new GameStateService(localStorage);

const gameCtrl = new GameController(gamePlay, stateService);
gameCtrl.init();

// don't write your code here
