import { GAME_STATE } from "./constants.js";
import { calculateNextState, createBoard } from "./core.js";

class GameModel {
  #rows;
  #cols;
  #winLength;
  #board;
  #status;

  constructor(rows = 3, cols = 3, winLength = 3) {
    this.setInitialState(rows, cols, winLength);
  }

  get board() {
    return this.#board.map((row) => [...row]);
  }

  get status() {
    return { ...this.#status };
  }

  setInitialState(
    rows = this.#rows,
    cols = this.#cols,
    winLength = this.#winLength,
  ) {
    this.#rows = rows;
    this.#cols = cols;
    this.#winLength = winLength;
    this.#board = createBoard(rows, cols);
    this.#status = { state: GAME_STATE.PLAYING, winner: null };
  }

  executeMove(row, col, token) {
    if (this.#status.state !== GAME_STATE.PLAYING) return false;

    const result = calculateNextState(
      this.#board,
      row,
      col,
      this.#winLength,
      token,
    );

    if (result.newBoard === this.#board) return false;
    this.#board = result.newBoard;

    if (result.isWinner) {
      this.#status = { state: GAME_STATE.WIN, winner: token };
    } else if (result.isDraw) {
      this.#status = { state: GAME_STATE.DRAW, winner: null };
    }

    return true;
  }
}

export default GameModel;
