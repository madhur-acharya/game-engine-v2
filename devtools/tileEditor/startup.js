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



class levelsSelector {
	levels= {};

	constructor()
	{

	}

	addNewLevel(name, maxColumns, maxRows, tileIndex)
	{
		const tileMap= [];
		for(let i=0; i<maxRows; i++) {
			tileMap.push(Array(maxColumns));
		};
		this.levels[name]= {
			tileMap: tileMap,
			tileIndex: tileIndex,
		}
	}

	getLevel(name)
	{
		return this.levels[name];
	}
}

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
	const tileAtlas= {
		"A": {img: getImages()?.tilesetSample, size: 64},
		"B": {img: getImages()?.cobblestone, size: 32},
		"C": {img: getImages()?.character, size: 64},
		"W": {img: getImages()?.water, size: 64},
		"M": {img: getImages()?.mario, size: 16},
	};

	const lvl1TileIndex= generateTileIndex(tileAtlas);


	const levelselector= new levelsSelector();
	levelselector.addNewLevel("level1", 50, 50, lvl1TileIndex);

	const sidebarwidth= window.width * 0.25;
	const bottombarHeight= window.height * 0.33;
	const mainCamera= new Camera(window.width-sidebarwidth, window.height-bottombarHeight);

	// window.camera= new Camera(760, 512);
	// window.camera= new Camera(1440, 900);
	// window.camera= new Camera(2000, 2000);
	// window.camera= new Camera(window.width, window.height);

	const lvl1= levelselector.getLevel("level1");

	const mainScreenObject= new GameObject();
	const mainScreen= new Screen(new Vector(sidebarwidth, 0), mainCamera.width, mainCamera.height);
	ScreenManager.addScreen("main", mainScreen);
	const mainEditor= new TileEditor({
		camera: mainCamera, layer: 2, tileIndex: lvl1.tileIndex, tileMap: lvl1.tileMap, 
		tileSize: 64
	}, mainScreen);
	mainEditor.setDrawGrid(true);
	mainScreenObject.AddComponent(mainEditor);


	const bottomBarObject= new GameObject();
	const bottomCam= new Camera(window.width, bottombarHeight);
	const bottomScreen= new Screen(new Vector(0, window.height-bottombarHeight), bottomCam.width, bottomCam.height);
	ScreenManager.addScreen("bottom", bottomScreen);
	const bottomBar= new TileSelector({
		camera: bottomCam, layer: 4, tileSize: 32,
		tileIndex: lvl1TileIndex,
	}, bottomScreen);
	bottomBar.setDrawGrid(true);
	bottomBarObject.AddComponent(bottomBar);
	bottomBar.mainEditor= mainEditor;
};





