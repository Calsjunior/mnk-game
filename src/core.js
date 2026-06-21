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

const calculateNextState = (currentBoard, row, col, winLength, token) => {
  const newBoard = placeToken(currentBoard, row, col, token);
  const isDraw = checkDraw(newBoard);
  const isWinner = checkWinner(newBoard, row, col, winLength, token);

  return {
    newBoard,
    isDraw,
    isWinner,
  };
};

export {
  calculateNextState,
  checkDraw,
  checkWinner,
  createBoard,
  getNextPlayer,
  placeToken,
};
