import {GameObject} from "./gameObject.js";
import {TimeOut, Interval, drawGrid, Coroutine} from "./utilityFunctions.js";
import {PlayerMovement, Rectangle} from "./testScripts.js";
import {LevelManager} from "./tilemap.js";
import TileEngine from "./tileEngine.js";

const InitialBehaviour= () => {
	new GameObject().assignScript(TileEngine);
	new GameObject().assignScript(PlayerMovement);
}

export default InitialBehaviour;

