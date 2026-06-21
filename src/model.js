import { calculateNextState, createBoard } from "./core.js";

const GAME_STATE = Object.freeze({
  PLAYING: "playing",
  WIN: "win",
  DRAW: "draw",
});

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

  setInitialState(rows, cols, winLength) {
    this.#rows = rows;
    this.#cols = cols;
    this.#winLength = winLength;
    this.#board = createBoard(rows, cols);
    this.#status = { state: GAME_STATE.PLAYING, winner: null };
  }

  executeMove(row, col, token) {
    if (this.#status.state !== GAME_STATE.PLAYING) return;

    const result = calculateNextState(
      this.#board,
      row,
      col,
      this.#winLength,
      token,
    );

    if (result.newBoard === this.#board) return;
    this.#board = result.newBoard;

    if (result.isWinner) {
      this.#status = { state: GAME_STATE.WIN, winner: token };
    } else if (result.isDraw) {
      this.#status = { state: GAME_STATE.DRAW, winner: null };
    }
  }
}

export default GameModel;
