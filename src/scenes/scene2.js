import TileEngine, {Tile} from "../components/tileEngine.js";
import {getImages} from "../constants.js";
import RenderPipeline from "../renderPipeline.js";
import {GameObject} from "../gameObject.js";
import {TextRenderer} from "../components/textRenderer.js";
import Input from "../input.js";
import Vector from "../vector.js";

const load= () => {
	const tileAtlas= {
		"tilesetSample": getImages()?.tilesetSample,
	};

	const spriteMap= {
		"1": new Tile(tileAtlas.tilesetSample, "1", 0, 0, 64, 64),
		"2": new Tile(tileAtlas.tilesetSample, "2", 64, 0, 64, 64),
		"3": new Tile(tileAtlas.tilesetSample, "3", 128, 0, 64, 64),
		"4": new Tile(tileAtlas.tilesetSample, "4", 192, 0, 64, 64),
		"5": new Tile(tileAtlas.tilesetSample, "5", 256, 0, 64, 64),
		"0": new Tile(tileAtlas.tilesetSample, "1", 320, 0, 64, 64),
	};

	const levelData= [
		2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2,
		1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1,
		1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1,
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		1, 1, 1, 5, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1,
		1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1,
		1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1,
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1,
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1,
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1,
		4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4,
		3, 1, 1, 1, 4, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 3,
		2, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
	];

	return {tileAtlas, spriteMap, levelData};
}

class GameLevel2{
	constructor() {};

	Setup= (gameObj) => {
		this.gameObject= gameObj;
		const {tileAtlas, spriteMap, levelData}= load();
		this.gameObject.AddComponent(new TileEngine(2, tileAtlas, spriteMap, levelData, 16, 16, 64));
		this.ready= true;
	};

	Update= () => {};
}

class MouseTracker {
	constructor() {};

	Setup= (obj) => {
		this.gameObject= obj;
		const txtComp= new TextRenderer(2, "Hello");
		txtComp.name= "mousePosText";
		txtComp.color= "crimson";
		this.gameObject.AddComponent(txtComp);
	}

	Update= () => {
		const mPos= Input.getMousePos();
		this.gameObject.position= new Vector(mPos.x, mPos.y);
		this.gameObject.components["mousePosText"].text= `${mPos.x}:${mPos.y}`;
	}
}


const Scene2= () => {
	new GameObject().AddComponent(new GameLevel2());
	new GameObject().AddComponent(new MouseTracker());
}

export default Scene2;

