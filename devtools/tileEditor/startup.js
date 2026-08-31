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

	const spriteMap= (withDef= false) =>({
		"1": new Tile(tileAtlas.tilesetSample, "1", 0, 0, 64, 64),
		"2": new Tile(tileAtlas.tilesetSample, "2", 64, 0, 64, 64),
		"3": new Tile(tileAtlas.tilesetSample, "3", 128, 0, 64, 64),
		"4": new Tile(tileAtlas.tilesetSample, "4", 192, 0, 64, 64),
		"5": new Tile(tileAtlas.tilesetSample, "5", 256, 0, 64, 64),
		"0": new Tile(tileAtlas.cobblestone, "0", 0, 0, 16, 16),
		...(withDef ? {"#": new Tile(tileAtlas.water, "#", 0, 0, 64, 64)} : {})
	});

	const sidebarwidth= window.width * 0.25;
	const bottombarHeight= window.height * 0.33;
	const mainCamera= new Camera(window.width-sidebarwidth, window.height-bottombarHeight);

	// window.camera= new Camera(760, 512);
	// window.camera= new Camera(1440, 900);
	// window.camera= new Camera(2000, 2000);
	// window.camera= new Camera(window.width, window.height);


	const mainScreen= new Screen(new Vector(sidebarwidth, 0), mainCamera.width, mainCamera.height);
	ScreenManager.addScreen("main", mainScreen);
	const mainEditor= new TileEditor({
		camera: mainCamera, layer: 2, tileAtlas: tileAtlas, spriteMap: spriteMap(), levelData: levelData, 
		tileSize: 64
	}, mainScreen);

	const leftBar= new Camera(sidebarwidth, window.height-bottombarHeight);
	const leftScreen= new Screen(new Vector(0, 0), leftBar.width, leftBar.height);
	ScreenManager.addScreen("left", leftScreen);
	const leftEditor= new TileEditor({
		camera: leftBar, layer: 2, tileAtlas: tileAtlas, spriteMap: spriteMap(), levelData: levelData, 
		tileSize: 64
	}, leftScreen);

	const bottomBar= new Camera(window.width, bottombarHeight);
	const bottomScreen= new Screen(new Vector(0, window.height-bottombarHeight), bottomBar.width, bottomBar.height);
	ScreenManager.addScreen("bottom", bottomScreen);
	const sideBar= new TileSelector({
		camera: bottomBar, layer: 4, tileSize: 64
	}, bottomScreen);
};





