import { GAME_STATE, SCREENS } from "./constants.js";

class GameView {
  constructor() {
    this.screenMenu = document.querySelector("#screen-menu");
    this.screenGame = document.querySelector("#screen-game");
    this.screenSettings = document.querySelector("#screen-settings");

    this.containerStatus = document.querySelector("#container-status");
    this.containerBoard = document.querySelector("#container-board");
    this.btnReset = document.querySelector("#btn-reset");

    this.screenTable = {
      [SCREENS.MENU]: this.screenMenu,
      [SCREENS.GAME]: this.screenGame,
      [SCREENS.SETTINGS]: this.screenSettings,
    };
  }

  showScreen(targetScreen) {
    for (const key in this.screenTable) {
      this.screenTable[key].style.display = "none";
    }

    if (this.screenTable[targetScreen]) {
      this.screenTable[targetScreen].style.display = "flex";
    }
  }

  renderStatus({ state, name }) {
    if (state === GAME_STATE.WIN) {
      this.containerStatus.textContent = `${name} wins!`;
    } else if (state === GAME_STATE.DRAW) {
      this.containerStatus.textContent = `It's a draw!`;
    } else {
      this.containerStatus.textContent = `${name}'s turn.`;
    }
  }

  renderBoard(board) {
    const cols = board[0].length;
    this.containerBoard.style.setProperty("--cols", cols);
    this.containerBoard.textContent = "";

    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellBtn = document.createElement("button");
        cellBtn.classList.add("mnk__col");
        cellBtn.dataset.row = rowIndex;
        cellBtn.dataset.col = colIndex;
        cellBtn.textContent = cell === 0 ? "" : cell;

        this.containerBoard.appendChild(cellBtn);
      });
    });
  }

  bindMenuEvents(handleMenuAction) {
    this.screenMenu.addEventListener("click", (event) => {
      const action = event.target.dataset.action;
      if (!action) return;

      handleMenuAction(action);
    });
  }
  bindGameEvents(handlerReset, handleCellClick) {
    this.btnReset.addEventListener("click", handlerReset);

    this.containerBoard.addEventListener("click", (event) => {
      if (event.target.tagName.toLowerCase() !== "button") return;

      const selectedRow = parseInt(event.target.dataset.row, 10);
      const selectedCol = parseInt(event.target.dataset.col, 10);

      handleCellClick(selectedRow, selectedCol);
    });
  }
}

export default GameView;
