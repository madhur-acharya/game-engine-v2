import TileEngine, {Tile} from "../components/tileEngine.js";
import {getImages} from "../constants.js";

class GameLevel1{
	constructor(obj)
	{
		this.gameObject= obj;
		this.tileAtlas= {
			"tilesetSample": getImages()?.tilesetSample,
		}
	}

	Start= () => new Promise((resolve, reject) => {

		const levelData= [
			[
				1, 3, 3, 3, 1, 1, 3, 1, 1, 3, 3, 3, 1, 1, 3, 1,
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
				1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1,
			],
			[
				4, 3, 3, 3, 3, 3, 3, 4, 4, 3, 3, 3, 3, 3, 3, 4,
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
				0, 3, 3, 0, 0, 3, 3, 3, 0, 3, 3, 0, 0, 3, 3, 3,
			]
		];

		const spriteMap= {
			"@": new Tile(this.tileAtlas.tilesetSample, "@", 384, 0, 16, 16),
			"$": new Tile(this.tileAtlas.tilesetSample, "$", 0, 0, 16, 16),
			"#": new Tile(this.tileAtlas.tilesetSample, "#", 48, 368, 16, 16),

			"1": new Tile(this.tileAtlas.tilesetSample, "1", 0, 0, 64, 64),
			"2": new Tile(this.tileAtlas.tilesetSample, "2", 64, 0, 64, 64),
			"3": new Tile(this.tileAtlas.tilesetSample, "3", 128, 0, 64, 64),
			"4": new Tile(this.tileAtlas.tilesetSample, "4", 192, 0, 64, 64),
			"5": new Tile(this.tileAtlas.tilesetSample, "5", 256, 0, 64, 64),
			"0": new Tile(this.tileAtlas.tilesetSample, "1", 320, 0, 64, 64),
		};

		this.gameObject.addComponent(new TileEngine(this.tileAtlas, spriteMap, levelData));
		this.ready= true;
		
		resolve(true);

	});

	Update= () => {};
}

export default GameLevel1;

