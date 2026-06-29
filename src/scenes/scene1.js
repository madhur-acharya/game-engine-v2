import TileEngine, {Tile} from "../components/tileEngine.js";
import {getImages} from "../constants.js";
import RenderPipeline from "../renderPipeline.js";
import {GameObject} from "../gameObject.js";
import {drawBoundingCircle} from "../utilityFunctions.js";
import PlayerMovement from "../scripts/playerMovement.js";
import {VGRenderer} from "../components/vgRenderer.js";
import Vector from "../vector.js";


class RenderTest{
	constructor() {
		this.layer= 3;
	};

	Setup= (gameObj) => {
		this.gameObject= gameObj;
		this.ready= true;
		this.gameObject.AddComponent(new VGRenderer(1, (gameObject) => {
			context.save();
			context.translate(gameObject.position.x, gameObject.position.y);
			context.rotate(Math.PI / 2);
			context.beginPath();
			context.fillStyle= "orange";
			context.moveTo(25, 0);
			context.lineTo(-10, -15);
			context.lineTo(0, 0);
			context.lineTo(-10, 15);
			context.lineTo(25, 0);
			context.fill();
			context.restore();
			drawBoundingCircle(gameObject.position, 30);
		}));
	};

	Update= () => {};
}



const Scene1= () => {
	// const player= new GameObject();
	// player.AddComponent(new PlayerMovement());
	// new GameObject().AddComponent(new RenderTest());
}

export default Scene1;

