import TileEngine, {Tile} from "../../src/components/tileEngine.js";
import Input from "../../src/input.js";
import Vector from "../../src/vector.js";
import {GameObject} from "../../src/gameObject.js";
import {drawVector} from "../../src/utilityFunctions.js";
import {getImages} from "../../src/constants.js";

const generateSpriteMap= (sprite, conf) => {
	const tileSize= conf.tileSize;
	const cols= Math.floor(sprite.width/tileSize);
	const rows= Math.floor(sprite.height/tileSize);

	console.log(cols, rows);
	const tilemap= {
		"#": new Tile(conf.tileAtlas.water, "#", 0, 0, 64, 64)
	};
	const spriteSheet= [[]];

	for(let i=0; i<rows; i++) {
		for(let j=0; j<cols; j++) {
			const key= `${i}${j}`;
			tilemap[key]= new Tile(sprite, key, (j*tileSize), (i*tileSize), tileSize, tileSize);

			const maxColls= Math.floor(conf.camera.width/tileSize);
			const currSheet= spriteSheet[spriteSheet.length-1];
			currSheet.push(key);
			if(currSheet.length >= maxColls) {
				spriteSheet.push([]);
			}
		}
	};
	return [tilemap, spriteSheet];
}

class TileSelector extends TileEngine{
	constructor(conf= {}){
		const tileAtlas= {
			"tilesetSample": getImages()?.tilesetSample,
			"cobblestone": getImages()?.cobblestone,
			"water": getImages()?.water,
		};
		const [spriteMap, spriteSheet]= generateSpriteMap(tileAtlas.tilesetSample ,conf);

		super(
			conf.camera,
			conf.layer, 
			conf.tileAtlas,
			spriteMap,
			spriteSheet, 
			conf.tileSize,
		);

		this.gameObject= new GameObject();
		this.gameObject.AddComponent(this);
		this.ready= true;
	}

	Update(delta){
		// ---
		super.Update(delta);
	}

	preDraw(){
		super.draw();

		const cameraPos= this.camera.position;
		const mousePos= Input.getMousePos();

		const rowStartCam= Math.floor(cameraPos.y / this.trueTileSize);
		const colStartCam= Math.floor(cameraPos.x / this.trueTileSize);
		const offsetX= (colStartCam * this.trueTileSize) - cameraPos.x;
		const offsetY= (rowStartCam * this.trueTileSize) - cameraPos.y;

		const deltaPos= new Vector(mousePos.x - offsetX, mousePos.y - offsetY);
		const rowStart= Math.floor(deltaPos.y / this.trueTileSize);
		const colStart= Math.floor(deltaPos.x / this.trueTileSize);

		const tilePos= new Vector(
			(colStart * this.trueTileSize) + offsetX, 
			(rowStart * this.trueTileSize) + offsetY
		);
		context.save();
		context.lineWidth= "3";
		context.strokeStyle= "green";
		context.strokeRect(tilePos.x, tilePos.y, this.trueTileSize, this.trueTileSize);
		context.restore();

		context.save();
		context.lineWidth= "6";
		context.strokeStyle= "grey";
		context.strokeRect(0,0, this.trueTileSize*3, window.height);
		context.restore();
	}

	draw() {
		window.context.save();
		const region = new Path2D();
		region.rect(0, 0, this.trueTileSize*3, window.height);
		window.context.clip(region);
		this.preDraw();
		window.context.restore();
	}
};

export default TileSelector;
