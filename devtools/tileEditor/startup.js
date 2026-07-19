import Input from "../../src/input.js";
import EventSystem from "../../src/eventSystem.js";
import {bulkLoadImages} from "../../src/constants.js";
import TileEngine, {Tile} from "../../src/components/tileEngine.js";
import {getImages} from "../../src/constants.js";
import RenderPipeline from "../../src/renderPipeline.js";

import levelData from "./levelData.js";
import TileEditor from "./tileEditor.js";


EventSystem.createEvent("onCanvasReady");
EventSystem.createEvent("onGameReady");
EventSystem.createEvent("onDispatchNewFrame");
EventSystem.createEvent("onMouseClick");

window.addEventListener("onCanvasReady", () => {
	console.log("canvasReady");

	Input.init(window.canvas);

	bulkLoadImages({
		"tilesetSample": "/src/assets/tiles.png",
		"tilesetClifside": "/src/assets/cliffside.png",
		"character": "/src/assets/character.png",
		"mario": "/src/assets/mario_tileset.png",
		"cobblestone": "/src/assets/cobblestone.png",
		"water": "/src/assets/water.png",
	})
	.then(imgMp => {
		EventSystem.dispatchEvent("onGameReady");
	})
	.catch(err => {
		console.log(err);
	});
});

window.addEventListener("onGameReady", () => {
	console.log("game load complete");
	load();
	EventSystem.dispatchEvent("onDispatchNewFrame");
});




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
		// "#": new Tile(tileAtlas.water, "#", 0, 0, 64, 64),
	};

	new TileEditor({
		layer: 2, 
		tileAtlas: tileAtlas, 
		spriteMap: spriteMap, 
		levelData: levelData, 
		tileSize: 64
	});
};





