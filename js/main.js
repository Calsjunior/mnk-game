const mnk = {
  rows: 3,
  cols: 3,
  winLength: 3,
};

const players = [
  { name: "Player 1", token: "x" },
  { name: "Player 2", token: "o" },
];

const GameBoard = (() => {
  const createBoard = (rows, cols) => {
    return Array(rows)
      .fill()
      .map(() => Array(cols).fill(0));
  };

  const placeToken = (currentBoard, row, col, token) => {
    if (currentBoard[row][col] !== 0) {
      return currentBoard;
    }

    const newBoard = currentBoard.map((arr) => [...arr]);
    newBoard[row][col] = token;

    return newBoard;
  };

  return {
    createBoard,
    placeToken,
  };
})();

const GameController = ((board) => {
  const getNextPlayer = (currentPlayer, players) => {
    return currentPlayer === players[0] ? players[1] : players[0];
  };

  const checkWinner = (board, targetRow, targetCol, winLength, token) => {
    const directions = [
      [0, 1], // Horizontal
      [1, 0], // Vertical
      [1, 1], // Diagonal
      [1, -1], // Anti-Diagonal
    ];

    for (const [directionRow, directionCol] of directions) {
      let counter = 1;

      let moveRows = targetRow + directionRow;
      let moveCols = targetCol + directionCol;
      while (
        moveRows >= 0 &&
        moveRows < board.length &&
        moveCols >= 0 &&
        moveCols < board[0].length &&
        board[moveRows][moveCols] === token
      ) {
        counter++;
        moveRows += directionRow;
        moveCols += directionCol;
      }

      moveRows = targetRow - directionRow;
      moveCols = targetCol - directionCol;
      while (
        moveRows >= 0 &&
        moveRows < board.length &&
        moveCols >= 0 &&
        moveCols < board[0].length &&
        board[moveRows][moveCols] === token
      ) {
        counter++;
        moveRows -= directionRow;
        moveCols -= directionCol;
      }

      if (counter >= winLength) {
        return true;
      }
    }

    return false;
  };

  const checkDraw = (board) => {
    return board.every((row) => !row.includes(0));
  };

  const playRound = (currentBoard, row, col, winLength, token) => {
    const newBoard = board.placeToken(currentBoard, row, col, token);
    const isDraw = checkDraw(newBoard);
    const isWinner = checkWinner(newBoard, row, col, winLength, token);

    return {
      newBoard,
      isDraw,
      isWinner,
    };
  };

  return {
    getNextPlayer,
    playRound,
  };
})(GameBoard);

const ScreenController = (() => {
  const playerTurnDiv = document.querySelector(".mnk__turn");
  const boardDiv = document.querySelector(".mnk__board");
  const resetBtn = document.querySelector(".mnk__reset");

  const clearBoard = () => {
    boardDiv.textContent = "";
  };

  const addBoardStyle = () => {
    boardDiv.style.display = "grid";
    boardDiv.style.gridTemplateColumns = `repeat(${mnk.cols}, 50px)`;
    boardDiv.style.gap = "5px";
  };

  const render = ({ board, activePlayer, isGameOver, isDraw }) => {
    clearBoard();

    addBoardStyle();

    if (isGameOver && isDraw) {
      playerTurnDiv.textContent = "It's a draw!";
    } else if (isGameOver) {
      playerTurnDiv.textContent = `${activePlayer.name}'s win`;
    } else {
      playerTurnDiv.textContent = `${activePlayer.name}'s turn`;
    }

    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellBtn = document.createElement("button");
        cellBtn.classList.add("mnk__col");
        cellBtn.dataset.row = rowIndex;
        cellBtn.dataset.col = colIndex;
        cellBtn.textContent = cell === 0 ? "-" : cell;

        boardDiv.appendChild(cellBtn);
      });
    });
  };

  const attachBoardListener = (handler) => {
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

  return { render, attachBoardListener, attachResetListener };
})();

const App = ((board, controller, ui) => {
  const state = {
    board: board.createBoard(mnk.rows, mnk.cols),
    activePlayer: players[0],
    isGameOver: false,
    isDraw: false,
  };

  const startGame = (rowString, colString) => {
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

    ui.render(state);
  };

  const resetGame = () => {
    state.board = board.createBoard(mnk.rows, mnk.cols);
    state.activePlayer = players[0];
    state.isGameOver = false;
    state.isDraw = false;

    ui.render(state);
  };

  return {
    init() {
      ui.attachBoardListener(startGame);
      ui.attachResetListener(resetGame);
      ui.render(state);
    },
  };
})(GameBoard, GameController, ScreenController);

App.init();
