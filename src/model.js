import { GAME_STATE, getDefaultValues } from "./constants.js";
import { calculateNextState, createBoard, getNextPlayer } from "./core.js";

class GameModel {
  #rows;
  #cols;
  #winLength;
  #board;
  #status;
  #players;
  #activePlayer;

  constructor() {
    this.setInitialState(getDefaultValues());
  }

  get board() {
    return this.#board.map((row) => [...row]);
  }

  get status() {
    return { ...this.#status };
  }

  get activePlayer() {
    return this.#activePlayer;
  }

  setInitialState({
    rows = this.#rows,
    cols = this.#cols,
    winLength = this.#winLength,
    players = this.#players,
  } = {}) {
    this.#rows = rows;
    this.#cols = cols;
    this.#winLength = winLength;
    this.#players = players;
    this.#activePlayer = this.#players[0];
    this.#board = createBoard(rows, cols);
    this.#status = { state: GAME_STATE.PLAYING, winner: null };
  }

  executeMove(row, col) {
    if (this.#status.state !== GAME_STATE.PLAYING) return false;

    const result = calculateNextState(
      this.#board,
      row,
      col,
      this.#winLength,
      this.#activePlayer.token,
    );

    if (result.newBoard === this.#board) return false;
    this.#board = result.newBoard;

    if (result.isWinner) {
      this.#status = { state: GAME_STATE.WIN, winner: this.#activePlayer.name };
    } else if (result.isDraw) {
      this.#status = { state: GAME_STATE.DRAW, winner: null };
    } else {
      this.#activePlayer = getNextPlayer(this.#activePlayer, this.#players);
    }

    return true;
  }
}

export default GameModel;
