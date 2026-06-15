const GameBoard = (() => {
  const rows = 3;
  const cols = 3;
  const board = Array(rows)
    .fill()
    .map(() => Array(cols).fill(0));

  const getBoard = () => board;

  const placeToken = (rows, cols, token) => {
    board[rows][cols] = token;
  };

  const printBoard = () => {
    console.table(board);
  };

  return {
    getBoard,
    placeToken,
    printBoard,
  };
})();

const GameController = (() => {
  const board = GameBoard;

  const players = [
    {
      name: "Player 1",
      token: "x",
    },
    {
      name: "Player 2",
      token: "o",
    },
  ];

  let activePlayer = players[0];
  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
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
        moveRows < currentBoard[0].length &&
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
        moveRows < currentBoard[0].length &&
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

  const playRound = (rows, cols) => {
    console.log(
      `${getActivePlayer().name}'s token is placed into row ${rows} and col ${cols}.`,
    );

    board.placeToken(rows, cols, getActivePlayer().token);

    const isWinner = checkWinner(rows, cols, 3, getActivePlayer().token);
    if (isWinner) {
      console.log(`${getActivePlayer().name} is the winner.`);
      return;
    }

    switchPlayerTurn();
    printNewRound();
  };

  return {
    getActivePlayer,
    playRound,
    getBoard: board.getBoard,
  };
})(GameBoard);

const ScreenController = (() => {
  const game = GameController;
  const board = game.getBoard();

  const playerTurnDiv = document.querySelector(".mnk__turn");
  const boardDiv = document.querySelector(".mnk__board");

  const generateBoard = () => {
    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("mnk__col");
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.col = colIndex;
        cellButton.textContent = cell === 0 ? "-" : cell;

        boardDiv.appendChild(cellButton);
      });
    });
  };

  const clickHandlerBoard = (event) => {
    const selectedRow = event.target.dataset.row;
    const selectedCol = event.target.dataset.col;
    if (!selectedRow || !selectedCol) return;

    game.playRound(parseInt(selectedRow, 10), parseInt(selectedCol, 10));
  };

  const startEventHandler = () => {
    boardDiv.addEventListener("click", clickHandlerBoard);
  };

  return {
    init() {
      generateBoard();
      startEventHandler();
    },
  };
})(GameController);

ScreenController.init();
