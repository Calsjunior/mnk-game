import GameController from "./controller.js";
import GameModel from "./model.js";
import GameView from "./view.js";

const app = new GameController(new GameModel(), new GameView());
