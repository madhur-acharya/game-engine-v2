import TileEngine, {Tile} from "../components/tileEngine.js";
import {getImages} from "../constants.js";

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
		[1, 3, 3, 3, 1, 1, 3, 1, 1, 3, 3, 3, 1, 1, 3, 1,
		1, 3, 3, 3, 1, 1, 3, 1, 1, 3, 3, 3, 1, 1, 3, 1,
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 1,
		1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 1,
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1,
		1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1,
		1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1,
		1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1,
		1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1,
		1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1,
		1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1,
		1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1,],

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
	constructor(gameObj) {
		this.gameObject= gameObj;
	};

	Start= () => {
		const {tileAtlas, spriteMap, levelData}= load();
		const t1= new TileEngine(tileAtlas, spriteMap, levelData[0]);
		this.gameObject.addComponent(t1);
		const t2= new TileEngine(tileAtlas, spriteMap, levelData[1]);
		t2.type= "TileEngineL2";
		this.gameObject.addComponent(t2);
		this.ready= true;
	};

	Update= () => {};
}

export default GameLevel1;

