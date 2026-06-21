import TileEngine, {Tile} from "../components/tileEngine.js";
import {getImages} from "../constants.js";
import RenderPipeline from "../renderPipeline.js";
import {GameObject} from "../gameObject.js";
import {drawBoundingCircle} from "../utilityFunctions.js";
import PlayerMovement from "../scripts/playerMovement.js";
import {VGRenderer} from "../components/vgRenderer.js";
import Vector from "../vector.js";


const load= () => {
	const tileAtlas= {
		"tilesetSample": getImages()?.tilesetSample,
		"tilesetClifside": getImages()?.tilesetClifside,
	};

	const spriteMap= {
		"@": new Tile(tileAtlas.tilesetClifside, "@", 384, 0, 16, 16),
		"$": new Tile(tileAtlas.tilesetClifside, "$", 0, 0, 16, 16),
		"#": new Tile(tileAtlas.tilesetClifside, "#", 48, 368, 16, 16),

		"1": new Tile(tileAtlas.tilesetSample, "1", 0, 0, 64, 64),
		"2": new Tile(tileAtlas.tilesetSample, "2", 64, 0, 64, 64),
		"3": new Tile(tileAtlas.tilesetSample, "3", 128, 0, 64, 64),
		"4": new Tile(tileAtlas.tilesetSample, "4", 192, 0, 64, 64),
		"5": new Tile(tileAtlas.tilesetSample, "5", 256, 0, 64, 64),
		"0": new Tile(tileAtlas.tilesetSample, "1", 320, 0, 64, 64),
	};

	const levelData= [
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],

		[4, 3, 3, 3, 3, 3, 3, 4, 4, 3, 3, 3, 3, 3, 3, 4,
		4, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 4,
		4, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 4,
		4, 0, 0, 5, 0, 0, 0, 4, 4, 0, 0, 5, 0, 0, 0, 4,
		4, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 4,
		4, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 4,
		4, 4, 4, 0, 5, 4, 4, 4, 4, 4, 4, 0, 5, 4, 4, 4,
		0, 3, 3, 0, 0, 3, 3, 3, 0, 3, 3, 0, 0, 3, 3, 3,
		4, 3, 3, 3, 3, 3, 3, 4, 4, 3, 3, 3, 3, 3, 3, 4, 
		4, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 4,
		4, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 4,
		4, 0, 0, 5, 0, 0, 0, 4, 4, 0, 0, 5, 0, 0, 0, 4,
		4, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 4,
		4, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 4,
		4, 4, 4, 0, 5, 4, 4, 4, 4, 4, 4, 0, 5, 4, 4, 4,
		0, 3, 3, 0, 0, 3, 3, 3, 0, 3, 3, 0, 0, 3, 3, 3,]
	];

	return {tileAtlas, spriteMap, levelData};
}

class GameLevel1{
	constructor() {};

	Setup= (gameObj) => {
		this.gameObject= gameObj;
		const {tileAtlas, spriteMap, levelData}= load();
		this.gameObject.AddComponent(new TileEngine(0, tileAtlas, spriteMap, levelData[0]));
		// this.gameObject.AddComponent(new TileEngine(1, tileAtlas, spriteMap, levelData[1]));
		this.ready= true;
	};

	Update= () => {};
}



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
	// new GameObject().AddComponent(new GameLevel1());
	const player= new GameObject();
	player.AddComponent(new PlayerMovement());
	// new GameObject().AddComponent(new RenderTest());
}

export default Scene1;

