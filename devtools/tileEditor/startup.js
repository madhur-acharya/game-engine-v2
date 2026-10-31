import Input from "../../src/input.js";
import EventSystem from "../../src/eventSystem.js";
import {bulkLoadImages} from "../../src/constants.js";
import TileEngine, {Tile} from "../../src/components/tileEngine.js";
import {getImages} from "../../src/constants.js";
import RenderPipeline from "../../src/renderPipeline.js";
import Vector from "../../src/vector.js";
import Camera from "../../src/components/camera.js";
import ScreenManager, {Screen} from "../../src/components/screen.js";
import TileSelector from "./tileSelector.js";
import {GameObject} from "../../src/gameObject.js";

import TileEditor from "./tileEditor.js";
import LevelSelector from "./levelselector.js";
import LevelCreator from "./levelCreator.js";


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


const generateTileIndex= (tileAtlas) => {
	const tileIndex= {};

	for(const T of Object.keys(tileAtlas)) {
		const tileSheet= tileAtlas[T].img;
		const ogSize= tileAtlas[T].size;
		const cols= Math.floor(tileSheet.width/ogSize);
		const rows= Math.floor(tileSheet.height/ogSize);
		for(let i=0; i<rows; i++) {
			for(let j=0; j<cols; j++) {
				const key= `${T}${i}${j}`;
				tileIndex[key]= new Tile(tileSheet, key, (j*ogSize), (i*ogSize), ogSize, ogSize);
			}
		};
	}
	return tileIndex;
}

const load= () => {
	const creator= new LevelCreator();
}





