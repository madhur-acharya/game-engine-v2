import {GameObject} from "./gameObject.js";
import {TimeOut, Interval, drawGrid, Coroutine} from "./utilityFunctions.js";
import PlayerMovement from "./scripts/playerMovement.js";
import GameLevel1 from "./scripts/gameLevel.js";

const InitialBehaviour= () => {
	new GameObject().assignScript(GameLevel1);
	new GameObject().assignScript(PlayerMovement);
}

export default InitialBehaviour;

