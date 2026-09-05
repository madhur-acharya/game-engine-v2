import TileEngine, {Tile} from "../../src/components/tileEngine.js";
import Input from "../../src/input.js";
import Vector from "../../src/vector.js";
import {GameObject} from "../../src/gameObject.js";
import {drawVector} from "../../src/utilityFunctions.js";
import ScreenManager from "../../src/components/screen.js";


const generateTileMap= (tileIndex, tileSize, maxWidth) => {
	const tileMap= [[]];

	for(const key of Object.keys(tileIndex)) {
		const currSheet= tileMap[tileMap.length-1];
		currSheet.push(key);
		if(currSheet.length >= Math.floor(maxWidth/tileSize)) {
			tileMap.push([]);
		}
	};
	return tileMap;
}

class TileSelector extends TileEngine{
	selection= {
		tilePos: new Vector(),
		colStart: 0,
		rowStart: 0,
	};

	constructor(conf= {}, screen){
		const tileMap= generateTileMap(conf.tileIndex, conf.tileSize, conf.camera.width);

		super(
			conf.camera,
			conf.layer, 
			conf.tileIndex,
			tileMap, 
			conf.tileSize,
		);
		this.setScreen(screen);
		this.init();

		Input.addClickHandler("tileSelect", () => this._tileSelectHandler());

		this.ready= true;
	}

	_tileSelectHandler(){
		if(ScreenManager.ACTIVE_SCREEN != this.screen.key) return;

		this.selectedTile= {
			tileNumber: this.getTile(this.selection.rowStart, this.selection.colStart),
			position: this.selection.tilePos
		}
		this.mainEditor?.setActiveTile(this.selectedTile.tileNumber);
		console.log(this.selectedTile.tileNumber);
	}

	Update(delta){
		if(ScreenManager.ACTIVE_SCREEN != this.screen.key) return super.Update(delta);

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
