const mnk = {
  rows: 3,
  cols: 3,
  winLength: 3,
};

const players = [
  { name: "Player 1", token: "x" },
  { name: "Player 2", token: "o" },
];

const ViewModes = Object.freeze({
  MENU: "menu",
  GAME: "game",
  SETTINGS: "settings",
});

const ScreenController = (() => {
  const menuDiv = document.querySelector("#menu");
  const settingsDiv = document.querySelector("#in-settings");
  const gameDiv = document.querySelector("#in-game");

  const playerTurnDiv = document.querySelector("#player-turn");
  const resetBtn = document.querySelector("#reset-btn");

  const boardDiv = document.querySelector("#board");
  boardDiv.style.setProperty("--cols", mnk.cols);

  const toggleView = (viewName) => {
    menuDiv.style.display = "none";
    gameDiv.style.display = "none";

    switch (viewName) {
      case ViewModes.GAME:
        gameDiv.style.display = "flex";
        break;
      case ViewModes.SETTINGS:
        settingsDiv.style.display = "block";
        break;
    }
  };

  const renderBoard = ({ board, activePlayer, isGameOver, isDraw }) => {
    boardDiv.textContent = "";

    if (isGameOver && isDraw) {
      playerTurnDiv.textContent = "It's a draw!";
    } else if (isGameOver) {
      playerTurnDiv.textContent = `${activePlayer.name} wins`;
    } else {
      playerTurnDiv.textContent = `${activePlayer.name}'s turn`;
    }

    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellBtn = document.createElement("button");
        cellBtn.classList.add("mnk__col");
        cellBtn.dataset.row = rowIndex;
        cellBtn.dataset.col = colIndex;
        cellBtn.textContent = cell === 0 ? "" : cell;

        boardDiv.appendChild(cellBtn);
      });
    });
  };

  const attachGameListener = (handler) => {
    boardDiv.addEventListener("click", (event) => {
      const selectedRow = event.target.dataset.row;
      const selectedCol = event.target.dataset.col;

      if (!selectedRow || !selectedCol) return;

      handler(selectedRow, selectedCol);
    });
  };

  const attachResetListener = (handler) => {
    resetBtn.addEventListener("click", handler);
  };

  const attachMenuListener = (handler) => {
    menuDiv.addEventListener("click", (event) => {
      const action = event.target.dataset.action;

      if (!action) return;

      handler(action);
    });
  };

  return {
    renderBoard,
    toggleView,
    attachGameListener,
    attachResetListener,
    attachMenuListener,
  };
})();

const App = ((board, controller, ui) => {
  const state = {
    board: board.createBoard(mnk.rows, mnk.cols),
    activePlayer: players[0],
    isGameOver: false,
    isDraw: false,
  };

  const handleMenu = (viewTarget) => {
    if (viewTarget === ViewModes.GAME) {
      ui.toggleView(ViewModes.GAME);
    } else if (viewTarget === ViewModes.SETTINGS) {
      ui.toggleView(ViewModes.SETTINGS);
    }
  };

  const handleStartGame = (rowString, colString) => {
    if (state.isGameOver) return;

    const row = parseInt(rowString, 10);
    const col = parseInt(colString, 10);

    const result = controller.playRound(
      state.board,
      row,
      col,
      mnk.winLength,
      state.activePlayer.token,
    );

    if (result.newBoard === state.board) return;
    state.board = result.newBoard;

    if (result.isWinner) {
      state.isGameOver = true;
    } else if (result.isDraw) {
      state.isGameOver = true;
      state.isDraw = true;
    } else {
      state.activePlayer = controller.getNextPlayer(
        state.activePlayer,
        players,
      );
    }

    ui.renderBoard(state);
  };

  const handleResetGame = () => {
    state.board = board.createBoard(mnk.rows, mnk.cols);
    state.activePlayer = players[0];
    state.isGameOver = false;
    state.isDraw = false;

    ui.renderBoard(state);
  };

  return {
    init() {
      ui.attachGameListener(handleStartGame);
      ui.attachResetListener(handleResetGame);
      ui.attachMenuListener(handleMenu);
      ui.renderBoard(state);
    },
  };
})(GameBoard, GameController, ScreenController);

App.init();
