const mnk = {
  rows: 3,
  cols: 3,
  winLen: 3,
};

const players = [
  { name: "Player 1", token: "x" },
  { name: "Player 2", token: "o" },
];

const GameBoard = (() => {
  const createBoard = (rows, cols) => {
    return Array(rows)
      .fill()
      .map(() => Arrays(cols).fill(0));
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

  const checkWinner = (rows, cols, winLength, token) => {
    const directions = [
      [0, 1], // Horizontal
      [1, 0], // Vertical
      [1, 1], // Diagonal
      [1, -1], // Anti-Diagonal
    ];

    for (const [directionRow, directionCol] of directions) {
      let counter = 1;

      const currentBoard = board.getBoard();

      let moveRows = rows + directionRow;
      let moveCols = cols + directionCol;
      while (
        moveRows >= 0 &&
        moveRows < currentBoard.length &&
        moveCols >= 0 &&
        moveCols < currentBoard[0].length &&
        board.getBoard()[moveRows][moveCols] === token
      ) {
        counter++;
        moveRows += directionRow;
        moveCols += directionCol;
      }

      moveRows = rows - directionRow;
      moveCols = cols - directionCol;
      while (
        moveRows >= 0 &&
        moveRows < currentBoard.length &&
        moveCols >= 0 &&
        moveCols < currentBoard[0].length &&
        board.getBoard()[moveRows][moveCols] === token
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

  const playRound = (row, col) => {
    if (board.getBoard()[row][col] !== 0) {
      console.log("That spot is taken");
      return;
    }

    console.log(
      `${getActivePlayer().name}'s token is placed into row ${row} and col ${col}.`,
    );

    board.placeToken(row, col, getActivePlayer().token);

    const isWinner = checkWinner(row, col, 3, getActivePlayer().token);
    if (isWinner) {
      console.log(`${getActivePlayer().name} is the winner.`);
      return;
    }

    switchPlayerTurn();
  };

  return {
    getActivePlayer,
    playRound,
    getBoard: board.getBoard,
  };
})(GameBoard);

const ScreenController = (() => {
  const game = GameController;

  const playerTurnDiv = document.querySelector(".mnk__turn");
  const boardDiv = document.querySelector(".mnk__board");

  const clearBoard = () => {
    boardDiv.textContent = "";
  };

  const updateTurnDisplay = () => {
    playerTurnDiv.textContent = `${game.getActivePlayer().name}'s turn`;
  };

  const createCellElement = (cellValue, rowIndex, colIndex) => {
    const cellButton = document.createElement("button");
    cellButton.classList.add("mnk__col");
    cellButton.dataset.row = rowIndex;
    cellButton.dataset.col = colIndex;
    cellButton.textContent = cellValue === 0 ? "-" : cellValue;

    return cellButton;
  };

  const renderBoard = () => {
    clearBoard();
    updateTurnDisplay();

    const board = game.getBoard();
    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const newCell = createCellElement(cell, rowIndex, colIndex);
        boardDiv.appendChild(newCell);
      });
    });
  };

  const clickHandlerBoard = (event) => {
    const selectedRow = event.target.dataset.row;
    const selectedCol = event.target.dataset.col;
    if (!selectedRow || !selectedCol) return;

    game.playRound(parseInt(selectedRow, 10), parseInt(selectedCol, 10));
    renderBoard();
  };

  const startEventHandler = () => {
    boardDiv.addEventListener("click", clickHandlerBoard);
  };

  return {
    init() {
      startEventHandler();
      renderBoard();
    },
  };
})(GameController);

ScreenController.init();
