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

  const playRound = (rows, cols) => {
    console.log(
      `${getActivePlayer().name}'s token is placed into rows ${rows} and cols ${cols}.`,
    );

    board.placeToken(rows, cols, getActivePlayer().token);

    switchPlayerTurn();
    printNewRound();
  };

  return {
    init() {
      playRound(1, 2);
      playRound(0, 2);
      playRound(0, 0);
    },
  };
})(GameBoard);

GameController.init();
