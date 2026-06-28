import { GAME_STATE, SCREENS } from "./constants.js";

class GameView {
  constructor() {
    this.screenMenu = document.querySelector("#screen-menu");
    this.screenGame = document.querySelector("#screen-game");
    this.screenSettings = document.querySelector("#screen-settings");

    this.containerStatus = document.querySelector("#container-status");
    this.containerBoard = document.querySelector("#container-board");
    this.containerPlayers = document.querySelector("#container-players");
    this.btnReset = document.querySelector("#btn-reset");

    this.inputRows = document.querySelector("#rows-settings");
    this.inputCols = document.querySelector("#cols-settings");
    this.inputWin = document.querySelector("#win-settings");
    this.inputPlayersCount = document.querySelector("#player-settings");

    this.btnReturn = document.querySelector("#btn-return");

    this.screenTable = {
      [SCREENS.MENU]: this.screenMenu,
      [SCREENS.GAME]: this.screenGame,
      [SCREENS.SETTINGS]: this.screenSettings,
    };
  }

  get settings() {
    const playerRows = this.containerPlayers.querySelectorAll(".player");
    const customPlayers = Array.from(playerRows).map((row) => {
      return {
        name: row.querySelector(".player__input--name").value,
        token: row.querySelector(".player__input--token").value,
      };
    });

    return {
      rows: parseInt(this.inputRows.value, 10),
      cols: parseInt(this.inputCols.value, 10),
      winLength: parseInt(this.inputWin.value, 10),
      players: customPlayers,
    };
  }

  showScreen(targetScreen) {
    for (const key in this.screenTable) {
      this.screenTable[key].style.display = "none";
    }

    if (this.screenTable[targetScreen]) {
      this.screenTable[targetScreen].style.display = "flex";
    }

    if (targetScreen === SCREENS.MENU) {
      this.btnReturn.style.display = "none";
    } else {
      this.btnReturn.style.display = "block";
    }
  }

  renderStatus({ state }, { name }) {
    if (state === GAME_STATE.WIN) {
      this.containerStatus.textContent = `${name} wins!`;
    } else if (state === GAME_STATE.DRAW) {
      this.containerStatus.textContent = `It's a draw!`;
    } else {
      this.containerStatus.textContent = `${name}'s turn.`;
    }
  }

  renderBoard(board) {
    const rows = board.length;
    const cols = board[0].length;
    this.containerBoard.style.setProperty("--rows", rows);
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

  renderPlayers() {
    const count = parseInt(this.inputPlayersCount.value, 10);
    this.containerPlayers.innerHTML = "";

    for (let i = 1; i <= count; i++) {
      const defaultToken =
        i === 1 ? "x" : i === 2 ? "o" : String.fromCharCode(64 + i);

      const playerDiv = document.createElement("div");
      playerDiv.classList.add("player");
      playerDiv.innerHTML = `
        <label class="settings__label player__label">Name:</label>
        <input class="settings__input player__input player__input--name" type="text" value="Player ${i}">

        <label class="settings__label player__label">Token:</label>
        <input class="settings__input player__input player__input--token" type="text" value="${defaultToken}" maxlength="1" size="2">
      `;

      this.containerPlayers.appendChild(playerDiv);
    }
  }

  bindPlayersCountEvents() {
    this.inputPlayersCount.addEventListener("input", () => {
      this.renderPlayers();
    });
  }

  bindReturnEvents(handleMenuAction) {
    this.btnReturn.addEventListener("click", () => {
      handleMenuAction(SCREENS.MENU);
    });
  }

  bindMenuEvents(handleMenuAction) {
    this.screenMenu.addEventListener("click", (event) => {
      const action = event.target.dataset.action;
      if (!action) return;

      handleMenuAction(action);
    });
  }

  bindGameEvents(handleReset, handleCellClick) {
    this.btnReset.addEventListener("click", handleReset);

    this.containerBoard.addEventListener("click", (event) => {
      if (event.target.tagName.toLowerCase() !== "button") return;

      const selectedRow = parseInt(event.target.dataset.row, 10);
      const selectedCol = parseInt(event.target.dataset.col, 10);

      handleCellClick(selectedRow, selectedCol);
    });
  }
}

export default GameView;
