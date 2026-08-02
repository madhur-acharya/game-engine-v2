import TileEngine, {Tile} from "../components/tileEngine.js";
import {getImages} from "../constants.js";
import RenderPipeline from "../renderPipeline.js";
import {GameObject} from "../gameObject.js";
import {TextRenderer} from "../components/textRenderer.js";
import Camera from "../components/camera.js";
import Input from "../input.js";
import Vector from "../vector.js";
import Generic from "../components/generic.js";

const load= () => {
	const tileAtlas= {
		"tilesetSample": getImages()?.tilesetSample,
		"cobblestone": getImages()?.cobblestone,
		"water": getImages()?.water,
	};

	const spriteMap= {
		"1": new Tile(tileAtlas.tilesetSample, "1", 0, 0, 64, 64),
		"2": new Tile(tileAtlas.tilesetSample, "2", 64, 0, 64, 64),
		"3": new Tile(tileAtlas.tilesetSample, "3", 128, 0, 64, 64),
		"4": new Tile(tileAtlas.tilesetSample, "4", 192, 0, 64, 64),
		"5": new Tile(tileAtlas.tilesetSample, "5", 256, 0, 64, 64),
		"0": new Tile(tileAtlas.cobblestone, "0", 0, 0, 16, 16),
		"#": new Tile(tileAtlas.water, "#", 0, 0, 64, 64),
	};

	const levelData= [
		[2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4,  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,],
		[2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3,  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
		[1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
		[1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1,],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1,],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
		[1, 1, 1, 1, 1, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 1, 1, 1,],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
		[2, 0, 1, 1, 1, 1, 1, 1, 1, 5, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
		[2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
	];

	return {tileAtlas, spriteMap, levelData};
}

class GameLevel2 extends Generic{
	constructor(gameObj) {
		super();

		this.camera= window.camera;
		this.gameObject= gameObj;
		const {tileAtlas, spriteMap, levelData}= load();

		const foreground= new TileEngine(this.camera, 2, tileAtlas, spriteMap, levelData, 64);
		this.gameObject.AddComponent(foreground);

		const backgroundLayer= new TileEngine(this.camera, 1, tileAtlas, {
			"#": new Tile(tileAtlas.tilesetSample, "#", 0, 0, 16, 16)
		}, [[1]], 64);
		this.gameObject.AddComponent(backgroundLayer);

		this.ready= true;
	};

	Update= () => {
		const vel= 8;
		if(Input.getKey("w")) this.camera.position.addTo(new Vector(0, -vel));
		if(Input.getKey("s")) this.camera.position.addTo(new Vector(0, vel));
		if(Input.getKey("a")) this.camera.position.addTo(new Vector(-vel, 0));
		if(Input.getKey("d")) this.camera.position.addTo(new Vector(vel, 0));
		
		window.nurdyStats1.innerText= this.camera.position.toString();
	};
}

class MouseTracker extends Generic{
	constructor(obj){
		super();
		
		this.gameObject= obj;
		const txtComp= new TextRenderer(4);
		txtComp.name= "mousePosText";
		txtComp.color= "crimson";
		this.gameObject.AddComponent(txtComp);
	}

	Update= () => {
		const mPos= Input.getMousePos();
		this.gameObject.position= new Vector(mPos.x, mPos.y);
		this.gameObject.components["mousePosText"].setText(`${mPos.x}:${mPos.y}`);
	}
}


const Scene2= () => {
	const gameObj= new GameObject();
	gameObj.AddComponent(new GameLevel2(gameObj));
	gameObj.AddComponent(new MouseTracker(gameObj));
}

export default Scene2;

