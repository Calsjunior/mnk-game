const GAME_STATE = Object.freeze({
  PLAYING: "playing",
  WIN: "win",
  DRAW: "draw",
});

const SCREENS = Object.freeze({
  MENU: "menu",
  GAME: "game",
  SETTINGS: "settings",
});

const getDefaultValues = () => ({
  rows: 3,
  cols: 3,
  winLength: 3,
  players: [
    { name: "Player 1", token: "x" },
    { name: "Player 2", token: "o" },
  ],
});

export { GAME_STATE, getDefaultValues, SCREENS };
