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
		// "#": new Tile(conf.tileAtlas.water, "#", 0, 0, 64, 64)
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
	selection= {
		tilePos: new Vector(),
		colStart: 0,
		rowStart: 0,
	};

	constructor(conf= {}, screen){
		const tileAtlas= {
			"tilesetSample": getImages()?.tilesetSample,
			"cobblestone": getImages()?.cobblestone,
			"water": getImages()?.water,
		};
		const [spriteMap, spriteSheet]= generateSpriteMap(tileAtlas.tilesetSample ,conf);

		super(
			conf.camera,
			conf.layer, 
			tileAtlas,
			spriteMap,
			spriteSheet, 
			conf.tileSize,
		);
		this.setScreen(screen);
		this.init();

		this.gameObject= new GameObject();
		this.gameObject.AddComponent(this);

		Input.addClickHandler("tileSelect", () => this._tileSelectHandler());

		this.ready= true;
	}

	_tileSelectHandler(){
		const selection= this.selection;
		this.selectedTile= {
			tileNumber: this.getTile(selection.rowStart, selection.colStart),
			position: this.selection.tilePos
		}
		console.log(this.selectedTile.tileNumber);
	}

	Update(delta){
		const cameraPos= this.camera.position;
		const mousePos= Input.worldToScreenPoint(this.screen);

		const rowStartCam= Math.floor(cameraPos.y / this.trueTileSize);
		const colStartCam= Math.floor(cameraPos.x / this.trueTileSize);
		const offsetX= (colStartCam * this.trueTileSize) - cameraPos.x;
		const offsetY= (rowStartCam * this.trueTileSize) - cameraPos.y;

		const deltaPos= new Vector(mousePos.x - offsetX, mousePos.y - offsetY);
		const rowStart= Math.floor(deltaPos.y / this.trueTileSize);
		const colStart= Math.floor(deltaPos.x / this.trueTileSize);

		this.selection= {
			colStart, rowStart,
			tilePos: new Vector(
				(colStart * this.trueTileSize) + offsetX, 
				(rowStart * this.trueTileSize) + offsetY
			)
		}

		// ---
		super.Update(delta);
	}

	draw(){
		context.save();
		context.fillStyle= "white";
		context.fillRect(0, 0, this.screen.width, this.screen.height);
		context.restore();

		super.draw();

		const tilePos= this.selection.tilePos;
		context.save();
		context.lineWidth= "3";
		context.strokeStyle= "green";
		context.strokeRect(tilePos.x, tilePos.y, this.trueTileSize, this.trueTileSize);
		context.restore();

		context.save();
		context.lineWidth= "6";
		context.strokeStyle= "grey";
		context.strokeRect(0,0, this.screen.width, this.screen.height);
		context.restore();

		if(this.selectedTile) {
			context.save();
			context.fillStyle= 'rgba(0, 0, 255, 0.2)';
			const pos= this.selectedTile.position;
			context.fillRect(pos.x, pos.y, this.trueTileSize, this.trueTileSize);
			context.lineWidth= "3";
			context.strokeStyle= "cyan";
			context.strokeRect(pos.x, pos.y, this.trueTileSize, this.trueTileSize);
			context.restore();
		}
	}
};

export default TileSelector;
