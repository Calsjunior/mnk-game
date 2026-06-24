import { GAME_STATE, SCREENS } from "./constants.js";

class GameController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.players = [
      { name: "Player 1", token: "x" },
      { name: "Player 2", token: "o" },
    ];
    this.activePlayerIndex = 0;

    this.view.bindMenuEvents(this.handleMenuAction);
    this.view.bindGameEvents(this.handleResetGame, this.handleCellClick);
    this.view.showScreen(SCREENS.MENU);
  }

  get activePlayer() {
    return this.players[this.activePlayerIndex];
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
      this.activePlayerIndex = this.activePlayerIndex === 0 ? 1 : 0;
    }

    this.#updateView();
  };

  handleResetGame = () => {
    this.model.setInitialState();
    this.activePlayerIndex = 0;
    this.#updateView();
  };

  #updateView() {
    this.view.renderStatus(this.model.status, this.activePlayer);
    this.view.renderBoard(this.model.board);
  }
}

export default GameController;
