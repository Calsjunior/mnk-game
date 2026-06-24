import { GAME_STATE, SCREENS } from "./constants.js";
import { getNextPlayer } from "./core.js";

class GameController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.players = [
      { name: "Player 1", token: "x" },
      { name: "Player 2", token: "o" },
    ];
    this.activePlayer = this.players[0];

    this.view.bindMenuEvents(this.handleMenuAction);
    this.view.bindGameEvents(this.handleResetGame, this.handleCellClick);
    this.view.showScreen(SCREENS.MENU);
  }

  handleMenuAction = (targetScreen) => {
    if (targetScreen === SCREENS.GAME) {
      this.view.showScreen(SCREENS.GAME);
      this.#updateView();
    } else if (targetScreen === SCREENS.SETTINGS) {
      this.view.showScreen(SCREENS.SETTINGS);
    }
  };

  handleCellClick = (row, col) => {
    const successMove = this.model.executeMove(
      row,
      col,
      this.activePlayer.token,
    );

    if (!successMove) return;

    if (this.model.status.state === GAME_STATE.PLAYING) {
      this.activePlayer = getNextPlayer(this.activePlayer, this.players);
    }

    this.#updateView();
  };

  handleResetGame = () => {
    this.model.setInitialState();
    this.activePlayer = this.players[0];
    this.#updateView();
  };

  #updateView() {
    this.view.renderStatus(this.model.status, this.activePlayer);
    this.view.renderBoard(this.model.board);
  }
}

export default GameController;
