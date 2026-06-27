import { SCREENS } from "./constants.js";

class GameController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.bindMenuEvents(this.handleMenuAction);
    this.view.bindReturnEvents(this.handleMenuAction, this.handleReset);
    this.view.bindGameEvents(this.handleReset, this.handleCellClick);
    this.view.bindPlayersCountEvents();

    this.view.showScreen(SCREENS.MENU);
    this.view.renderPlayers();
  }

  handleMenuAction = (targetScreen) => {
    if (targetScreen === SCREENS.GAME) {
      this.view.showScreen(SCREENS.GAME);
      this.#updateView();
    } else if (targetScreen === SCREENS.SETTINGS) {
      this.view.showScreen(SCREENS.SETTINGS);
    } else {
      this.view.showScreen(SCREENS.MENU);
      this.model.setInitialState(this.view.settings);
    }
  };

  handleCellClick = (row, col) => {
    const successMove = this.model.executeMove(row, col);

    if (!successMove) return;

    this.#updateView();
  };

  handleReset = () => {
    this.model.setInitialState();
    this.#updateView();
  };

  #updateView() {
    this.view.renderStatus(this.model.status, this.model.activePlayer);
    this.view.renderBoard(this.model.board);
  }
}

export default GameController;
