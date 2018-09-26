import cells from "./cells";
import player from './player';
import { combineReducers } from "redux";

const TicTacToeApp = combineReducers({cells, player});

export default TicTacToeApp;