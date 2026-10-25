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
import Generic from "../../src/components/generic.js";

import TileEditor from "./tileEditor.js";
import LevelSelector, {LoadAllLevels} from "./levelselector.js";
import StateManager from "../../src/components/stateManager.js";


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


export default class LevelCreator extends Generic{
	layers= [];


	constructor() {
		super();

		this.stateManager= new StateManager({});
		this.tileAtlas= {
			// "A": {img: getImages()?.tilesetSample, size: 64},
			// "B": {img: getImages()?.cobblestone, size: 32},
			// "C": {img: getImages()?.character, size: 64},
			// "W": {img: getImages()?.water, size: 64},
			// "M": {img: getImages()?.mario, size: 16},
			"tilesetSample": {img: getImages()?.tilesetSample, size: 64},
			// "cobblestone": {img: getImages()?.cobblestone, size: 32},
			// "character": {img: getImages()?.character, size: 64},
			// "water": {img: getImages()?.water, size: 64},
			// "mario": {img: getImages()?.mario, size: 16},
		}

		LoadAllLevels()
		.then(lvls => {
			for(let k in lvls){
				const idx= {};
				for(let ke in lvls[k].tileIndex){
					const t= lvls[k].tileIndex[ke];
					idx[ke]= new Tile(
						this.tileAtlas[t.spriteSheet].img,
						t.alias,
						t.spriteX,
						t.spriteY,
						t.spriteWidth,
						t.spriteHeight,
						t.drawWidth,
						t.drawHeight,
						t.drawX,
						t.drawY,
					);
				};
				lvls[k].tileIndex= idx;
			}
			this.init(lvls);
			this.loadLevel(lvls["level1"]);
		})
		.catch(err => {throw err});
	}

	init(allLevels) {
		console.log(allLevels);
		const levelData= allLevels["level1"];
		this.stateManager.setState(levelData);
		this.sidebarwidth= window.width * 0.25;
		this.bottombarHeight= window.height * 0.33;

		const levelSelectorObj= new GameObject();
		const levelselector= new LevelSelector(levelSelectorObj, 4, allLevels);
		levelSelectorObj.AddComponent(levelselector);

		const mainCamera= new Camera(window.width-this.sidebarwidth, window.height-this.bottombarHeight);

		// window.camera= new Camera(760, 512);
		// window.camera= new Camera(1440, 900);
		// window.camera= new Camera(2000, 2000);
		// window.camera= new Camera(window.width, window.height);


		const mainScreenObject= new GameObject();
		const mainScreen= new Screen(new Vector(this.sidebarwidth, 0), mainCamera.width, mainCamera.height);
		ScreenManager.addScreen("main", mainScreen);
		this.mainEditor= new TileEditor(mainScreenObject, {
			camera: mainCamera, layer: 2, tileIndex: {}, tileMap: [[]],
			tileSize: 64
		}, mainScreen);
		this.mainEditor.setDrawGrid(true);
		mainScreenObject.AddComponent(this.mainEditor);
		this.mainEditor.disabled= true;


		const bottomBarObject= new GameObject();
		const bottomCam= new Camera(window.width, this.bottombarHeight);
		const bottomScreen= new Screen(new Vector(0, window.height-this.bottombarHeight), bottomCam.width, bottomCam.height);
		ScreenManager.addScreen("bottom", bottomScreen);
		this.bottomBar= new TileSelector(bottomBarObject, {
			camera: bottomCam, layer: 4, tileSize: 32,
			tileIndex: levelData.tileIndex,
		}, bottomScreen);
		this.bottomBar.setDrawGrid(true);
		bottomBarObject.AddComponent(this.bottomBar);
		this.bottomBar.mainEditor= this.mainEditor;
	}

	loadLevel(lvl){
		this.mainEditor.tileIndex= lvl.tileIndex;
		this.mainEditor.tileMap= lvl.tileMap;
		this.mainEditor.tileSize= Object.values(lvl.tileIndex)[0].drawWidth;
		this.mainEditor.init();
		this.mainEditor.disabled= false;
	}
};






